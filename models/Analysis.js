// ============================================================
// SAFETALK AI
// ANALYSIS MODEL
// SIMPLE + STABLE HISTORY VERSION
// ============================================================

import mongoose from "mongoose";


// ============================================================
// ANALYSIS SCHEMA
// ============================================================

const AnalysisSchema =
  new mongoose.Schema(
    {
      // ======================================================
      // USER
      // ======================================================

      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,
      },


      // ======================================================
      // TEXT
      // ======================================================

      text: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          3000,
      },


      // ======================================================
      // LANGUAGE
      // ======================================================

      language: {
        type:
          String,

        default:
          "Unknown",
      },


      // ======================================================
      // SENTIMENT
      // ======================================================

      sentiment: {
        label: {
          type:
            String,

          default:
            "Neutral",
        },

        confidence: {
          type:
            Number,

          default:
            0,
        },
      },


      // ======================================================
      // THREAT
      // ======================================================

      isThreat: {
        type:
          Number,

        default:
          0,
      },


      threatStatus: {
        type:
          String,

        default:
          "No Threat",
      },


      primaryThreat: {
        label: {
          type:
            String,

          default:
            "No Threat",
        },

        confidence: {
          type:
            Number,

          default:
            0,
        },
      },


      // ======================================================
      // TOXICITY
      // ======================================================

      toxicity: {
        label: {
          type:
            String,

          default:
            "Non-Toxic",
        },

        confidence: {
          type:
            Number,

          default:
            0,
        },
      },


      // ======================================================
      // HATE SPEECH
      // ======================================================

      hateSpeech: {
        label: {
          type:
            String,

          default:
            "Non-Hate",
        },

        confidence: {
          type:
            Number,

          default:
            0,
        },
      },


      // ======================================================
      // RISK
      // ======================================================

      riskScore: {
        type:
          Number,

        default:
          0,

        min:
          0,

        max:
          100,
      },


      riskLevel: {
        type:
          String,

        enum: [
          "Low",
          "Medium",
          "High",
          "Critical",
        ],

        default:
          "Low",
      },


      // ======================================================
      // EXPLANATION
      // ======================================================

      explanation: {
        type:
          String,

        default:
          "",
      },


      // ======================================================
      // SOURCE
      // ======================================================

      source: {
        type:
          String,

        default:
          "Manual",
      },
    },

    {
      timestamps:
        true,
    }
  );


// ============================================================
// INDEXES
// ============================================================

AnalysisSchema.index({
  user:
    1,

  createdAt:
    -1,
});


AnalysisSchema.index({
  createdAt:
    -1,
});


AnalysisSchema.index({
  riskLevel:
    1,
});


AnalysisSchema.index({
  language:
    1,
});


AnalysisSchema.index({
  "primaryThreat.label":
    1,
});


// ============================================================
// MODEL
// ============================================================

const Analysis =
  mongoose.models.Analysis ||
  mongoose.model(
    "Analysis",
    AnalysisSchema
  );


export default Analysis;