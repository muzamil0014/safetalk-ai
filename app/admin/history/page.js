"use client";

// ============================================================
// SAFETALK AI
// RESULTS HISTORY
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  History,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

import {
  adminFetch,
} from "@/services/adminApi";


export default function HistoryPage() {

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

  const [loading, setLoading] =
    useState(true);


  const loadHistory =
    async () => {

      setLoading(true);


      try {

        const data =
          await adminFetch(
            `/api/analyses?search=${encodeURIComponent(
              search
            )}&risk=${risk}&page=${page}&limit=10`
          );


        setItems(
          data.analyses
        );


        setPages(
          data.pagination.pages ||
          1
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    const timer =
      setTimeout(
        loadHistory,
        300
      );


    return () =>
      clearTimeout(timer);

  }, [
    search,
    risk,
    page,
  ]);


  return (
    <div className="admin-module-page">


      <div className="module-page-header">

        <div className="module-page-title">

          <div className="module-title-icon">
            <History size={22} />
          </div>

          <div>

            <h1>
              Results History
            </h1>

            <p>
              Real SafeTalkAI analysis history.
            </p>

          </div>

        </div>

      </div>


      <section className="module-card">

        <div className="manage-filter-row">

          <div className="module-search-box manage-search">

            <Search size={16} />

            <input
              value={search}
              placeholder="Search analyzed text..."
              onChange={(event) => {

                setSearch(
                  event.target.value
                );

                setPage(1);

              }}
            />

          </div>


          <div className="module-select-wrapper">

            <SlidersHorizontal size={15} />

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

        </div>

      </section>


      <section className="module-card">

        {loading ? (

          <div className="profile-loading">

            <LoaderCircle
              className="analysis-spinner"
            />

            Loading history...

          </div>

        ) : (

          <div className="module-table-wrapper">

            <table className="module-table large">

              <thead>

                <tr>
                  <th>Text</th>
                  <th>Sentiment</th>
                  <th>Threat</th>
                  <th>Toxicity</th>
                  <th>Risk</th>
                  <th>Language</th>
                  <th>User</th>
                  <th>Date</th>
                </tr>

              </thead>


              <tbody>

                {items.map(
                  (item) => (

                    <tr key={item._id}>

                      <td className="module-text-cell">
                        {item.text}
                      </td>


                      <td>
                        {item.sentiment?.label}
                      </td>


                      <td>
                        <span className="table-purple-badge">

                          {item.primaryThreat?.label}

                        </span>
                      </td>


                      <td>
                        {item.toxicity?.confidence || 0}%
                      </td>


                      <td>

                        <span
                          className={`table-risk-badge ${(item.riskLevel || "low").toLowerCase()}`}
                        >
                          {item.riskLevel}
                        </span>

                      </td>


                      <td>
                        {item.language}
                      </td>


                      <td>
                        {item.user?.name || "--"}
                      </td>


                      <td>

                        {new Date(
                          item.createdAt
                        ).toLocaleString()}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}


        <div className="module-pagination">

          <span>
            Page {page} of {pages}
          </span>

          <div>

            <button
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


            <button className="active">
              {page}
            </button>


            <button
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

        </div>

      </section>

    </div>
  );
}