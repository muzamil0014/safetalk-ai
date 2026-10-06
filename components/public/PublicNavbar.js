"use client";

// ============================================================
// SAFETALK AI
// PUBLIC NAVBAR
// LOGIN STATE + PROFILE DROPDOWN + MOBILE MENU
// ============================================================

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  ChevronDown,
  UserRound,
  History,
  LogOut,
  Menu,
  X,
} from "lucide-react";


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function PublicNavbar() {

  const router =
    useRouter();


  // ==========================================================
  // STATES
  // ==========================================================

  const [user, setUser] =
    useState(null);

  const [
    loadingUser,
    setLoadingUser,
  ] =
    useState(true);

  const [
    dropdownOpen,
    setDropdownOpen,
  ] =
    useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] =
    useState(false);


  // ==========================================================
  // REF
  // ==========================================================

  const dropdownRef =
    useRef(null);


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


          if (!response.ok) {

            setUser(null);

            return;

          }


          const data =
            await response.json();


          if (
            data.success &&
            data.user
          ) {

            setUser(
              data.user
            );

          } else {

            setUser(null);

          }

        } catch (error) {

          console.error(
            "PUBLIC NAV USER ERROR:",
            error
          );


          setUser(null);

        } finally {

          setLoadingUser(
            false
          );

        }

      };


    loadUser();

  }, []);


  // ==========================================================
  // CLOSE DESKTOP DROPDOWN OUTSIDE
  // ==========================================================

  useEffect(() => {

    const handleOutside =
      (event) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target
          )
        ) {

          setDropdownOpen(
            false
          );

        }

      };


    document.addEventListener(
      "mousedown",
      handleOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutside
      );

    };

  }, []);


  // ==========================================================
  // CLOSE MOBILE MENU ON DESKTOP
  // ==========================================================

  useEffect(() => {

    const handleResize =
      () => {

        if (
          window.innerWidth >
          900
        ) {

          setMobileMenuOpen(
            false
          );

        }

      };


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  // ==========================================================
  // LOCK BODY WHEN MENU OPEN
  // ==========================================================

  useEffect(() => {

    if (mobileMenuOpen) {

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "";

    }


    return () => {

      document.body.style.overflow =
        "";

    };

  }, [mobileMenuOpen]);


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout =
    async () => {

      if (loggingOut) {
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


        setUser(null);

        setDropdownOpen(
          false
        );

        setMobileMenuOpen(
          false
        );


        router.push(
          "/"
        );


        router.refresh();

      } catch (error) {

        console.error(
          "LOGOUT ERROR:",
          error
        );

      } finally {

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
    "U";


  // ==========================================================
  // CLOSE MOBILE MENU
  // ==========================================================

  const closeMobileMenu =
    () => {

      setMobileMenuOpen(
        false
      );

    };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <>

      <header className="public-navbar">

        <div className="public-navbar-inner">


          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            href="/"
            className="public-logo"
            onClick={
              closeMobileMenu
            }
          >

            <Image
              src="/images/safetalk-logo2.png"
              alt="SafeTalkAI"
              width={72}
              height={62}
              priority
            />


            <span>

              SafeTalk

              <span>
                AI
              </span>

            </span>

          </Link>


          {/* ==================================================
              DESKTOP LINKS
          ================================================== */}

          <nav className="public-nav-links">

            <a href="/#home">
              Home
            </a>

            <a href="/#features">
              Features
            </a>

            <a href="/#how-it-works">
              How It Works
            </a>

            <a href="/#languages">
              Languages
            </a>

            <a href="/#analyze">
              Analyze
            </a>

            <a href="/#about">
              About
            </a>

          </nav>


          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <div className="public-nav-actions">


            {/* LOADING */}

            {loadingUser ? (

              <div className="public-user-loading">
              </div>

            ) : !user ? (

              <>

                <Link
                  href="/login"
                  className="public-login-link"
                >
                  Login
                </Link>


                <Link
                  href="/register"
                  className="public-get-started"
                >
                  Get Started
                </Link>

              </>

            ) : user.role === "User" ? (

              /* ================================================
                 LOGGED USER DESKTOP
              ================================================ */

              <div
                className="public-user-menu-wrapper public-desktop-user-profile"
                ref={dropdownRef}
              >

                <button
                  type="button"
                  className="public-user-button"
                  onClick={() =>
                    setDropdownOpen(
                      !dropdownOpen
                    )
                  }
                >

                  <div className="public-user-avatar">

                    {userInitial}

                  </div>


                  <div className="public-user-button-info">

                    <strong>
                      {user.name}
                    </strong>

                    <span>
                      User
                    </span>

                  </div>


                  <ChevronDown
                    size={15}
                    className={
                      dropdownOpen
                        ? "rotate"
                        : ""
                    }
                  />

                </button>


                {dropdownOpen && (

                  <div className="public-profile-dropdown">

                    <div className="public-dropdown-user">

                      <div>
                        {userInitial}
                      </div>


                      <span>

                        <strong>
                          {user.name}
                        </strong>

                        <small>
                          {user.email}
                        </small>

                      </span>

                    </div>


                    <Link
                      href="/profile"
                      onClick={() =>
                        setDropdownOpen(
                          false
                        )
                      }
                    >

                      <UserRound
                        size={17}
                      />

                      Profile

                    </Link>


                    <Link
                      href="/history"
                      onClick={() =>
                        setDropdownOpen(
                          false
                        )
                      }
                    >

                      <History
                        size={17}
                      />

                      Analysis History

                    </Link>


                    <div className="public-dropdown-divider">
                    </div>


                    <button
                      type="button"
                      className="public-dropdown-logout"
                      onClick={
                        handleLogout
                      }
                      disabled={
                        loggingOut
                      }
                    >

                      <LogOut
                        size={17}
                      />

                      {loggingOut
                        ? "Logging out..."
                        : "Logout"}

                    </button>

                  </div>

                )}

              </div>

            ) : (

              <>

                <Link
                  href="/login"
                  className="public-login-link"
                >
                  Login
                </Link>


                <Link
                  href="/register"
                  className="public-get-started"
                >
                  Get Started
                </Link>

              </>

            )}


            {/* ==================================================
                MOBILE HAMBURGER
            ================================================== */}

            <button
              type="button"
              className="public-mobile-menu-button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              aria-label={
                mobileMenuOpen
                  ? "Close Menu"
                  : "Open Menu"
              }
            >

              {mobileMenuOpen ? (

                <X size={22} />

              ) : (

                <Menu size={22} />

              )}

            </button>

          </div>

        </div>

      </header>


      {/* ======================================================
          BLUR / DARK BACKDROP
      ====================================================== */}

      {mobileMenuOpen && (

        <div
          className="public-mobile-menu-backdrop"
          onClick={
            closeMobileMenu
          }
        >
        </div>

      )}


      {/* ======================================================
          MOBILE MENU
      ====================================================== */}

      <div
        className={
          mobileMenuOpen
            ? "public-mobile-menu open"
            : "public-mobile-menu"
        }
      >

        <a
          href="/#home"
          onClick={
            closeMobileMenu
          }
        >
          Home
        </a>


        <a
          href="/#features"
          onClick={
            closeMobileMenu
          }
        >
          Features
        </a>


        <a
          href="/#how-it-works"
          onClick={
            closeMobileMenu
          }
        >
          How It Works
        </a>


        <a
          href="/#languages"
          onClick={
            closeMobileMenu
          }
        >
          Languages
        </a>


        <a
          href="/#analyze"
          onClick={
            closeMobileMenu
          }
        >
          Analyze
        </a>


        <a
          href="/#about"
          onClick={
            closeMobileMenu
          }
        >
          About
        </a>


        {/* ====================================================
            NOT LOGGED IN
        ==================================================== */}

        {!user && (

          <Link
            href="/login"
            className="public-mobile-login"
            onClick={
              closeMobileMenu
            }
          >
            Login
          </Link>

        )}


        {/* ====================================================
            LOGGED USER
        ==================================================== */}

        {user &&
          user.role === "User" && (

            <div className="public-mobile-user-section">


              <div className="public-mobile-user-info">

                <div className="public-mobile-user-avatar">

                  {userInitial}

                </div>


                <div>

                  <strong>
                    {user.name}
                  </strong>

                  <span>
                    {user.email}
                  </span>

                </div>

              </div>


              <Link
                href="/profile"
                onClick={
                  closeMobileMenu
                }
              >

                <UserRound
                  size={17}
                />

                Profile

              </Link>


              <Link
                href="/history"
                onClick={
                  closeMobileMenu
                }
              >

                <History
                  size={17}
                />

                Analysis History

              </Link>


              <button
                type="button"
                className="public-mobile-logout"
                onClick={
                  handleLogout
                }
                disabled={
                  loggingOut
                }
              >

                <LogOut
                  size={17}
                />

                {loggingOut
                  ? "Logging out..."
                  : "Logout"}

              </button>

            </div>

          )}

      </div>

    </>

  );
}