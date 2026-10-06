// ============================================================
// SAFETALK AI
// NEXT.JS 16 PROXY
// ADMIN + PUBLIC USER ROUTE PROTECTION
// ============================================================

import {
  NextResponse,
} from "next/server";

import {
  jwtVerify,
} from "jose";


// ============================================================
// JWT SECRET
// ============================================================

const secret =
  new TextEncoder().encode(
    process.env.JWT_SECRET
  );


// ============================================================
// ANALYST ALLOWED ADMIN ROUTES
// ============================================================

const analystRoutes = [

  "/admin",

  "/admin/text-analysis",

  "/admin/history",

  "/admin/reports",

  "/admin/profile",

];


// ============================================================
// CHECK ANALYST ROUTE
// ============================================================

function analystAllowed(
  pathname
) {

  return analystRoutes.some(
    (route) => {

      // Admin dashboard exact route
      if (
        route === "/admin"
      ) {

        return (
          pathname ===
          "/admin"
        );

      }


      // Other analyst routes
      return pathname.startsWith(
        route
      );

    }
  );

}


// ============================================================
// VERIFY JWT
// ============================================================

async function verifyToken(
  token
) {

  try {

    const {
      payload,
    } =
      await jwtVerify(
        token,
        secret
      );


    return payload;

  } catch {

    return null;

  }

}


// ============================================================
// MAIN PROXY
// ============================================================

export async function proxy(
  request
) {

  const pathname =
    request.nextUrl.pathname;


  const token =
    request.cookies.get(
      "safetalk_token"
    )?.value;


  // ==========================================================
  // ADMIN LOGIN PAGE
  //
  // IMPORTANT:
  // ALWAYS ALLOW /admin/login
  //
  // Even if normal User is already logged in,
  // user can open Admin Login and login as Admin.
  // ==========================================================

  if (
    pathname ===
    "/admin/login"
  ) {

    return NextResponse.next();

  }


  // ==========================================================
  // PUBLIC USER PROFILE + HISTORY
  // ==========================================================

  if (
    pathname === "/profile" ||
    pathname === "/history"
  ) {

    // No login
    if (!token) {

      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      );

    }


    const payload =
      await verifyToken(
        token
      );


    // Invalid token
    if (!payload) {

      const response =
        NextResponse.redirect(
          new URL(
            "/login",
            request.url
          )
        );


      response.cookies.delete(
        "safetalk_token"
      );


      return response;

    }


    // Only public User can access
    if (
      payload.role !==
      "User"
    ) {

      return NextResponse.redirect(
        new URL(
          "/admin",
          request.url
        )
      );

    }


    return NextResponse.next();

  }


  // ==========================================================
  // ADMIN ROUTES
  // ==========================================================

  if (
    pathname === "/admin" ||
    pathname.startsWith(
      "/admin/"
    )
  ) {

    // ========================================================
    // NOT LOGGED IN
    // ========================================================

    if (!token) {

      return NextResponse.redirect(
        new URL(
          "/admin/login",
          request.url
        )
      );

    }


    // ========================================================
    // VERIFY TOKEN
    // ========================================================

    const payload =
      await verifyToken(
        token
      );


    // ========================================================
    // INVALID / EXPIRED TOKEN
    // ========================================================

    if (!payload) {

      const response =
        NextResponse.redirect(
          new URL(
            "/admin/login",
            request.url
          )
        );


      response.cookies.delete(
        "safetalk_token"
      );


      return response;

    }


    // ========================================================
    // NORMAL USER TRYING TO OPEN ADMIN
    //
    // IMPORTANT FIX:
    // Previously this redirected to "/"
    //
    // Now it redirects to "/admin/login"
    // ========================================================

    if (
      payload.role ===
      "User"
    ) {

      return NextResponse.redirect(
        new URL(
          "/admin/login",
          request.url
        )
      );

    }


    // ========================================================
    // ADMIN
    // Full access
    // ========================================================

    if (
      payload.role ===
      "Admin"
    ) {

      return NextResponse.next();

    }


    // ========================================================
    // ANALYST
    // Limited routes
    // ========================================================

    if (
      payload.role ===
        "Analyst" &&
      analystAllowed(
        pathname
      )
    ) {

      return NextResponse.next();

    }


    // ========================================================
    // ANALYST ACCESS DENIED
    // ========================================================

    if (
      payload.role ===
      "Analyst"
    ) {

      return NextResponse.redirect(
        new URL(
          "/admin",
          request.url
        )
      );

    }


    // ========================================================
    // UNKNOWN ROLE
    // ========================================================

    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url
      )
    );

  }


  // ==========================================================
  // ALL OTHER PUBLIC ROUTES
  // ==========================================================

  return NextResponse.next();

}


// ============================================================
// MATCHER
// ============================================================

export const config = {

  matcher: [

    "/admin/:path*",

    "/profile",

    "/history",

  ],

};