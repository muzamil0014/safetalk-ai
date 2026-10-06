// ============================================================
// SAFETALK AI
// SYSTEM SETTINGS MODEL
// ============================================================

import mongoose
  from "mongoose";


const SettingsSchema =
  new mongoose.Schema(
    {

      key: {
        type: String,
        unique: true,
        default: "main",
      },


      appName: {
        type: String,
        default: "SafeTalkAI",
      },


      defaultLanguage: {
        type: String,

        enum: [
          "auto",
          "english",
          "urdu",
          "roman-urdu",
        ],

        default: "auto",
      },


      notifications: {
        type: Boolean,
        default: true,
      },


      criticalAlerts: {
        type: Boolean,
        default: true,
      },


      highRiskThreshold: {
        type: Number,
        default: 70,
      },


      criticalRiskThreshold: {
        type: Number,
        default: 85,
      },

    },

    {
      timestamps: true,
    }
  );


const Settings =
  mongoose.models.Settings ||
  mongoose.model(
    "Settings",
    SettingsSchema
  );


export default Settings;