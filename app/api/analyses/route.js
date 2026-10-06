// ============================================================
// SAFETALK AI
// ANALYSIS HISTORY API
//
// FINAL STABLE VERSION
//
// POST = SAVE HISTORY
// GET  = LOAD HISTORY
//
// IMPORTANT:
// NO LANGUAGE DETECTION HERE.
// NO LANGUAGE OVERRIDE HERE.
// ============================================================

import connectDB from "@/lib/mongodb";
import Analysis from "@/models/Analysis";

import {
  requireRoles,
} from "@/lib/authorization";


// ============================================================
// SAFE STRING
// ============================================================

function safeString(
  value,
  fallback = ""
) {

  if (
    typeof value !==
    "string"
  ) {
    return fallback;
  }


  const clean =
    value.trim();


  return (
    clean ||
    fallback
  );
}


// ============================================================
// SAFE NUMBER
// ============================================================

function safeNumber(
  value,
  fallback = 0
) {

  const number =
    Number(value);


  if (
    !Number.isFinite(
      number
    )
  ) {
    return fallback;
  }


  return number;
}


// ============================================================
// SAFE PERCENTAGE
// ============================================================

function safePercentage(
  value
) {

  return Math.max(
    0,
    Math.min(
      100,
      safeNumber(
        value
      )
    )
  );
}


// ============================================================
// SAFE RESULT
// ============================================================

function safeResult(
  value,
  defaultLabel
) {

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {

    return {

      label:
        safeString(
          value.label,
          defaultLabel
        ),

      confidence:
        safePercentage(
          value.confidence
        ),

    };

  }


  return {

    label:
      defaultLabel,

    confidence:
      0,

  };
}


// ============================================================
// POST
// SAVE HISTORY
// ============================================================

export async function POST(
  request
) {

  try {

    // ========================================================
    // AUTH
    // ========================================================

    const auth =
      await requireRoles([
        "Admin",
        "Analyst",
        "User",
      ]);


    if (
      !auth.allowed
    ) {

      return Response.json(
        {

          success:
            false,

          message:
            auth.message,

        },
        {

          status:
            auth.status,

        }
      );

    }


    // ========================================================
    // DATABASE
    // ========================================================

    await connectDB();


    // ========================================================
    // BODY
    // ========================================================

    const body =
      await request.json();


    // ========================================================
    // TEXT
    // ========================================================

    const text =
      safeString(
        body.text
      );


    if (!text) {

      return Response.json(
        {

          success:
            false,

          message:
            "Text is required.",

        },
        {

          status:
            400,

        }
      );

    }


    // ========================================================
    // LANGUAGE
    //
    // IMPORTANT:
    //
    // WE ONLY READ:
    // detectedLanguage
    //
    // WE NEVER READ:
    // body.language
    //
    // Therefore:
    // language override unsupported
    // CANNOT HAPPEN HERE.
    // ========================================================

    const detectedLanguage =
      safeString(
        body.detectedLanguage,
        "Unknown"
      );


    // ========================================================
    // SENTIMENT
    // ========================================================

    const sentiment =
      safeResult(
        body.sentiment,
        "Neutral"
      );


    // ========================================================
    // PRIMARY THREAT
    // ========================================================

    const primaryThreat =
      safeResult(
        body.primaryThreat,
        "No Threat"
      );


    // ========================================================
    // TOXICITY
    // ========================================================

    const toxicity =
      safeResult(
        body.toxicity,
        "Non-Toxic"
      );


    // ========================================================
    // HATE SPEECH
    // ========================================================

    const hateSpeech =
      safeResult(
        body.hateSpeech,
        "Non-Hate"
      );


    // ========================================================
    // THREAT STATUS
    // ========================================================

    const isThreat =
      safeNumber(
        body.isThreat
      ) === 1
        ? 1
        : 0;


    const threatStatus =
      isThreat === 1
        ? "Threat Detected"
        : "No Threat";


    // ========================================================
    // RISK
    // ========================================================

    const riskScore =
      safePercentage(
        body.riskScore
      );


    const allowedRiskLevels = [
      "Low",
      "Medium",
      "High",
      "Critical",
    ];


    let riskLevel =
      safeString(
        body.riskLevel,
        "Low"
      );


    if (
      !allowedRiskLevels.includes(
        riskLevel
      )
    ) {

      riskLevel =
        "Low";

    }


    // ========================================================
    // EXPLANATION
    // ========================================================

    const explanation =
      safeString(
        body.explanation
      );


    // ========================================================
    // CREATE ANALYSIS
    // ========================================================

    const analysis =
      await Analysis.create({

        // USER

        user:
          auth.user._id,


        // TEXT

        text,


        // LANGUAGE

        language:
          detectedLanguage,


        // SENTIMENT

        sentiment: {

          label:
            sentiment.label,

          confidence:
            sentiment.confidence,

        },


        // THREAT

        isThreat,

        threatStatus,


        primaryThreat: {

          label:
            primaryThreat.label,

          confidence:
            primaryThreat.confidence,

        },


        // TOXICITY

        toxicity: {

          label:
            toxicity.label,

          confidence:
            toxicity.confidence,

        },


        // HATE SPEECH

        hateSpeech: {

          label:
            hateSpeech.label,

          confidence:
            hateSpeech.confidence,

        },


        // RISK

        riskScore,

        riskLevel,


        // EXPLANATION

        explanation,


        // SOURCE

        source:
          "Manual",

      });


    // ========================================================
    // SUCCESS
    // ========================================================

    console.log(
      "======================================"
    );

    console.log(
      "✅ ANALYSIS HISTORY SAVED"
    );

    console.log(
      "ID:",
      analysis._id.toString()
    );

    console.log(
      "TEXT:",
      analysis.text
    );

    console.log(
      "LANGUAGE:",
      analysis.language
    );

    console.log(
      "THREAT:",
      analysis.primaryThreat
    );

    console.log(
      "RISK:",
      analysis.riskLevel
    );

    console.log(
      "======================================"
    );


    return Response.json(
      {

        success:
          true,

        message:
          "Analysis saved successfully.",

        analysis,

      },
      {

        status:
          201,

      }
    );


  } catch (
    error
  ) {

    console.error(
      "======================================"
    );

    console.error(
      "HISTORY SAVE ERROR"
    );

    console.error(
      error
    );

    console.error(
      "MESSAGE:",
      error?.message
    );

    console.error(
      "======================================"
    );


    return Response.json(
      {

        success:
          false,

        message:
          error?.message ||
          "Unable to save analysis history.",

      },
      {

        status:
          500,

      }
    );

  }

}


// ============================================================
// GET
// LOAD HISTORY
// ============================================================

export async function GET(
  request
) {

  try {

    // ========================================================
    // AUTH
    // ========================================================

    const auth =
      await requireRoles([
        "Admin",
        "Analyst",
        "User",
      ]);


    if (
      !auth.allowed
    ) {

      return Response.json(
        {

          success:
            false,

          message:
            auth.message,

        },
        {

          status:
            auth.status,

        }
      );

    }


    // ========================================================
    // DATABASE
    // ========================================================

    await connectDB();


    // ========================================================
    // URL
    // ========================================================

    const {
      searchParams,
    } =
      new URL(
        request.url
      );


    // ========================================================
    // PAGINATION
    // ========================================================

    const page =
      Math.max(
        1,
        Number(
          searchParams.get(
            "page"
          )
        ) ||
        1
      );


    const limit =
      Math.min(
        100,
        Math.max(
          1,
          Number(
            searchParams.get(
              "limit"
            )
          ) ||
          10
        )
      );


    const skip =
      (
        page -
        1
      ) *
      limit;


    // ========================================================
    // FILTERS
    // ========================================================

    const search =
      safeString(
        searchParams.get(
          "search"
        )
      );


    const risk =
      safeString(
        searchParams.get(
          "risk"
        ),
        "all"
      );


    const language =
      safeString(
        searchParams.get(
          "language"
        ),
        "all"
      );


    const threat =
      safeString(
        searchParams.get(
          "threat"
        ),
        "all"
      );


    // ========================================================
    // QUERY
    // ========================================================

    const query = {};


    // ========================================================
    // USER HISTORY
    // ========================================================

    if (
      auth.user.role ===
      "User"
    ) {

      query.user =
        auth.user._id;

    }


    // ========================================================
    // SEARCH
    // ========================================================

    if (search) {

      query.text = {

        $regex:
          search,

        $options:
          "i",

      };

    }


    // ========================================================
    // RISK
    // ========================================================

    if (
      risk !==
      "all"
    ) {

      query.riskLevel =
        risk;

    }


    // ========================================================
    // LANGUAGE
    // ========================================================

    if (
      language !==
      "all"
    ) {

      query.language =
        language;

    }


    // ========================================================
    // THREAT
    // ========================================================

    if (
      threat !==
      "all"
    ) {

      query[
        "primaryThreat.label"
      ] =
        threat;

    }


    // ========================================================
    // LOAD
    // ========================================================

    const [
      analyses,
      total,
    ] =
      await Promise.all([

        Analysis
          .find(
            query
          )

          .populate(
            "user",
            "name email role"
          )

          .sort({
            createdAt:
              -1,
          })

          .skip(
            skip
          )

          .limit(
            limit
          )

          .lean(),


        Analysis
          .countDocuments(
            query
          ),

      ]);


    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json(
      {

        success:
          true,

        analyses,

        pagination: {

          page,

          limit,

          total,

          pages:
            Math.max(
              1,
              Math.ceil(
                total /
                limit
              )
            ),

        },

      },
      {

        status:
          200,

      }
    );


  } catch (
    error
  ) {

    console.error(
      "GET HISTORY ERROR:",
      error
    );


    return Response.json(
      {

        success:
          false,

        message:
          error?.message ||
          "Unable to load analysis history.",

      },
      {

        status:
          500,

      }
    );

  }

}