"use client";

// ============================================================
// SAFETALK AI
// ADMIN REPORTS PAGE
// REAL MONGODB DATA + GRAPH ONLY EXPORT
// ============================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FileBarChart,
  Download,
  CalendarDays,
  TrendingUp,
  TriangleAlert,
  Skull,
  ShieldAlert,
  LoaderCircle,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


// ============================================================
// HELPERS
// ============================================================

function getSentiment(item) {
  return (
    item?.sentiment?.label ||
    "Unknown"
  );
}


function getPrimaryThreat(item) {
  return (
    item?.primaryThreat?.label ||
    "No Threat"
  );
}


function getToxicityLabel(item) {
  return (
    item?.toxicity?.label ||
    "Non-Toxic"
  );
}


function getRiskLevel(item) {
  return (
    item?.riskLevel ||
    "Low"
  );
}


function getLanguage(item) {
  return (
    item?.language ||
    "Unknown"
  );
}


function isThreat(item) {
  return (
    Number(
      item?.isThreat
    ) === 1
  );
}


function isToxic(item) {
  return (
    getToxicityLabel(item)
      .toLowerCase() ===
    "toxic"
  );
}


// ============================================================
// CURRENT MONTH
// ============================================================

function getCurrentMonthValue() {

  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}`;
}


// ============================================================
// REPORTS PAGE
// ============================================================

export default function ReportsPage() {

  // ==========================================================
  // STATES
  // ==========================================================

  const [
    analyses,
    setAnalyses,
  ] = useState([]);


  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState(
    getCurrentMonthValue()
  );


  const [
    reportType,
    setReportType,
  ] = useState(
    "monthly"
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // LOAD ALL ANALYSES
  // ==========================================================

  useEffect(() => {

    const loadReports =
      async () => {

        try {

          setLoading(true);

          setError("");


          const response =
            await fetch(
              "/api/analyses?search=&risk=all&page=1&limit=100",
              {
                cache:
                  "no-store",
              }
            );


          const data =
            await response.json();


          if (
            !response.ok
          ) {

            throw new Error(
              data?.message ||
              "Unable to load report data."
            );
          }


          let allAnalyses =
            Array.isArray(
              data?.analyses
            )
              ? [
                  ...data.analyses,
                ]
              : [];


          const pages =
            Number(
              data
                ?.pagination
                ?.pages ||
              1
            );


          if (
            pages > 1
          ) {

            for (
              let page = 2;
              page <= pages;
              page++
            ) {

              const nextResponse =
                await fetch(
                  `/api/analyses?search=&risk=all&page=${page}&limit=100`,
                  {
                    cache:
                      "no-store",
                  }
                );


              if (
                !nextResponse.ok
              ) {
                continue;
              }


              const nextData =
                await nextResponse
                  .json();


              if (
                Array.isArray(
                  nextData?.analyses
                )
              ) {

                allAnalyses =
                  allAnalyses.concat(
                    nextData.analyses
                  );
              }

            }

          }


          setAnalyses(
            allAnalyses
          );


        } catch (
          reportError
        ) {

          console.error(
            "REPORT ERROR:",
            reportError
          );


          setError(
            reportError
              ?.message ||
            "Unable to load reports."
          );


        } finally {

          setLoading(false);

        }

      };


    loadReports();

  }, []);


  // ==========================================================
  // MONTH FILTER
  // ==========================================================

  const monthAnalyses =
    useMemo(
      () => {

        if (
          !selectedMonth
        ) {
          return analyses;
        }


        const [
          year,
          month,
        ] =
          selectedMonth
            .split("-")
            .map(Number);


        return analyses.filter(
          (item) => {

            if (
              !item?.createdAt
            ) {
              return false;
            }


            const date =
              new Date(
                item.createdAt
              );


            if (
              Number.isNaN(
                date.getTime()
              )
            ) {
              return false;
            }


            return (
              date.getFullYear() ===
                year &&
              date.getMonth() ===
                month - 1
            );

          }
        );

      },
      [
        analyses,
        selectedMonth,
      ]
    );


  // ==========================================================
  // DAILY / WEEKLY / MONTHLY FILTER
  // ==========================================================

  const reportAnalyses =
    useMemo(
      () => {

        if (
          reportType ===
          "monthly"
        ) {
          return monthAnalyses;
        }


        if (
          monthAnalyses.length ===
          0
        ) {
          return [];
        }


        const validDates =
          monthAnalyses
            .filter(
              (item) =>
                item?.createdAt
            )
            .map(
              (item) =>
                new Date(
                  item.createdAt
                )
            )
            .filter(
              (date) =>
                !Number.isNaN(
                  date.getTime()
                )
            );


        if (
          validDates.length ===
          0
        ) {
          return [];
        }


        const latestDate =
          new Date(
            Math.max(
              ...validDates.map(
                (date) =>
                  date.getTime()
              )
            )
          );


        // DAILY
        if (
          reportType ===
          "daily"
        ) {

          const start =
            new Date(
              latestDate
            );

          start.setHours(
            0,
            0,
            0,
            0
          );


          const end =
            new Date(
              start
            );

          end.setDate(
            end.getDate() + 1
          );


          return monthAnalyses.filter(
            (item) => {

              const date =
                new Date(
                  item.createdAt
                );

              return (
                date >= start &&
                date < end
              );

            }
          );

        }


        // WEEKLY
        if (
          reportType ===
          "weekly"
        ) {

          const end =
            new Date(
              latestDate
            );

          end.setHours(
            23,
            59,
            59,
            999
          );


          const start =
            new Date(
              end
            );

          start.setDate(
            start.getDate() -
              6
          );

          start.setHours(
            0,
            0,
            0,
            0
          );


          return monthAnalyses.filter(
            (item) => {

              const date =
                new Date(
                  item.createdAt
                );

              return (
                date >= start &&
                date <= end
              );

            }
          );

        }


        return monthAnalyses;

      },
      [
        monthAnalyses,
        reportType,
      ]
    );


  // ==========================================================
  // SUMMARY STATS
  // ==========================================================

  const stats =
    useMemo(
      () => {

        return {

          total:
            reportAnalyses
              .length,

          threats:
            reportAnalyses
              .filter(
                isThreat
              )
              .length,

          toxic:
            reportAnalyses
              .filter(
                isToxic
              )
              .length,

          critical:
            reportAnalyses
              .filter(
                (item) =>
                  getRiskLevel(
                    item
                  ) ===
                  "Critical"
              )
              .length,

        };

      },
      [reportAnalyses]
    );


  // ==========================================================
  // THREAT CATEGORY DATA
  // ==========================================================

  const threatData =
    useMemo(
      () => {

        const counts = {

          "Physical Threat":
            0,

          "Death Threat":
            0,

          "Harassment":
            0,

          "Abusive Language":
            0,

          "Cyber Threat":
            0,

          "Hate Speech":
            0,

          "Sexual Threat":
            0,

          "Self-Harm Related":
            0,

        };


        reportAnalyses.forEach(
          (item) => {

            const category =
              getPrimaryThreat(
                item
              );


            if (
              Object.prototype
                .hasOwnProperty
                .call(
                  counts,
                  category
                )
            ) {

              counts[
                category
              ] += 1;

            }

          }
        );


        return [

          {
            category:
              "Physical",

            count:
              counts[
                "Physical Threat"
              ],
          },

          {
            category:
              "Death",

            count:
              counts[
                "Death Threat"
              ],
          },

          {
            category:
              "Harassment",

            count:
              counts[
                "Harassment"
              ],
          },

          {
            category:
              "Abusive",

            count:
              counts[
                "Abusive Language"
              ],
          },

          {
            category:
              "Cyber",

            count:
              counts[
                "Cyber Threat"
              ],
          },

          {
            category:
              "Hate",

            count:
              counts[
                "Hate Speech"
              ],
          },

          {
            category:
              "Sexual",

            count:
              counts[
                "Sexual Threat"
              ],
          },

          {
            category:
              "Self-Harm",

            count:
              counts[
                "Self-Harm Related"
              ],
          },

        ];

      },
      [reportAnalyses]
    );


  // ==========================================================
  // EXTRA STATS
  // ==========================================================

  const extraStats =
    useMemo(
      () => {

        const sentiment = {
          Positive: 0,
          Neutral: 0,
          Negative: 0,
        };


        const risk = {
          Low: 0,
          Medium: 0,
          High: 0,
          Critical: 0,
        };


        const language = {
          English: 0,
          Urdu: 0,
          "Roman Urdu": 0,
          Unknown: 0,
        };


        reportAnalyses.forEach(
          (item) => {

            const sentimentLabel =
              getSentiment(
                item
              );


            if (
              sentiment[
                sentimentLabel
              ] !==
              undefined
            ) {

              sentiment[
                sentimentLabel
              ] += 1;

            }


            const riskLevel =
              getRiskLevel(
                item
              );


            if (
              risk[
                riskLevel
              ] !==
              undefined
            ) {

              risk[
                riskLevel
              ] += 1;

            }


            const languageLabel =
              getLanguage(
                item
              );


            if (
              language[
                languageLabel
              ] !==
              undefined
            ) {

              language[
                languageLabel
              ] += 1;

            } else {

              language.Unknown +=
                1;

            }

          }
        );


        return {
          sentiment,
          risk,
          language,
        };

      },
      [reportAnalyses]
    );


  // ==========================================================
  // MONTH LABEL
  // ==========================================================

  const monthLabel =
    useMemo(
      () => {

        if (
          !selectedMonth
        ) {
          return "All";
        }


        const [
          year,
          month,
        ] =
          selectedMonth
            .split("-")
            .map(Number);


        return new Date(
          year,
          month - 1,
          1
        ).toLocaleDateString(
          "en-US",
          {
            month:
              "long",

            year:
              "numeric",
          }
        );

      },
      [selectedMonth]
    );


  // ==========================================================
  // EXPORT ONLY GRAPH
  // ==========================================================

  const exportPDF =
    () => {

      window.print();

  };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div className="admin-module-page">

        <section className="module-card">

          <div
            style={{
              minHeight:
                "250px",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              gap:
                "10px",
            }}
          >

            <LoaderCircle
              size={24}
            />

            Loading report data...

          </div>

        </section>

      </div>
    );
  }


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

            <FileBarChart
              size={22}
            />

          </div>


          <div>

            <h1>
              Reports
            </h1>

            <p>
              View real SafeTalkAI analysis
              statistics and export reports.
            </p>

          </div>

        </div>


        <div className="report-header-actions">


          {/* MONTH */}

          <div
            className="module-secondary-button"
          >

            <CalendarDays
              size={16}
            />

            <input
              type="month"
              value={
                selectedMonth
              }
              onChange={
                (event) =>
                  setSelectedMonth(
                    event.target
                      .value
                  )
              }
              style={{
                border:
                  "none",

                outline:
                  "none",

                background:
                  "transparent",

                color:
                  "inherit",

                font:
                  "inherit",
              }}
            />

          </div>


          {/* EXPORT */}

          <button
            type="button"
            className="module-primary-button"
            onClick={
              exportPDF
            }
          >

            <Download
              size={17}
            />

            Export PDF

          </button>

        </div>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <section className="module-card">

          <p
            style={{
              color:
                "#ef4058",
            }}
          >
            {error}
          </p>

        </section>

      )}


      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <section className="report-stat-grid">


        <div className="report-stat-card">

          <TrendingUp
            size={23}
          />

          <div>

            <span>
              Total Analyses
            </span>

            <strong>
              {stats.total}
            </strong>

          </div>

        </div>


        <div className="report-stat-card danger">

          <TriangleAlert
            size={23}
          />

          <div>

            <span>
              Threats
            </span>

            <strong>
              {stats.threats}
            </strong>

          </div>

        </div>


        <div className="report-stat-card purple">

          <Skull
            size={23}
          />

          <div>

            <span>
              Toxic Content
            </span>

            <strong>
              {stats.toxic}
            </strong>

          </div>

        </div>


        <div className="report-stat-card orange">

          <ShieldAlert
            size={23}
          />

          <div>

            <span>
              Critical Risk
            </span>

            <strong>
              {stats.critical}
            </strong>

          </div>

        </div>

      </section>


      {/* ======================================================
          GRAPH
          ONLY THIS SECTION WILL PRINT
      ====================================================== */}

      <section className="module-card report-print-chart">

        <div className="module-card-header">

          <div>

            <h2>
              Threat Category Report
            </h2>

            <p>
              Threat distribution for
              {" "}
              {monthLabel}.
            </p>

          </div>

        </div>


        <div className="report-chart">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={
                threatData
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e7edf6"
              />


              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill:
                    "#77809a",

                  fontSize:
                    11,
                }}
              />


              <YAxis
                allowDecimals={
                  false
                }
                axisLine={false}
                tickLine={false}
                tick={{
                  fill:
                    "#77809a",

                  fontSize:
                    11,
                }}
              />


              <Tooltip />


              <Bar
                dataKey="count"
                name="Detected"
                fill="#8438ff"
                radius={[
                  7,
                  7,
                  0,
                  0,
                ]}
                barSize={38}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </section>


      {/* ======================================================
          REPORT TYPES
      ====================================================== */}

      <section className="report-type-grid">


        <div className="report-type-card">

          <span>
            Daily
          </span>

          <h3>
            Daily Analysis Report
          </h3>

          <p>
            Latest analysis day from
            selected month.
          </p>

          <button
            type="button"
            onClick={() =>
              setReportType(
                "daily"
              )
            }
          >
            {
              reportType ===
              "daily"
                ? "Active Report"
                : "Generate Report"
            }
          </button>

        </div>


        <div className="report-type-card">

          <span>
            Weekly
          </span>

          <h3>
            Weekly Analysis Report
          </h3>

          <p>
            Latest seven-day report.
          </p>

          <button
            type="button"
            onClick={() =>
              setReportType(
                "weekly"
              )
            }
          >
            {
              reportType ===
              "weekly"
                ? "Active Report"
                : "Generate Report"
            }
          </button>

        </div>


        <div className="report-type-card">

          <span>
            Monthly
          </span>

          <h3>
            Monthly Analysis Report
          </h3>

          <p>
            Complete selected-month
            summary.
          </p>

          <button
            type="button"
            onClick={() =>
              setReportType(
                "monthly"
              )
            }
          >
            {
              reportType ===
              "monthly"
                ? "Active Report"
                : "Generate Report"
            }
          </button>

        </div>

      </section>


      {/* ======================================================
          EXTRA STATISTICS
      ====================================================== */}

      <section
        className="report-type-grid"
        style={{
          marginTop:
            "20px",
        }}
      >


        <div className="report-type-card">

          <span>
            Sentiment
          </span>

          <h3>
            Sentiment Distribution
          </h3>

          <p>
            Positive:
            {" "}
            <strong>
              {
                extraStats
                  .sentiment
                  .Positive
              }
            </strong>
          </p>

          <p>
            Neutral:
            {" "}
            <strong>
              {
                extraStats
                  .sentiment
                  .Neutral
              }
            </strong>
          </p>

          <p>
            Negative:
            {" "}
            <strong>
              {
                extraStats
                  .sentiment
                  .Negative
              }
            </strong>
          </p>

        </div>


        <div className="report-type-card">

          <span>
            Risk
          </span>

          <h3>
            Risk Distribution
          </h3>

          <p>
            Low:
            {" "}
            <strong>
              {
                extraStats
                  .risk
                  .Low
              }
            </strong>
          </p>

          <p>
            Medium:
            {" "}
            <strong>
              {
                extraStats
                  .risk
                  .Medium
              }
            </strong>
          </p>

          <p>
            High:
            {" "}
            <strong>
              {
                extraStats
                  .risk
                  .High
              }
            </strong>
          </p>

          <p>
            Critical:
            {" "}
            <strong>
              {
                extraStats
                  .risk
                  .Critical
              }
            </strong>
          </p>

        </div>


        <div className="report-type-card">

          <span>
            Languages
          </span>

          <h3>
            Language Distribution
          </h3>

          <p>
            English:
            {" "}
            <strong>
              {
                extraStats
                  .language
                  .English
              }
            </strong>
          </p>

          <p>
            Urdu:
            {" "}
            <strong>
              {
                extraStats
                  .language
                  .Urdu
              }
            </strong>
          </p>

          <p>
            Roman Urdu:
            {" "}
            <strong>
              {
                extraStats
                  .language[
                    "Roman Urdu"
                  ]
              }
            </strong>
          </p>

        </div>

      </section>


      {/* ======================================================
          PRINT CSS
      ====================================================== */}

      <style jsx global>{`

        @media print {

          body * {
            visibility: hidden !important;
          }


          .report-print-chart,
          .report-print-chart * {
            visibility: visible !important;
          }


          .report-print-chart {
            position: absolute !important;

            top: 0 !important;
            left: 0 !important;

            width: 100% !important;

            margin: 0 !important;
            padding: 30px !important;

            border: none !important;
            border-radius: 0 !important;

            box-shadow: none !important;

            background: white !important;
          }


          .report-print-chart .report-chart {
            width: 100% !important;
            height: 520px !important;
          }


          .report-print-chart .module-card-header {
            display: block !important;

            padding-bottom: 18px !important;

            border-bottom:
              1px solid #e7edf6 !important;
          }


          .report-print-chart .module-card-header h2 {
            color: #111827 !important;

            font-size: 24px !important;
          }


          .report-print-chart .module-card-header p {
            color: #64748b !important;

            font-size: 13px !important;
          }


          @page {
            size: landscape;
            margin: 15mm;
          }

        }

      `}</style>


    </div>
  );
}