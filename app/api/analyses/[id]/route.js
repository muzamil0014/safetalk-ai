// ============================================================
// SAFETALK AI
// SINGLE ANALYSIS
// ============================================================

import Analysis
  from "@/models/Analysis";

import {
  requireRoles,
} from "@/lib/authorization";

import {
  apiSuccess,
  apiError,
} from "@/lib/apiResponse";


// ============================================================
// GET ONE
// ============================================================

export async function GET(
  request,
  context
) {

  try {

    const auth =
      await requireRoles([
        "Admin",
        "Analyst",
        "User",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    const { id } =
      await context.params;


    const analysis =
      await Analysis
        .findById(id)
        .populate(
          "user",
          "name email role"
        );


    if (!analysis) {

      return apiError(
        "Analysis not found.",
        404
      );

    }


    if (
      auth.user.role === "User" &&
      String(
        analysis.user?._id
      ) !==
      String(
        auth.user._id
      )
    ) {

      return apiError(
        "Forbidden.",
        403
      );

    }


    return apiSuccess({
      analysis,
    });

  } catch {

    return apiError(
      "Unable to load analysis."
    );
  }
}


// ============================================================
// DELETE ANALYSIS
// ADMIN ONLY
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


    const analysis =
      await Analysis.findByIdAndDelete(
        id
      );


    if (!analysis) {

      return apiError(
        "Analysis not found.",
        404
      );

    }


    return apiSuccess({

      message:
        "Analysis deleted.",

    });

  } catch {

    return apiError(
      "Unable to delete analysis."
    );
  }
}