"use client";

// ============================================================
// SAFETALK AI
// ADMIN DASHBOARD PAGE
// COMPLETE REAL MONGODB DASHBOARD
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  ScanText,
  TriangleAlert,
  Skull,
  Users,
} from "lucide-react";


// ============================================================
// DASHBOARD COMPONENTS
// ============================================================

import StatCard
  from "@/components/admin/dashboard/StatCard";

import AnalysisTrend
  from "@/components/admin/dashboard/AnalysisTrend";

import ContentDistribution
  from "@/components/admin/dashboard/ContentDistribution";

import ThreatDistribution
  from "@/components/admin/dashboard/ThreatDistribution";

import RecentAnalyses
  from "@/components/admin/dashboard/RecentAnalyses";


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


function getToxicityConfidence(item) {

  return Number(
    item?.toxicity?.confidence ||
    0
  );
}


function getHateLabel(item) {

  return (
    item?.hateSpeech?.label ||
    "Non-Hate"
  );
}


function getHateConfidence(item) {

  return Number(
    item?.hateSpeech?.confidence ||
    0
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


function isHateSpeech(item) {

  const label =
    getHateLabel(item)
      .toLowerCase();

  return (
    label === "hate speech" ||
    label === "hate"
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


// ============================================================
// MAIN DASHBOARD
// ============================================================

export default function AdminDashboardPage() {

  // ==========================================================
  // STATES
  // ==========================================================

  const [
    stats,
    setStats,
  ] = useState({
    total: 0,
    highRisk: 0,
    toxic: 0,
    hateSpeech: 0,
  });


  const [
    trendData,
    setTrendData,
  ] = useState([]);


  const [
    contentData,
    setContentData,
  ] = useState([]);


  const [
    threatData,
    setThreatData,
  ] = useState([]);


  const [
    recentAnalyses,
    setRecentAnalyses,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  useEffect(() => {

    const loadDashboard =
      async () => {

        try {

          setLoading(true);

          setError("");


          // ==================================================
          // FIRST PAGE
          // ==================================================

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
              "Unable to load dashboard data."
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


          // ==================================================
          // OTHER PAGES
          // ==================================================

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


          // ==================================================
          // STAT CARDS
          // ==================================================

          const total =
            allAnalyses.length;


          const highRisk =
            allAnalyses.filter(
              (item) =>
                getRiskLevel(
                  item
                ) === "High" ||
                getRiskLevel(
                  item
                ) === "Critical"
            ).length;


          const toxic =
            allAnalyses.filter(
              isToxic
            ).length;


          const hateSpeech =
            allAnalyses.filter(
              isHateSpeech
            ).length;


          setStats({
            total,
            highRisk,
            toxic,
            hateSpeech,
          });


          // ==================================================
          // CONTENT DISTRIBUTION
          // ==================================================

          const positive =
            allAnalyses.filter(
              (item) =>
                getSentiment(
                  item
                ) === "Positive"
            ).length;


          const negative =
            allAnalyses.filter(
              (item) =>
                getSentiment(
                  item
                ) === "Negative"
            ).length;


          const neutral =
            allAnalyses.filter(
              (item) =>
                getSentiment(
                  item
                ) === "Neutral"
            ).length;


          const threats =
            allAnalyses.filter(
              isThreat
            ).length;


          setContentData([
            {
              name:
                "Positive",

              value:
                positive,

              color:
                "#12c990",
            },

            {
              name:
                "Negative",

              value:
                negative,

              color:
                "#ff405c",
            },

            {
              name:
                "Neutral",

              value:
                neutral,

              color:
                "#1685ff",
            },

            {
              name:
                "Toxic",

              value:
                toxic,

              color:
                "#8438ff",
            },

            {
              name:
                "Threat",

              value:
                threats,

              color:
                "#ff9f1c",
            },
          ]);


          // ==================================================
          // THREAT DISTRIBUTION
          // PRIMARY THREAT CATEGORY COUNTS
          // ==================================================

          const threatCounts = {

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


          allAnalyses.forEach(
            (item) => {

              const category =
                getPrimaryThreat(
                  item
                );


              if (
                Object.prototype
                  .hasOwnProperty
                  .call(
                    threatCounts,
                    category
                  )
              ) {

                threatCounts[
                  category
                ] += 1;

              }

            }
          );


          setThreatData([
            {
              category:
                "Physical",

              value:
                threatCounts[
                  "Physical Threat"
                ],
            },

            {
              category:
                "Death",

              value:
                threatCounts[
                  "Death Threat"
                ],
            },

            {
              category:
                "Harassment",

              value:
                threatCounts[
                  "Harassment"
                ],
            },

            {
              category:
                "Abusive",

              value:
                threatCounts[
                  "Abusive Language"
                ],
            },

            {
              category:
                "Cyber",

              value:
                threatCounts[
                  "Cyber Threat"
                ],
            },

            {
              category:
                "Hate",

              value:
                threatCounts[
                  "Hate Speech"
                ],
            },

            {
              category:
                "Sexual",

              value:
                threatCounts[
                  "Sexual Threat"
                ],
            },

            {
              category:
                "Self-Harm",

              value:
                threatCounts[
                  "Self-Harm Related"
                ],
            },
          ]);


          // ==================================================
          // RECENT ANALYSES
          // ==================================================

          const recent =
            [...allAnalyses]
              .sort(
                (
                  a,
                  b
                ) =>
                  new Date(
                    b?.createdAt ||
                    0
                  ) -
                  new Date(
                    a?.createdAt ||
                    0
                  )
              )
              .slice(
                0,
                6
              )
              .map(
                (
                  item,
                  index
                ) => ({

                  id:
                    item?._id ||
                    index + 1,

                  text:
                    item?.text ||
                    "",

                  sentiment:
                    getSentiment(
                      item
                    ),

                  threatStatus:
                    isThreat(
                      item
                    )
                      ? "Detected"
                      : "No Threat",

                  threatCategory:
                    getPrimaryThreat(
                      item
                    ),

                  toxicity:
                    `${Math.round(
                      getToxicityConfidence(
                        item
                      )
                    )}%`,

                  hateSpeech:
                    `${Math.round(
                      getHateConfidence(
                        item
                      )
                    )}%`,

                  risk:
                    getRiskLevel(
                      item
                    ),

                  language:
                    getLanguage(
                      item
                    ),

                  user:
                    item?.user?.name ||
                    item?.user?.email ||
                    "Unknown",

                  date:
                    item?.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleString(
                          "en-US",
                          {
                            month:
                              "short",

                            day:
                              "numeric",

                            year:
                              "numeric",

                            hour:
                              "numeric",

                            minute:
                              "2-digit",
                          }
                        )
                      : "--",

                })
              );


          setRecentAnalyses(
            recent
          );


          // ==================================================
          // FIND LATEST DATE
          // ==================================================

          let latestDate =
            new Date();


          const validDates =
            allAnalyses
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
            validDates.length > 0
          ) {

            latestDate =
              new Date(
                Math.max(
                  ...validDates.map(
                    (date) =>
                      date.getTime()
                  )
                )
              );

          }


          // ==================================================
          // LAST 7 DAYS TREND
          // ==================================================

          const last7Days =
            [];


          for (
            let index = 6;
            index >= 0;
            index--
          ) {

            const start =
              new Date(
                latestDate
              );


            start.setDate(
              latestDate.getDate() -
                index
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
              end.getDate() +
                1
            );


            const dayItems =
              allAnalyses.filter(
                (item) => {

                  if (
                    !item?.createdAt
                  ) {
                    return false;
                  }


                  const itemDate =
                    new Date(
                      item.createdAt
                    );


                  if (
                    Number.isNaN(
                      itemDate.getTime()
                    )
                  ) {
                    return false;
                  }


                  return (
                    itemDate >=
                      start &&
                    itemDate <
                      end
                  );

                }
              );


            last7Days.push({

              date:
                start.toLocaleDateString(
                  "en-US",
                  {
                    month:
                      "short",

                    day:
                      "numeric",
                  }
                ),

              positive:
                dayItems.filter(
                  (item) =>
                    getSentiment(
                      item
                    ) ===
                    "Positive"
                ).length,

              negative:
                dayItems.filter(
                  (item) =>
                    getSentiment(
                      item
                    ) ===
                    "Negative"
                ).length,

              neutral:
                dayItems.filter(
                  (item) =>
                    getSentiment(
                      item
                    ) ===
                    "Neutral"
                ).length,

              toxic:
                dayItems.filter(
                  isToxic
                ).length,

              threat:
                dayItems.filter(
                  isThreat
                ).length,

            });

          }


          setTrendData(
            last7Days
          );


        } catch (
          dashboardError
        ) {

          console.error(
            "DASHBOARD ERROR:",
            dashboardError
          );


          setError(
            dashboardError
              ?.message ||
            "Unable to load dashboard."
          );


        } finally {

          setLoading(false);

        }

      };


    loadDashboard();

  }, []);


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="dashboard-page">


      {error && (

        <div className="dashboard-panel">

          <p>
            {error}
          </p>

        </div>

      )}


      {/* ======================================================
          STAT CARDS
      ====================================================== */}

      <section className="stats-grid">

        <StatCard
          title="Total Texts"
          value={
            loading
              ? "..."
              : stats.total
          }
          change="0%"
          trend="up"
          icon={ScanText}
          type="blue"
        />


        <StatCard
          title="High Risk"
          value={
            loading
              ? "..."
              : stats.highRisk
          }
          change="0%"
          trend="up"
          icon={TriangleAlert}
          type="red"
        />


        <StatCard
          title="Toxic Content"
          value={
            loading
              ? "..."
              : stats.toxic
          }
          change="0%"
          trend="down"
          icon={Skull}
          type="purple"
        />


        <StatCard
          title="Hate Speech"
          value={
            loading
              ? "..."
              : stats.hateSpeech
          }
          change="0%"
          trend="up"
          icon={Users}
          type="green"
        />

      </section>


      {/* ======================================================
          TREND + CONTENT
      ====================================================== */}

      <section className="dashboard-charts">

        <AnalysisTrend
          data={
            trendData
          }
        />


        <ContentDistribution
          data={
            contentData
          }
          total={
            stats.total
          }
        />

      </section>


      {/* ======================================================
          REAL THREAT DISTRIBUTION
      ====================================================== */}

      <section className="threat-section">

        <ThreatDistribution
          data={
            threatData
          }
        />

      </section>


      {/* ======================================================
          REAL RECENT ANALYSES
      ====================================================== */}

      <section>

        <RecentAnalyses
          analyses={
            recentAnalyses
          }
        />

      </section>


    </div>
  );
}