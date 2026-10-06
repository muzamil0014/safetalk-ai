"use client";

// ============================================================
// SAFETALK AI
// USER ANALYSIS HISTORY
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Search,
  History,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

import PublicNavbar
  from "@/components/public/PublicNavbar";


// ============================================================
// MAIN PAGE
// ============================================================

export default function HistoryPage() {

  // ==========================================================
  // STATES
  // ==========================================================

  const [items, setItems] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [risk, setRisk] =
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


  // ==========================================================
  // LOAD HISTORY
  // ==========================================================

  const loadHistory =
    async () => {

      setLoading(true);

      setError("");


      try {

        const params =
          new URLSearchParams({

            search,

            risk,

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
            "Unable to load history."
          );

          return;

        }


        setItems(
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

      } catch {

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
        loadHistory,
        300
      );


    return () =>
      clearTimeout(
        timer
      );

  }, [
    search,
    risk,
    page,
  ]);


  return (

    <main className="public-account-page">

      <PublicNavbar />


      <div className="public-account-container">


        {/* ====================================================
            TOP
        ==================================================== */}

        <div className="public-account-top">

          <Link href="/">

            <ArrowLeft size={17} />

            Back to SafeTalkAI

          </Link>


          <Link
            href="/profile"
            className="public-history-button"
          >
            Profile
          </Link>

        </div>


        {/* ====================================================
            HEADING
        ==================================================== */}

        <div className="public-account-heading">

          <span>
            YOUR ACTIVITY
          </span>


          <h1>
            Analysis History
          </h1>


          <p>
            Review your previous SafeTalkAI
            analysis results.
          </p>

        </div>


        {/* ====================================================
            CARD
        ==================================================== */}

        <section className="public-history-card">


          {/* HEADER */}

          <div className="public-history-header">

            <div>

              <h2>

                <History size={20} />

                Your Analyses

              </h2>


              <p>
                {total} analysis records
              </p>

            </div>

          </div>


          {/* ==================================================
              FILTERS
          ================================================== */}

          <div className="public-history-filters">

            <div>

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


            <select
              value={risk}
              onChange={(event) => {

                setRisk(
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


          {/* ERROR */}

          {error && (

            <div className="public-profile-message error">

              {error}

            </div>

          )}


          {/* ==================================================
              DATA
          ================================================== */}

          {loading ? (

            <div className="public-account-loading">

              <LoaderCircle
                className="analysis-spinner"
                size={25}
              />

              Loading history...

            </div>

          ) : (

            <div className="public-history-table-wrapper">

              <table className="public-history-table">

                <thead>

                  <tr>

                    <th>Text</th>
                    <th>Sentiment</th>
                    <th>Threat</th>
                    <th>Toxicity</th>
                    <th>Risk</th>
                    <th>Language</th>
                    <th>Date</th>

                  </tr>

                </thead>


                <tbody>

                  {items.length > 0 ? (

                    items.map(
                      (item) => (

                        <tr key={item._id}>

                          <td className="history-text">

                            {item.text}

                          </td>


                          <td>

                            {item.sentiment?.label ||
                              "--"}

                          </td>


                          <td>

                            {item.primaryThreat?.label ||
                              "No Threat"}

                          </td>


                          <td>

                            {item.toxicity?.confidence ||
                              0}%

                          </td>


                          <td>

                            <span
                              className={`public-risk-badge ${
                                item.riskLevel
                                  ?.toLowerCase() ||
                                "low"
                              }`}
                            >

                              {item.riskLevel}

                            </span>

                          </td>


                          <td>
                            {item.language}
                          </td>


                          <td>

                            {new Date(
                              item.createdAt
                            ).toLocaleString()}

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="7"
                        className="public-history-empty"
                      >

                        No analysis history found.

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}


          {/* ==================================================
              PAGINATION
          ================================================== */}

          <div className="public-history-pagination">

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

              <ChevronLeft size={16} />

            </button>


            <span>

              Page {page} of {pages}

            </span>


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

              <ChevronRight size={16} />

            </button>

          </div>

        </section>

      </div>

    </main>

  );
}