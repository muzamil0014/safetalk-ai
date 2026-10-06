// ============================================================
// SAFETALK AI
// USERS API
// ============================================================

import bcrypt
  from "bcryptjs";

import connectDB
  from "@/lib/mongodb";

import User
  from "@/models/User";

import {
  requireRoles,
} from "@/lib/authorization";

import {
  apiSuccess,
  apiError,
  getPagination,
} from "@/lib/apiResponse";


// ============================================================
// GET USERS
// ============================================================

export async function GET(
  request
) {

  try {

    const auth =
      await requireRoles([
        "Admin",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    await connectDB();


    const { searchParams } =
      new URL(
        request.url
      );


    const search =
      searchParams.get(
        "search"
      ) || "";


    const role =
      searchParams.get(
        "role"
      ) || "all";


    const status =
      searchParams.get(
        "status"
      ) || "all";


    const {
      page,
      limit,
      skip,
    } =
      getPagination(
        searchParams
      );


    const query = {};


    if (search) {

      query.$or = [

        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          email: {
            $regex: search,
            $options: "i",
          },
        },

      ];

    }


    if (role !== "all") {
      query.role = role;
    }


    if (status !== "all") {
      query.status = status;
    }


    const [
      users,
      total,
    ] =
      await Promise.all([

        User
          .find(query)
          .select("-password")
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        User.countDocuments(
          query
        ),

      ]);


    return apiSuccess({

      users,

      pagination: {
        page,
        limit,
        total,

        pages:
          Math.ceil(
            total / limit
          ),
      },

    });

  } catch (error) {

    console.error(
      "GET USERS ERROR:",
      error
    );


    return apiError(
      "Unable to load users."
    );
  }
}


// ============================================================
// CREATE USER
// ADMIN ONLY
// ============================================================

export async function POST(
  request
) {

  try {

    const auth =
      await requireRoles([
        "Admin",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    await connectDB();


    const body =
      await request.json();


    const {
      name,
      email,
      password,
      role = "User",
    } = body;


    if (
      !name ||
      !email ||
      !password
    ) {

      return apiError(
        "Name, email and password are required.",
        400
      );

    }


    if (
      ![
        "Admin",
        "Analyst",
        "User",
      ].includes(role)
    ) {

      return apiError(
        "Invalid role.",
        400
      );

    }


    if (
      password.length < 8
    ) {

      return apiError(
        "Password must contain at least 8 characters.",
        400
      );

    }


    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    const exists =
      await User.findOne({
        email:
          normalizedEmail,
      });


    if (exists) {

      return apiError(
        "User already exists.",
        409
      );

    }


    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );


    const user =
      await User.create({

        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        role,

      });


    const safeUser =
      await User
        .findById(
          user._id
        )
        .select(
          "-password"
        );


    return apiSuccess(
      {
        message:
          "User created successfully.",

        user:
          safeUser,
      },
      201
    );

  } catch (error) {

    console.error(
      "CREATE USER ERROR:",
      error
    );


    return apiError(
      "Unable to create user."
    );
  }
}