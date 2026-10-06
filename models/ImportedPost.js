// ============================================================
// SAFETALK AI
// IMPORTED SOCIAL MEDIA POST
// ============================================================

import mongoose
  from "mongoose";


const ImportedPostSchema =
  new mongoose.Schema(
    {

      platform: {

        type: String,

        enum: [
          "YouTube",
          "Reddit",
          "Twitter",
          "Manual",
          "CSV",
        ],

        required: true,
      },


      author: {
        type: String,
        default: "Unknown",
      },


      text: {
        type: String,
        required: true,
        trim: true,
      },


      sourceUrl: {
        type: String,
        default: "",
      },


      sourceId: {
        type: String,
        default: "",
      },


      importedBy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },


      status: {

        type: String,

        enum: [
          "Pending",
          "Analyzed",
        ],

        default: "Pending",
      },

    },

    {
      timestamps: true,
    }
  );


ImportedPostSchema.index({
  text: "text",
  author: "text",
});


const ImportedPost =
  mongoose.models.ImportedPost ||
  mongoose.model(
    "ImportedPost",
    ImportedPostSchema
  );


export default ImportedPost;