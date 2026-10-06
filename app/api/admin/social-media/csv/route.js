// ============================================================
// SAFETALK AI
// CSV IMPORT
// ============================================================

import Papa
  from "papaparse";

import ImportedPost
  from "@/models/ImportedPost";

import {
  requireRoles,
} from "@/lib/authorization";

import {
  apiSuccess,
  apiError,
} from "@/lib/apiResponse";


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


    const formData =
      await request.formData();


    const file =
      formData.get(
        "file"
      );


    if (!file) {

      return apiError(
        "CSV file is required.",
        400
      );

    }


    if (
      !file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {

      return apiError(
        "Only CSV files are allowed.",
        400
      );

    }


    // 5 MB limit
    if (
      file.size >
      5 * 1024 * 1024
    ) {

      return apiError(
        "CSV file cannot exceed 5 MB.",
        400
      );

    }


    const csvText =
      await file.text();


    const result =
      Papa.parse(
        csvText,
        {
          header: true,

          skipEmptyLines:
            true,

          transformHeader:
            (header) =>
              header
                .trim()
                .toLowerCase(),
        }
      );


    if (
      result.errors.length
    ) {

      return apiError(
        "CSV contains invalid data.",
        400,
        result.errors.slice(
          0,
          5
        )
      );

    }


    const allowedPlatforms = [
      "YouTube",
      "Reddit",
      "Twitter",
      "Manual",
      "CSV",
    ];


    const records =
      result.data
        .filter(
          (row) =>
            row.text?.trim()
        )
        .slice(
          0,
          1000
        )
        .map(
          (row) => {

            let platform =
              row.platform ||
              "CSV";


            if (
              !allowedPlatforms.includes(
                platform
              )
            ) {

              platform =
                "CSV";

            }


            return {

              platform,

              author:
                row.author ||
                "Unknown",

              text:
                row.text.trim(),

              sourceUrl:
                row.sourceurl ||
                row.source_url ||
                "",

              importedBy:
                auth.user._id,

            };

          }
        );


    if (
      records.length === 0
    ) {

      return apiError(
        "No valid text rows were found.",
        400
      );

    }


    await ImportedPost.insertMany(
      records
    );


    return apiSuccess(
      {

        message:
          "CSV imported successfully.",

        imported:
          records.length,

      },
      201
    );

  } catch (error) {

    console.error(
      "CSV IMPORT ERROR:",
      error
    );


    return apiError(
      "Unable to import CSV."
    );
  }
}