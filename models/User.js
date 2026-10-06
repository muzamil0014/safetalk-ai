// ============================================================
// SAFETALK AI
// USER MODEL
// ============================================================

import mongoose from "mongoose";


// ============================================================
// USER SCHEMA
// ============================================================

const UserSchema =
  new mongoose.Schema(

    {

      // --------------------------------------------------------
      // BASIC INFORMATION
      // --------------------------------------------------------

      name: {
        type: String,
        required: true,
        trim: true,
      },


      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },


      password: {
        type: String,
        required: true,
        select: false,
      },


      // --------------------------------------------------------
      // ROLE
      // --------------------------------------------------------

      role: {
        type: String,

        enum: [
          "Admin",
          "Analyst",
          "User",
        ],

        default: "User",
      },


      // --------------------------------------------------------
      // PROFILE INFORMATION
      // --------------------------------------------------------

      phone: {
        type: String,
        default: "",
      },


      department: {
        type: String,
        default: "Administration",
      },


      profileImage: {
        type: String,
        default: "",
      },


      // --------------------------------------------------------
      // ACCOUNT STATUS
      // --------------------------------------------------------

      status: {
        type: String,

        enum: [
          "Active",
          "Blocked",
        ],

        default: "Active",
      },


      // --------------------------------------------------------
      // LAST LOGIN
      // --------------------------------------------------------

      lastLogin: {
        type: Date,
        default: null,
      },

    },


    // ========================================================
    // CREATED AT / UPDATED AT
    // ========================================================

    {
      timestamps: true,
    }

  );


// ============================================================
// EXPORT MODEL
// ============================================================

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    UserSchema
  );


export default User;