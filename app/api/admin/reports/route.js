// ============================================================
// SAFETALK AI
// REPORTS API
// ============================================================

import Analysis
  from "@/models/Analysis";

import {
  requireRoles,
} from "@/lib/authorization";

import {
  apiSuccess,
  apiError,
} from "@/lib/apiResponse";


export async function GET(
  request
) {

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


    const { searchParams } =
      new URL(
        request.url
      );


    const from =
      searchParams.get(
        "from"
      );


    const to =
      searchParams.get(
        "to"
      );


    const match = {};


    if (from || to) {

      match.createdAt = {};

      if (from) {

        match.createdAt.$gte =
          new Date(from);

      }


      if (to) {

        const end =
          new Date(to);

        end.setHours(
          23,
          59,
          59,
          999
        );

        match.createdAt.$lte =
          end;

      }

    }


    const [
      total,
      threats,
      toxic,
      critical,
      threatCategories,
      riskDistribution,
      sentimentDistribution,
    ] =
      await Promise.all([

        Analysis.countDocuments(
          match
        ),

        Analysis.countDocuments({
          ...match,
          threatStatus:
            "Threat Detected",
        }),

        Analysis.countDocuments({
          ...match,
          "toxicity.label":
            "Toxic",
        }),

        Analysis.countDocuments({
          ...match,
          riskLevel:
            "Critical",
        }),


        Analysis.aggregate([

          {
            $match: match,
          },

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


        Analysis.aggregate([

          {
            $match: match,
          },

          {
            $group: {

              _id:
                "$riskLevel",

              count: {
                $sum: 1,
              },

            },
          },

        ]),


        Analysis.aggregate([

          {
            $match: match,
          },

          {
            $group: {

              _id:
                "$sentiment.label",

              count: {
                $sum: 1,
              },

            },
          },

        ]),

      ]);


    return apiSuccess({

      summary: {
        total,
        threats,
        toxic,
        critical,
      },

      threatCategories,
      riskDistribution,
      sentimentDistribution,

    });

  } catch (error) {

    console.error(
      "REPORT ERROR:",
      error
    );


    return apiError(
      "Unable to generate report."
    );
  }
}