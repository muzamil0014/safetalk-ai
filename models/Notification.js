// ============================================================
// SAFETALK AI
// ADMIN NOTIFICATION MODEL
// ============================================================

import mongoose
  from "mongoose";


const NotificationSchema =
  new mongoose.Schema(
    {

      title: {
        type: String,
        required: true,
      },


      message: {
        type: String,
        required: true,
      },


      type: {

        type: String,

        enum: [
          "info",
          "warning",
          "critical",
          "success",
        ],

        default: "info",
      },


      analysis: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Analysis",

        default: null,
      },


      read: {
        type: Boolean,
        default: false,
      },

    },

    {
      timestamps: true,
    }
  );


const Notification =
  mongoose.models.Notification ||
  mongoose.model(
    "Notification",
    NotificationSchema
  );


export default Notification;