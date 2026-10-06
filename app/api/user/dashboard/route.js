import Analysis
  from "@/models/Analysis";

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
        "User",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    const userId =
      auth.user._id;


    const [
      total,
      threats,
      toxic,
      highRisk,
      recent,
    ] =
      await Promise.all([

        Analysis.countDocuments({
          user:
            userId,
        }),

        Analysis.countDocuments({
          user:
            userId,

          threatStatus:
            "Threat Detected",
        }),

        Analysis.countDocuments({
          user:
            userId,

          "toxicity.label":
            "Toxic",
        }),

        Analysis.countDocuments({

          user:
            userId,

          riskLevel: {
            $in: [
              "High",
              "Critical",
            ],
          },

        }),

        Analysis
          .find({
            user:
              userId,
          })
          .sort({
            createdAt:
              -1,
          })
          .limit(5),

      ]);


    return apiSuccess({

      stats: {
        total,
        threats,
        toxic,
        highRisk,
      },

      recent,

    });

  } catch (error) {

    console.error(
      "USER DASHBOARD ERROR:",
      error
    );


    return apiError(
      "Unable to load dashboard."
    );

  }

}