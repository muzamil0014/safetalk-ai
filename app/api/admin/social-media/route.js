// ============================================================
// SAFETALK AI
// SOCIAL MEDIA IMPORT API
// ============================================================

import ImportedPost
  from "@/models/ImportedPost";

import {
  requireRoles,
} from "@/lib/authorization";

import {
  apiSuccess,
  apiError,
  getPagination,
} from "@/lib/apiResponse";


// ============================================================
// GET IMPORTED POSTS
// ============================================================

export async function GET(
  request
) {

  try {

    const auth =
      await requireRoles([
        "Admin",
        "Analyst",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    const { searchParams } =
      new URL(
        request.url
      );


    const search =
      searchParams.get(
        "search"
      ) || "";


    const platform =
      searchParams.get(
        "platform"
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
          text: {
            $regex: search,
            $options: "i",
          },
        },

        {
          author: {
            $regex: search,
            $options: "i",
          },
        },

      ];

    }


    if (
      platform !== "all"
    ) {

      query.platform =
        platform;

    }


    const [
      posts,
      total,
    ] =
      await Promise.all([

        ImportedPost
          .find(query)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        ImportedPost.countDocuments(
          query
        ),

      ]);


    return apiSuccess({

      posts,

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

  } catch {

    return apiError(
      "Unable to load imported posts."
    );
  }
}


// ============================================================
// MANUAL IMPORT
// ============================================================

export async function POST(
  request
) {

  try {

    const auth =
      await requireRoles([
        "Admin",
        "Analyst",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    const body =
      await request.json();


    if (
      !body.text ||
      !body.text.trim()
    ) {

      return apiError(
        "Text is required.",
        400
      );

    }


    const post =
      await ImportedPost.create({

        platform:
          body.platform ||
          "Manual",

        author:
          body.author ||
          "Unknown",

        text:
          body.text.trim(),

        sourceUrl:
          body.sourceUrl ||
          "",

        importedBy:
          auth.user._id,

      });


    return apiSuccess(
      {
        message:
          "Social media text imported.",

        post,
      },
      201
    );

  } catch (error) {

    console.error(
      error
    );


    return apiError(
      "Unable to import text."
    );
  }
}