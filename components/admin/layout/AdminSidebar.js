"use client";

// ============================================================
// SAFETALK AI
// ADMIN SIDEBAR
// RESPONSIVE MOBILE DRAWER
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import Image
  from "next/image";

import Link
  from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  LayoutDashboard,
  ScanText,
  Database,
  BrainCircuit,
  Users,
  History,
  FileBarChart,
  Settings,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";


// ============================================================
// MAIN SIDEBAR
// ============================================================

export default function AdminSidebar() {

  const router =
    useRouter();

  const pathname =
    usePathname();


  // ==========================================================
  // USER
  // ==========================================================

  const [
    user,
    setUser,
  ] =
    useState(null);


  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false);


  // ==========================================================
  // MOBILE SIDEBAR
  // ==========================================================

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);


  // ==========================================================
  // MENU
  // ==========================================================

  const menuItems = [

    {
      name:
        "Dashboard",

      href:
        "/admin",

      icon:
        LayoutDashboard,
    },

    {
      name:
        "Text Analysis",

      href:
        "/admin/text-analysis",

      icon:
        ScanText,
    },

    {
      name:
        "Manage Data",

      href:
        "/admin/manage-data",

      icon:
        Database,
    },

    {
      name:
        "Model Management",

      href:
        "/admin/model-management",

      icon:
        BrainCircuit,
    },

    {
      name:
        "Users & Roles",

      href:
        "/admin/users",

      icon:
        Users,
    },

    {
      name:
        "Results History",

      href:
        "/admin/history",

      icon:
        History,
    },

    {
      name:
        "Reports",

      href:
        "/admin/reports",

      icon:
        FileBarChart,
    },

    {
      name:
        "Settings",

      href:
        "/admin/settings",

      icon:
        Settings,
    },

  ];


  // ==========================================================
  // LOAD USER
  // ==========================================================

  useEffect(() => {

    const loadUser =
      async () => {

        try {

          const response =
            await fetch(
              "/api/auth/me",
              {
                cache:
                  "no-store",
              }
            );


          if (
            !response.ok
          ) {
            return;
          }


          const data =
            await response.json();


          if (
            data.success
          ) {

            setUser(
              data.user
            );

          }

        } catch (
          error
        ) {

          console.error(
            "SIDEBAR USER ERROR:",
            error
          );

        }

      };


    loadUser();

  }, []);


  // ==========================================================
  // LISTEN TO NAVBAR HAMBURGER
  // ==========================================================

  useEffect(() => {

    const openSidebar =
      () => {

        setMobileOpen(
          true
        );

      };


    window.addEventListener(
      "safetalk-open-admin-sidebar",
      openSidebar
    );


    return () => {

      window.removeEventListener(
        "safetalk-open-admin-sidebar",
        openSidebar
      );

    };

  }, []);


  // ==========================================================
  // CLOSE WHEN ROUTE CHANGES
  // ==========================================================

  useEffect(() => {

    setMobileOpen(
      false
    );

  }, [pathname]);


  // ==========================================================
  // PREVENT BODY SCROLL
  // ==========================================================

  useEffect(() => {

    if (
      mobileOpen
    ) {

      document.body.style
        .overflow =
        "hidden";

    } else {

      document.body.style
        .overflow =
        "";

    }


    return () => {

      document.body.style
        .overflow =
        "";

    };

  }, [mobileOpen]);


  // ==========================================================
  // ACTIVE LINK
  // ==========================================================

  const isActive =
    (
      href
    ) => {

      if (
        href ===
        "/admin"
      ) {

        return (
          pathname ===
          "/admin"
        );

      }


      return pathname
        .startsWith(
          href
        );

    };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout =
    async () => {

      if (
        loggingOut
      ) {
        return;
      }


      setLoggingOut(
        true
      );


      try {

        await fetch(
          "/api/auth/logout",
          {
            method:
              "POST",
          }
        );


        setMobileOpen(
          false
        );


        router.push(
          "/admin/login"
        );


        router.refresh();


      } catch (
        error
      ) {

        console.error(
          "LOGOUT ERROR:",
          error
        );


        setLoggingOut(
          false
        );

      }

    };


  // ==========================================================
  // INITIAL
  // ==========================================================

  const userInitial =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() ||
    "A";


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <>


      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      <div
        className={
          mobileOpen
            ? "admin-sidebar-overlay active"
            : "admin-sidebar-overlay"
        }
        onClick={() =>
          setMobileOpen(
            false
          )
        }
      />


      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={
          mobileOpen
            ? "admin-sidebar mobile-open"
            : "admin-sidebar"
        }
      >


        {/* ====================================================
            MOBILE CLOSE
        ==================================================== */}

        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={() =>
            setMobileOpen(
              false
            )
          }
          aria-label="Close menu"
        >

          <X
            size={21}
          />

        </button>


        {/* ====================================================
            LOGO
        ==================================================== */}

        <div className="sidebar-logo">

          <div className="sidebar-logo-image">

            <Image
              src="/images/safetalk-logo.png"
              alt="SafeTalkAI Logo"
              width={120}
              height={100}
              priority
            />

          </div>

        </div>


        {/* ====================================================
            NAVIGATION
        ==================================================== */}

        <nav className="sidebar-navigation">

          {menuItems.map(
            (
              item
            ) => {

              const Icon =
                item.icon;


              return (

                <Link
                  key={
                    item.name
                  }
                  href={
                    item.href
                  }
                  className={`sidebar-link ${
                    isActive(
                      item.href
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                >

                  <Icon
                    size={19}
                    strokeWidth={2}
                  />


                  <span>

                    {
                      item.name
                    }

                  </span>

                </Link>

              );

            }
          )}

        </nav>


        {/* ====================================================
            SIDEBAR BOTTOM
        ==================================================== */}

        <div className="sidebar-bottom">


          {/* ==================================================
              ADMIN PROFILE
          ================================================== */}

          <Link
            href="/admin/profile"
            className={`sidebar-user ${
              pathname ===
              "/admin/profile"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setMobileOpen(
                false
              )
            }
          >

            <div className="sidebar-avatar">

              {
                userInitial
              }

            </div>


            <div className="sidebar-user-info">

              <strong>

                {
                  user?.name ||
                  "Admin User"
                }

              </strong>


              <span>

                {
                  user?.role ||
                  "Admin"
                }

              </span>

            </div>


            <ChevronRight
              size={18}
              className="sidebar-user-arrow"
            />

          </Link>


          {/* ==================================================
              LOGOUT
          ================================================== */}

          <button
            type="button"
            className="sidebar-logout"
            onClick={
              handleLogout
            }
            disabled={
              loggingOut
            }
          >

            <LogOut
              size={18}
            />


            <span>

              {
                loggingOut
                  ? "Logging out..."
                  : "Logout"
              }

            </span>

          </button>

        </div>

      </aside>

    </>

  );
}