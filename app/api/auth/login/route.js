// ============================================================
// SAFETALK AI
// LOGIN API
// ============================================================

import { NextResponse }
  from "next/server";

import bcrypt
  from "bcryptjs";

import connectDB
  from "@/lib/mongodb";

import User
  from "@/models/User";

import {
  createToken,
} from "@/lib/auth";


// ============================================================
// POST /api/auth/login
// ============================================================

export async function POST(
  request
) {

  try {

    // --------------------------------------------------------
    // CONNECT DATABASE
    // --------------------------------------------------------

    await connectDB();


    // --------------------------------------------------------
    // BODY
    // --------------------------------------------------------

    const body =
      await request.json();


    const {
      email,
      password,
    } = body;


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
      !email ||
      !password
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }


    // --------------------------------------------------------
    // FIND USER + PASSWORD
    // --------------------------------------------------------

    const user =
      await User
        .findOne({
          email:
            email
              .toLowerCase()
              .trim(),
        })
        .select("+password");


    if (!user) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }


    // --------------------------------------------------------
    // BLOCKED USER CHECK
    // --------------------------------------------------------

    if (
      user.status ===
      "Blocked"
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Your account has been blocked.",
        },
        {
          status: 403,
        }
      );
    }


    // --------------------------------------------------------
    // CHECK PASSWORD
    // --------------------------------------------------------

    const passwordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordCorrect) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }


    // --------------------------------------------------------
    // UPDATE LAST LOGIN
    // --------------------------------------------------------

    user.lastLogin =
      new Date();


    await user.save();


    // --------------------------------------------------------
    // CREATE JWT
    // --------------------------------------------------------

    const token =
      await createToken({

        userId:
          user._id.toString(),

        email:
          user.email,

        role:
          user.role,

      });


    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    const response =
      NextResponse.json(
        {
          success: true,

          message:
            "Login successful.",

          user: {
            id:
              user._id,

            name:
              user.name,

            email:
              user.email,

            role:
              user.role,

            status:
              user.status,
          },
        },
        {
          status: 200,
        }
      );


    // --------------------------------------------------------
    // HTTP ONLY AUTH COOKIE
    // --------------------------------------------------------

    response.cookies.set(
      "safetalk_token",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          60 * 60 * 24 * 7,
      }
    );


    return response;

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        message:
          "Something went wrong during login.",
      },
      {
        status: 500,
      }
    );
  }
}