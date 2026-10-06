"use client";

// ============================================================
// SAFETALK AI
// ADMIN LAYOUT
// ============================================================

import "./admin.css";

import {
  usePathname,
} from "next/navigation";

import AdminSidebar
  from "@/components/admin/layout/AdminSidebar";

import AdminNavbar
  from "@/components/admin/layout/AdminNavbar";


// ============================================================
// MAIN ADMIN LAYOUT
// ============================================================

export default function AdminLayout({
  children,
}) {

  // ==========================================================
  // CURRENT ROUTE
  // ==========================================================

  const pathname =
    usePathname();


  // ==========================================================
  // ADMIN LOGIN PAGE
  //
  // Login page par Sidebar/Navbar show nahi honge.
  // ==========================================================

  if (
    pathname ===
    "/admin/login"
  ) {

    return (
      <>
        {children}
      </>
    );

  }


  // ==========================================================
  // ADMIN PANEL LAYOUT
  // ==========================================================

  return (

    <div className="admin-layout">

      {/* SIDEBAR */}

      <AdminSidebar />


      {/* MAIN */}

      <div className="admin-main">


        {/* NAVBAR */}

        <AdminNavbar />


        {/* PAGE CONTENT */}

        <main className="admin-content">

          {children}

        </main>

      </div>

    </div>

  );
}