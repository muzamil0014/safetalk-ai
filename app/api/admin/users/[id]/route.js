// ============================================================
// SAFETALK AI
// SINGLE USER API
// ============================================================

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
} from "@/lib/apiResponse";


// ============================================================
// UPDATE USER
// ============================================================

export async function PATCH(
  request,
  context
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


    const { id } =
      await context.params;


    await connectDB();


    const body =
      await request.json();


    const updates = {};


    if (body.name) {
      updates.name =
        body.name.trim();
    }


    if (
      [
        "Admin",
        "Analyst",
        "User",
      ].includes(
        body.role
      )
    ) {

      updates.role =
        body.role;

    }


    if (
      [
        "Active",
        "Blocked",
      ].includes(
        body.status
      )
    ) {

      updates.status =
        body.status;

    }


    const user =
      await User
        .findByIdAndUpdate(
          id,
          updates,
          {
            new: true,
            runValidators: true,
          }
        )
        .select(
          "-password"
        );


    if (!user) {

      return apiError(
        "User not found.",
        404
      );

    }


    return apiSuccess({

      message:
        "User updated.",

      user,

    });

  } catch (error) {

    console.error(
      "UPDATE USER ERROR:",
      error
    );


    return apiError(
      "Unable to update user."
    );
  }
}


// ============================================================
// DELETE USER
// ============================================================

export async function DELETE(
  request,
  context
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


    const { id } =
      await context.params;


    // Do not delete yourself
    if (
      String(
        auth.user._id
      ) === id
    ) {

      return apiError(
        "You cannot delete your own account.",
        400
      );

    }


    const user =
      await User.findByIdAndDelete(
        id
      );


    if (!user) {

      return apiError(
        "User not found.",
        404
      );

    }


    return apiSuccess({

      message:
        "User deleted successfully.",

    });

  } catch (error) {

    console.error(
      "DELETE USER ERROR:",
      error
    );


    return apiError(
      "Unable to delete user."
    );
  }
}