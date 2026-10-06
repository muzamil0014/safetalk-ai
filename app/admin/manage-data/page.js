"use client";

// ============================================================
// SAFETALK AI
// MANAGE DATA
// REAL MONGODB BACKEND
// TRAINING READY CSV EXPORT
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Database,
  Search,
  Filter,
  Trash2,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";


// ============================================================
// MAIN PAGE
// ============================================================

export default function ManageDataPage() {


  // ==========================================================
  // STATES
  // ==========================================================

  const [records, setRecords] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [riskFilter, setRiskFilter] =
    useState("all");

  const [languageFilter, setLanguageFilter] =
    useState("all");

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [exporting, setExporting] =
    useState(false);


  // ==========================================================
  // LOAD RECORDS
  // ==========================================================

  const loadRecords =
    async () => {

      setLoading(true);

      setError("");


      try {

        const params =
          new URLSearchParams({

            search,

            risk:
              riskFilter,

            language:
              languageFilter,

            page:
              String(page),

            limit:
              "10",

          });


        const response =
          await fetch(
            `/api/analyses?${params.toString()}`,
            {
              cache:
                "no-store",
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
            "Unable to load records."
          );

          return;

        }


        setRecords(
          data.analyses ||
          []
        );


        setPages(
          data.pagination?.pages ||
          1
        );


        setTotal(
          data.pagination?.total ||
          0
        );

      } catch (error) {

        console.error(
          "LOAD DATA ERROR:",
          error
        );


        setError(
          "Unable to connect to server."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // AUTO LOAD
  // ==========================================================

  useEffect(() => {

    const timer =
      setTimeout(
        () => {

          loadRecords();

        },
        300
      );


    return () =>
      clearTimeout(
        timer
      );

  }, [
    search,
    riskFilter,
    languageFilter,
    page,
  ]);


  // ==========================================================
  // DELETE RECORD
  // ==========================================================

  const deleteRecord =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this analysis?"
        );


      if (!confirmed) {
        return;
      }


      try {

        const response =
          await fetch(
            `/api/analyses/${id}`,
            {
              method:
                "DELETE",
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          alert(
            data.message ||
            "Unable to delete record."
          );

          return;

        }


        await loadRecords();

      } catch (error) {

        console.error(
          "DELETE ERROR:",
          error
        );


        alert(
          "Unable to delete record."
        );

      }

    };


  // ==========================================================
  // CSV SAFE VALUE
  // ==========================================================

  const csvValue =
    (value) => {

      const text =
        String(
          value ?? ""
        );


      return `"${text.replace(
        /"/g,
        '""'
      )}"`;

    };


  // ==========================================================
  // SAFE NUMBER
  // ==========================================================

  const safeNumber =
    (value) => {

      const number =
        Number(value);


      return Number.isFinite(
        number
      )
        ? number
        : 0;

    };


  // ==========================================================
  // EXPORT ALL DATABASE RECORDS
  //
  // IMPORTANT:
  // - NOT ONLY CURRENT PAGE
  // - DOES NOT EXPORT DATE
  // - DOES NOT APPLY PAGE FILTER
  // - TRAINING FRIENDLY FIELDS
  // ==========================================================

  const exportCSV =
    async () => {

      if (exporting) {
        return;
      }


      setExporting(true);


      try {

        let exportPage =
          1;

        let exportPages =
          1;

        let allRecords =
          [];


        // ======================================================
        // LOAD ALL DATABASE RECORDS
        // 100 RECORDS PER REQUEST
        // ======================================================

        do {

          const params =
            new URLSearchParams({

              page:
                String(
                  exportPage
                ),

              limit:
                "100",

              search:
                "",

              risk:
                "all",

              language:
                "all",

            });


          const response =
            await fetch(
              `/api/analyses?${params.toString()}`,
              {
                cache:
                  "no-store",
              }
            );


          const data =
            await response.json();


          if (!response.ok) {

            throw new Error(
              data.message ||
              "Unable to export analysis records."
            );

          }


          allRecords = [
            ...allRecords,
            ...(data.analyses || []),
          ];


          exportPages =
            data.pagination?.pages ||
            1;


          exportPage +=
            1;

        } while (
          exportPage <=
          exportPages
        );


        // ======================================================
        // EMPTY DATA
        // ======================================================

        if (
          allRecords.length ===
          0
        ) {

          alert(
            "No analysis records found."
          );

          return;

        }


        // ======================================================
        // TRAINING READY CSV HEADERS
        //
        // DATE INTENTIONALLY NOT INCLUDED
        // ======================================================

        const headers = [

          "Text",

          "Language",

          "Sentiment Label",

          "Sentiment Confidence",

          "Is Threat",

          "Threat Status",

          "Primary Threat Category",

          "Primary Threat Confidence",

          "Toxicity Label",

          "Toxicity Confidence",

          "Hate Speech Label",

          "Hate Speech Confidence",

          "Risk Level",

          "Risk Score",

          "Source",

        ];


        // ======================================================
        // CSV ROWS
        // ======================================================

        const rows =
          allRecords.map(
            (record) => {

              // ================================================
              // SENTIMENT
              // ================================================

              const sentimentLabel =
                record.sentiment?.label ||
                "Neutral";


              const sentimentConfidence =
                safeNumber(
                  record.sentiment?.confidence
                );


              // ================================================
              // THREAT
              // ================================================

              const isThreat =
                Number(
                  record.isThreat ||
                  0
                ) === 1
                  ? 1
                  : 0;


              const threatStatus =
                record.threatStatus ||
                (
                  isThreat === 1
                    ? "Threat Detected"
                    : "No Threat"
                );


              const primaryThreatLabel =
                record.primaryThreat?.label ||
                "No Threat";


              const primaryThreatConfidence =
                safeNumber(
                  record.primaryThreat?.confidence
                );


              // ================================================
              // TOXICITY
              // ================================================

              const toxicityLabel =
                record.toxicity?.label ||
                "Non-Toxic";


              const toxicityConfidence =
                safeNumber(
                  record.toxicity?.confidence
                );


              // ================================================
              // HATE SPEECH
              // ================================================

              const hateSpeechLabel =
                record.hateSpeech?.label ||
                "Non-Hate";


              const hateSpeechConfidence =
                safeNumber(
                  record.hateSpeech?.confidence
                );


              // ================================================
              // RISK
              // ================================================

              const riskLevel =
                record.riskLevel ||
                "Low";


              const riskScore =
                safeNumber(
                  record.riskScore
                );


              // ================================================
              // LANGUAGE
              // ================================================

              const language =
                record.language ||
                "Unknown";


              // ================================================
              // SOURCE
              // ================================================

              const source =
                record.source ||
                "Manual";


              // ================================================
              // RETURN ROW
              // ================================================

              return [

                csvValue(
                  record.text ||
                  ""
                ),

                csvValue(
                  language
                ),

                csvValue(
                  sentimentLabel
                ),

                csvValue(
                  sentimentConfidence
                ),

                csvValue(
                  isThreat
                ),

                csvValue(
                  threatStatus
                ),

                csvValue(
                  primaryThreatLabel
                ),

                csvValue(
                  primaryThreatConfidence
                ),

                csvValue(
                  toxicityLabel
                ),

                csvValue(
                  toxicityConfidence
                ),

                csvValue(
                  hateSpeechLabel
                ),

                csvValue(
                  hateSpeechConfidence
                ),

                csvValue(
                  riskLevel
                ),

                csvValue(
                  riskScore
                ),

                csvValue(
                  source
                ),

              ];

            }
          );


        // ======================================================
        // CREATE CSV
        //
        // UTF-8 BOM:
        // IMPORTANT FOR URDU / ROMAN URDU / EXCEL
        // ======================================================

        const csv =

          "\uFEFF" +

          [

            headers.join(","),

            ...rows.map(
              (row) =>
                row.join(",")
            ),

          ].join("\n");


        // ======================================================
        // CREATE CSV FILE
        // ======================================================

        const blob =
          new Blob(
            [csv],
            {
              type:
                "text/csv;charset=utf-8;",
            }
          );


        const url =
          URL.createObjectURL(
            blob
          );


        const link =
          document.createElement(
            "a"
          );


        link.href =
          url;


        link.download =
          "safetalk-training-dataset.csv";


        document.body.appendChild(
          link
        );


        link.click();


        document.body.removeChild(
          link
        );


        URL.revokeObjectURL(
          url
        );


      } catch (error) {

        console.error(
          "EXPORT ERROR:",
          error
        );


        alert(
          error?.message ||
          "Unable to export records."
        );

      } finally {

        setExporting(false);

      }

    };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="admin-module-page">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="module-page-header">

        <div className="module-page-title">

          <div className="module-title-icon">

            <Database size={22} />

          </div>


          <div>

            <h1>
              Manage Data
            </h1>


            <p>
              Search, filter and manage real
              SafeTalkAI analysis records.
            </p>

          </div>

        </div>


        {/* ====================================================
            EXPORT ALL RECORDS
        ==================================================== */}

        <button
          type="button"
          className="module-primary-button"
          onClick={exportCSV}
          disabled={exporting}
        >

          {exporting ? (

            <LoaderCircle
              size={17}
              className="analysis-spinner"
            />

          ) : (

            <Download size={17} />

          )}


          {exporting
            ? "Exporting..."
            : "Export Training CSV"}

        </button>

      </div>


      {/* ======================================================
          FILTERS
      ====================================================== */}

      <section className="module-card">

        <div className="manage-filter-row">


          {/* SEARCH */}

          <div className="module-search-box manage-search">

            <Search size={16} />


            <input
              type="text"
              placeholder="Search analyzed text..."
              value={search}
              onChange={(event) => {

                setSearch(
                  event.target.value
                );

                setPage(1);

              }}
            />

          </div>


          {/* RISK */}

          <div className="module-select-wrapper">

            <Filter size={15} />


            <select
              value={riskFilter}
              onChange={(event) => {

                setRiskFilter(
                  event.target.value
                );

                setPage(1);

              }}
            >

              <option value="all">
                All Risk Levels
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Critical">
                Critical
              </option>

            </select>

          </div>


          {/* LANGUAGE */}

          <div className="module-select-wrapper">

            <select
              value={languageFilter}
              onChange={(event) => {

                setLanguageFilter(
                  event.target.value
                );

                setPage(1);

              }}
            >

              <option value="all">
                All Languages
              </option>

              <option value="English">
                English
              </option>

              <option value="Urdu">
                Urdu
              </option>

              <option value="Roman Urdu">
                Roman Urdu
              </option>

            </select>

          </div>

        </div>

      </section>


      {/* ======================================================
          TABLE
      ====================================================== */}

      <section className="module-card">

        <div className="module-card-header">

          <div>

            <h2>
              Analysis Records
            </h2>


            <p>
              {total} total records found.
            </p>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="profile-message">

            {error}

          </div>

        )}


        {/* ====================================================
            DATA
        ==================================================== */}

        {loading ? (

          <div className="profile-loading">

            <LoaderCircle
              size={24}
              className="analysis-spinner"
            />

            Loading analysis data...

          </div>

        ) : (

          <div className="module-table-wrapper">

            <table className="module-table large">

              <thead>

                <tr>

                  <th>
                    Text
                  </th>

                  <th>
                    Sentiment
                  </th>

                  <th>
                    Threat Category
                  </th>

                  <th>
                    Toxicity
                  </th>

                  <th>
                    Risk
                  </th>

                  <th>
                    Language
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {records.length > 0 ? (

                  records.map(
                    (record) => (

                      <tr
                        key={
                          record._id
                        }
                      >


                        {/* TEXT */}

                        <td className="module-text-cell">

                          {record.text}

                        </td>


                        {/* SENTIMENT */}

                        <td>

                          <span
                            className={`table-sentiment ${
                              (
                                record.sentiment
                                  ?.label ||
                                "Neutral"
                              ).toLowerCase()
                            }`}
                          >

                            {record.sentiment
                              ?.label ||
                              "Neutral"}

                          </span>

                        </td>


                        {/* THREAT */}

                        <td>

                          <span className="table-purple-badge">

                            {record.primaryThreat
                              ?.label ||
                              "No Threat"}

                          </span>

                        </td>


                        {/* TOXICITY */}

                        <td>

                          {safeNumber(
                            record.toxicity
                              ?.confidence
                          ).toFixed(2)}%

                        </td>


                        {/* RISK */}

                        <td>

                          <span
                            className={`table-risk-badge ${
                              (
                                record.riskLevel ||
                                "Low"
                              ).toLowerCase()
                            }`}
                          >

                            {record.riskLevel ||
                              "Low"}

                          </span>

                        </td>


                        {/* LANGUAGE */}

                        <td>

                          {record.language ||
                            "--"}

                        </td>


                        {/* DATE
                            DATE TABLE ME SHOW HOGI
                            CSV ME EXPORT NAHI HOGI
                        */}

                        <td>

                          {record.createdAt
                            ? new Date(
                                record.createdAt
                              ).toLocaleString()
                            : "--"}

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="table-action-buttons">


                            <button
                              type="button"
                              className="table-view-button"
                              title="View"
                              onClick={() =>
                                alert(
                                  record.text
                                )
                              }
                            >

                              <Eye
                                size={15}
                              />

                            </button>


                            <button
                              type="button"
                              className="table-delete-button"
                              title="Delete"
                              onClick={() =>
                                deleteRecord(
                                  record._id
                                )
                              }
                            >

                              <Trash2
                                size={15}
                              />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      style={{
                        textAlign:
                          "center",

                        padding:
                          "35px",
                      }}
                    >

                      No analysis records found.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}


        {/* ====================================================
            PAGINATION
        ==================================================== */}

        <div className="module-pagination">

          <span>

            Page {page} of {pages}

          </span>


          <div>

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                page <= 1
              }
              onClick={() =>
                setPage(
                  page - 1
                )
              }
            >

              <ChevronLeft
                size={16}
              />

            </button>


            {/* CURRENT */}

            <button
              type="button"
              className="active"
            >

              {page}

            </button>


            {/* NEXT */}

            <button
              type="button"
              disabled={
                page >= pages
              }
              onClick={() =>
                setPage(
                  page + 1
                )
              }
            >

              <ChevronRight
                size={16}
              />

            </button>

          </div>

        </div>

      </section>

    </div>

  );
}