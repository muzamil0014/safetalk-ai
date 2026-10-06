// ============================================================
// SAFETALK AI
// REAL DASHBOARD STATISTICS
// ============================================================

import connectDB
  from "@/lib/mongodb";

import Analysis
  from "@/models/Analysis";

import User
  from "@/models/User";

import {
  requireRoles,
} from "@/lib/authorization";

import {
  apiSuccess,
  apiError,
} from "@/lib/apiResponse";


export async function GET() {

  try {

    const auth =
      await requireRoles([
        "Admin",
        "Analyst",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    await connectDB();


    const sevenDaysAgo =
      new Date();

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 6
    );

    sevenDaysAgo.setHours(
      0,
      0,
      0,
      0
    );


    const [
      totalTexts,
      highRisk,
      toxicContent,
      activeUsers,
      sentimentDistribution,
      threatDistribution,
      trend,
      recent,
    ] =
      await Promise.all([

        Analysis.countDocuments(),

        Analysis.countDocuments({
          riskLevel: {
            $in: [
              "High",
              "Critical",
            ],
          },
        }),

        Analysis.countDocuments({
          "toxicity.label":
            "Toxic",
        }),

        User.countDocuments({
          status: "Active",
        }),


        // ------------------------------------------------------
        // SENTIMENT
        // ------------------------------------------------------

        Analysis.aggregate([
          {
            $group: {
              _id:
                "$sentiment.label",

              value: {
                $sum: 1,
              },
            },
          },
        ]),


        // ------------------------------------------------------
        // THREAT DISTRIBUTION
        // ------------------------------------------------------

        Analysis.aggregate([
          {
            $group: {

              _id:
                "$primaryThreat.label",

              count: {
                $sum: 1,
              },

            },
          },

          {
            $sort: {
              count: -1,
            },
          },
        ]),


        // ------------------------------------------------------
        // LAST 7 DAYS
        // ------------------------------------------------------

        Analysis.aggregate([

          {
            $match: {
              createdAt: {
                $gte:
                  sevenDaysAgo,
              },
            },
          },

          {
            $group: {

              _id: {
                date: {
                  $dateToString: {
                    format:
                      "%Y-%m-%d",

                    date:
                      "$createdAt",
                  },
                },

                sentiment:
                  "$sentiment.label",
              },

              count: {
                $sum: 1,
              },

            },
          },

          {
            $sort: {
              "_id.date": 1,
            },
          },

        ]),


        Analysis
          .find()
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .select(
            "text sentiment threatStatus primaryThreat toxicity riskLevel language createdAt"
          ),

      ]);


    return apiSuccess({

      stats: {
        totalTexts,
        highRisk,
        toxicContent,
        activeUsers,
      },

      sentimentDistribution,

      threatDistribution,

      trend,

      recent,

    });

  } catch (error) {

    console.error(
      "DASHBOARD ERROR:",
      error
    );


    return apiError(
      "Unable to load dashboard."
    );
  }
}