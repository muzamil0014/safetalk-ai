// ============================================================
// SAFETALK AI
// PUBLIC USER REGISTRATION
// ============================================================

import bcrypt from "bcryptjs";

import connectDB
  from "@/lib/mongodb";

import User
  from "@/models/User";

import {
  NextResponse,
} from "next/server";


// ============================================================
// POST
// ============================================================

export async function POST(
  request
) {

  try {

    await connectDB();


    const body =
      await request.json();


    const {
      name,
      email,
      password,
    } = body;


    // ========================================================
    // VALIDATION
    // ========================================================

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Name, email and password are required.",
        },
        {
          status: 400,
        }
      );

    }


    if (
      password.length < 8
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Password must contain at least 8 characters.",
        },
        {
          status: 400,
        }
      );

    }


    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    // ========================================================
    // CHECK EXISTING
    // ========================================================

    const existingUser =
      await User.findOne({
        email:
          normalizedEmail,
      });


    if (existingUser) {

      return NextResponse.json(
        {
          success: false,
          message:
            "An account already exists with this email.",
        },
        {
          status: 409,
        }
      );

    }


    // ========================================================
    // HASH PASSWORD
    // ========================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );


    // ========================================================
    // CREATE
    // IMPORTANT: ROLE ALWAYS USER
    // ========================================================

    const user =
      await User.create({

        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        role:
          "User",

        status:
          "Active",

      });


    return NextResponse.json(
      {

        success:
          true,

        message:
          "Account created successfully.",

        user: {
          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,
        },

      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );


    return NextResponse.json(
      {
        success:
          false,

        message:
          "Unable to create account.",
      },
      {
        status: 500,
      }
    );

  }

}