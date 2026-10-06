// ============================================================
// SAFETALK AI
// COMMON API RESPONSE HELPERS
// ============================================================

import { NextResponse } from "next/server";


// ============================================================
// SUCCESS RESPONSE
// ============================================================

export function apiSuccess(
  data = {},
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    {
      status,
    }
  );
}


// ============================================================
// ERROR RESPONSE
// ============================================================

export function apiError(
  message = "Something went wrong.",
  status = 500,
  details = null
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(details && { details }),
    },
    {
      status,
    }
  );
}


// ============================================================
// PAGINATION HELPER
// ============================================================

export function getPagination(searchParams) {

  let page =
    Number(
      searchParams.get("page")
    ) || 1;

  let limit =
    Number(
      searchParams.get("limit")
    ) || 10;


  // Safety
  page = Math.max(1, page);

  limit = Math.min(
    100,
    Math.max(1, limit)
  );


  return {
    page,
    limit,
    skip:
      (page - 1) * limit,
  };
}