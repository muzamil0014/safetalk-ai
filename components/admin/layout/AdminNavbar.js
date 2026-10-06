"use client";

// ============================================================
// SAFETALK AI
// ADMIN TOP NAVBAR
// REAL USER + NOTIFICATION COUNT
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import Link
  from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  Bell,
  CalendarDays,
  ChevronDown,
  Menu,
} from "lucide-react";


// ============================================================
// PAGE INFORMATION
// ============================================================

const pageInformation = {

  "/admin": {
    title:
      "Dashboard",
    description:
      "Real-time overview of AI text analysis system",
  },

  "/admin/text-analysis": {
    title:
      "Text Analysis",
    description:
      "Analyze text for sentiment, threats, toxicity and risk",
  },

  "/admin/social-media": {
    title:
      "Social Media",
    description:
      "Import and analyze social media content",
  },

  "/admin/manage-data": {
    title:
      "Manage Data",
    description:
      "Manage and organize SafeTalkAI analysis records",
  },

  "/admin/model-management": {
    title:
      "Model Management",
    description:
      "Monitor AI models, versions and evaluation metrics",
  },

  "/admin/users": {
    title:
      "Users & Roles",
    description:
      "Manage users, roles and account access",
  },

  "/admin/history": {
    title:
      "Results History",
    description:
      "Review previous SafeTalkAI analysis results",
  },

  "/admin/reports": {
    title:
      "Reports",
    description:
      "View analysis statistics and system reports",
  },

  "/admin/settings": {
    title:
      "Settings",
    description:
      "Configure SafeTalkAI system preferences",
  },

  "/admin/profile": {
    title:
      "Admin Profile",
    description:
      "Manage your administrator account and profile",
  },

};


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AdminNavbar() {

  // ==========================================================
  // CURRENT PATH
  // ==========================================================

  const pathname =
    usePathname();


  // ==========================================================
  // STATES
  // ==========================================================

  const [user, setUser] =
    useState(null);

  const [
    unreadNotifications,
    setUnreadNotifications,
  ] =
    useState(0);

  const [
    notifications,
    setNotifications,
  ] =
    useState([]);

  const [
    showNotifications,
    setShowNotifications,
  ] =
    useState(false);


  // ==========================================================
  // LOAD CURRENT USER
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


          if (!response.ok) {
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

        } catch (error) {

          console.error(
            "NAVBAR USER ERROR:",
            error
          );

        }

      };


    loadUser();

  }, []);


  // ==========================================================
  // LOAD NOTIFICATIONS
  // ==========================================================

  const loadNotifications =
    async () => {

      try {

        const response =
          await fetch(
            "/api/admin/notifications",
            {
              cache:
                "no-store",
            }
          );


        if (!response.ok) {
          return;
        }


        const data =
          await response.json();


        setUnreadNotifications(
          data.unread ||
          0
        );


        setNotifications(
          data.notifications ||
          []
        );

      } catch (error) {

        console.error(
          "NOTIFICATION ERROR:",
          error
        );

      }

    };


  useEffect(() => {

    loadNotifications();

  }, []);


  // ==========================================================
  // MARK ALL READ
  // ==========================================================

  const markAllRead =
    async () => {

      try {

        const response =
          await fetch(
            "/api/admin/notifications",
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  markAll:
                    true,
                }),
            }
          );


        if (!response.ok) {
          return;
        }


        setUnreadNotifications(
          0
        );


        setNotifications(
          (previous) =>
            previous.map(
              (item) => ({

                ...item,

                read:
                  true,

              })
            )
        );

      } catch (error) {

        console.error(
          "MARK NOTIFICATIONS ERROR:",
          error
        );

      }

    };


  // ==========================================================
  // CURRENT PAGE
  // ==========================================================

  const currentPage =
    pageInformation[pathname] ||
    {
      title:
        "SafeTalkAI",

      description:
        "AI-Based Multilingual Text Analysis System",
    };


  // ==========================================================
  // USER INITIAL
  // ==========================================================

  const userInitial =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() ||
    "A";


  return (

    <header className="admin-navbar">


      {/* ======================================================
          MOBILE MENU
      ====================================================== */}
<button
  type="button"
  className="navbar-mobile-menu"
  aria-label="Open Menu"
  onClick={() => {

    window.dispatchEvent(
      new Event(
        "safetalk-open-admin-sidebar"
      )
    );

  }}
>

  <Menu
    size={23}
  />

</button>


      {/* ======================================================
          PAGE TITLE
      ====================================================== */}

      <div className="navbar-title">

        <h1>
          {currentPage.title}
        </h1>


        <p>
          {currentPage.description}
        </p>

      </div>


      {/* ======================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="navbar-actions">


        {/* ====================================================
            DATE
        ==================================================== */}

        <button
          type="button"
          className="navbar-date"
        >

          <CalendarDays size={18} />

          <span>
            Sep 1, 2026 - Sep 30, 2026
          </span>

          <ChevronDown size={16} />

        </button>


        {/* ====================================================
            NOTIFICATION WRAPPER
        ==================================================== */}

<div className="navbar-notification-wrapper">


          {/* BELL */}

          <button
            type="button"
            className="navbar-notification"
            aria-label="Notifications"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
          >

            <Bell size={20} />


            {unreadNotifications > 0 && (

              <span className="notification-dot">
              </span>

            )}

          </button>


          {/* ==================================================
              DROPDOWN
          ================================================== */}

          {showNotifications && (

            <div className="navbar-notification-dropdown">


              {/* HEADER */}

              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  padding:
                    "14px",

                  borderBottom:
                    "1px solid #edf1f7",
                }}
              >

                <div>

                  <strong
                    style={{
                      fontSize:
                        "12px",

                      color:
                        "#172039",
                    }}
                  >
                    Notifications
                  </strong>


                  <div
                    style={{
                      marginTop:
                        "3px",

                      fontSize:
                        "9px",

                      color:
                        "#8992a5",
                    }}
                  >
                    {unreadNotifications} unread
                  </div>

                </div>


                {unreadNotifications > 0 && (

                  <button
                    type="button"
                    onClick={
                      markAllRead
                    }
                    style={{
                      border:
                        "none",

                      background:
                        "transparent",

                      color:
                        "#1769ff",

                      fontSize:
                        "9px",

                      cursor:
                        "pointer",
                    }}
                  >
                    Mark all read
                  </button>

                )}

              </div>


              {/* NOTIFICATIONS */}

              {notifications.length > 0 ? (

                notifications.map(
                  (notification) => (

                    <div
                      key={
                        notification._id
                      }
                      style={{
                        padding:
                          "13px 14px",

                        borderBottom:
                          "1px solid #f0f3f8",

                        background:
                          notification.read
                            ? "#ffffff"
                            : "#f8faff",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "space-between",

                          gap:
                            "10px",
                        }}
                      >

                        <strong
                          style={{
                            color:
                              notification.type ===
                              "critical"
                                ? "#d92f4b"
                                : notification.type ===
                                  "warning"
                                ? "#e48c00"
                                : "#27344c",

                            fontSize:
                              "10px",
                          }}
                        >

                          {notification.title}

                        </strong>


                        {!notification.read && (

                          <span
                            style={{
                              width:
                                "7px",

                              height:
                                "7px",

                              flexShrink:
                                0,

                              borderRadius:
                                "50%",

                              background:
                                "#1769ff",
                            }}
                          ></span>

                        )}

                      </div>


                      <p
                        style={{
                          marginTop:
                            "5px",

                          color:
                            "#7f899d",

                          fontSize:
                            "9px",

                          lineHeight:
                            "1.5",
                        }}
                      >

                        {notification.message}

                      </p>


                      <span
                        style={{
                          display:
                            "block",

                          marginTop:
                            "7px",

                          color:
                            "#a0a8b8",

                          fontSize:
                            "8px",
                        }}
                      >

                        {notification.createdAt
                          ? new Date(
                              notification.createdAt
                            ).toLocaleString()
                          : ""}

                      </span>

                    </div>

                  )
                )

              ) : (

                <div
                  style={{
                    padding:
                      "30px 15px",

                    textAlign:
                      "center",

                    color:
                      "#8992a5",

                    fontSize:
                      "10px",
                  }}
                >
                  No notifications yet.
                </div>

              )}

            </div>

          )}

        </div>


        {/* ====================================================
            ADMIN PROFILE
        ==================================================== */}

        <Link
          href="/admin/profile"
          className="navbar-profile"
        >

          <div className="navbar-avatar">

            {userInitial}

          </div>


          <div className="navbar-profile-text">

            <strong>

              {user?.name ||
                "Admin"}

            </strong>


            <span>

              {user?.role ||
                "Administrator"}

            </span>

          </div>


          <ChevronDown size={16} />

        </Link>

      </div>

    </header>

  );
}