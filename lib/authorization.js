// ============================================================
// SAFETALK AI
// AUTHORIZATION HELPERS
// ============================================================

import connectDB
  from "@/lib/mongodb";

import {
  getSession,
} from "@/lib/auth";

import User
  from "@/models/User";


// ============================================================
// GET CURRENT USER
// ============================================================

export async function getCurrentUser() {

  await connectDB();


  const session =
    await getSession();


  if (!session?.userId) {
    return null;
  }


  const user =
    await User
      .findById(
        session.userId
      )
      .select("-password");


  if (!user) {
    return null;
  }


  if (
    user.status !== "Active"
  ) {
    return null;
  }


  return user;
}


// ============================================================
// REQUIRE SPECIFIC ROLES
// ============================================================

export async function requireRoles(
  allowedRoles = []
) {

  const user =
    await getCurrentUser();


  if (!user) {

    return {
      allowed: false,
      status: 401,
      message: "Unauthorized.",
      user: null,
    };

  }


  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(
      user.role
    )
  ) {

    return {
      allowed: false,
      status: 403,
      message:
        "You do not have permission to perform this action.",
      user,
    };

  }


  return {
    allowed: true,
    status: 200,
    user,
  };
}