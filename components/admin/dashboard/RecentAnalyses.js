// ============================================================
// SAFETALK AI
// RECENT ANALYSES TABLE
// REAL MONGODB DATA
// ============================================================

import Link
  from "next/link";


export default function RecentAnalyses({
  analyses = [],
}) {

  return (

    <div className="dashboard-panel recent-panel">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="panel-header">

        <h3>
          Recent Analyses
        </h3>


        <Link
          href="/admin/history"
          className="view-all-link"
        >
          View All
        </Link>

      </div>


      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="table-wrapper">

        <table className="recent-table">


          <thead>

            <tr>

              <th>
                #
              </th>

              <th>
                Text Preview
              </th>

              <th>
                Sentiment
              </th>

              <th>
                Threat Status
              </th>

              <th>
                Threat Category
              </th>

              <th>
                Toxicity
              </th>

              <th>
                Risk Level
              </th>

              <th>
                Language
              </th>

              <th>
                Date
              </th>

            </tr>

          </thead>


          <tbody>


            {analyses.length >
            0 ? (

              analyses.map(
                (
                  item,
                  index
                ) => (

                  <tr
                    key={
                      item.id ||
                      index
                    }
                  >


                    {/* NUMBER */}

                    <td>
                      {index + 1}
                    </td>


                    {/* TEXT */}

                    <td className="analysis-text">

                      {
                        item.text
                          ?.length >
                        55
                          ? `${item.text.substring(
                              0,
                              55
                            )}...`
                          : item.text
                      }

                    </td>


                    {/* SENTIMENT */}

                    <td>

                      <span
                        className={
                          `sentiment-badge ${
                            item.sentiment
                              ?.toLowerCase() ||
                            ""
                          }`
                        }
                      >

                        {
                          item
                            .sentiment
                        }

                      </span>

                    </td>


                    {/* THREAT */}

                    <td>

                      <span
                        className={
                          `threat-status ${
                            item.threatStatus ===
                            "Detected"
                              ? "detected"
                              : "safe"
                          }`
                        }
                      >

                        {
                          item
                            .threatStatus
                        }

                      </span>

                    </td>


                    {/* CATEGORY */}

                    <td>

                      <span
                        className={
                          `threat-category ${
                            item.threatCategory ===
                            "No Threat"
                              ? "no-threat"
                              : ""
                          }`
                        }
                      >

                        {
                          item
                            .threatCategory
                        }

                      </span>

                    </td>


                    {/* TOXICITY */}

                    <td
                      className={
                        parseInt(
                          item.toxicity,
                          10
                        ) >
                        50
                          ? "danger-value"
                          : ""
                      }
                    >

                      {
                        item
                          .toxicity
                      }

                    </td>


                    {/* RISK */}

                    <td>

                      <span
                        className={
                          `risk-badge ${
                            item.risk
                              ?.toLowerCase() ||
                            "low"
                          }`
                        }
                      >

                        {
                          item.risk
                        }

                      </span>

                    </td>


                    {/* LANGUAGE */}

                    <td>

                      <span className="language-badge">

                        {
                          item
                            .language
                        }

                      </span>

                    </td>


                    {/* DATE */}

                    <td className="date-cell">

                      {
                        item.date
                      }

                    </td>


                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="9"
                  style={{
                    textAlign:
                      "center",

                    padding:
                      "35px",
                  }}
                >

                  No analysis records
                  found.

                </td>

              </tr>

            )}


          </tbody>

        </table>

      </div>

    </div>
  );
}