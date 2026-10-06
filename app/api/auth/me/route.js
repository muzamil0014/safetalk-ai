// ============================================================
// SAFETALK AI
// CURRENT USER API
// ============================================================

import {
  NextResponse,
} from "next/server";

import connectDB
  from "@/lib/mongodb";

import User
  from "@/models/User";

import {
  getSession,
} from "@/lib/auth";


// ============================================================
// GET /api/auth/me
// ============================================================

export async function GET() {

  try {

    await connectDB();


    // --------------------------------------------------------
    // GET SESSION
    // --------------------------------------------------------

    const session =
      await getSession();


    if (!session) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }


    // --------------------------------------------------------
    // GET USER
    // --------------------------------------------------------

    const user =
      await User
        .findById(
          session.userId
        )
        .select(
          "-password"
        );


    if (!user) {

      return NextResponse.json(
        {
          success: false,

          message:
            "User not found.",
        },
        {
          status: 404,
        }
      );
    }


    return NextResponse.json({

      success: true,

      user,

    });

  } catch (error) {

    console.error(
      "GET USER ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to load user profile.",
      },
      {
        status: 500,
      }
    );
  }
}


// ============================================================
// PATCH /api/auth/me
// UPDATE PROFILE
// ============================================================

export async function PATCH(
  request
) {

  try {

    await connectDB();


    const session =
      await getSession();


    if (!session) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }


    const body =
      await request.json();


    const {
      name,
      phone,
      department,
    } = body;


    const user =
      await User.findByIdAndUpdate(
        session.userId,

        {
          name,
          phone,
          department,
        },

        {
          new: true,

          runValidators: true,
        }
      ).select("-password");


    return NextResponse.json({

      success: true,

      message:
        "Profile updated successfully.",

      user,

    });

  } catch (error) {

    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to update profile.",
      },
      {
        status: 500,
      }
    );
  }
}