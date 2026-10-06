"use client";

// ============================================================
// SAFETALK AI
// ADMIN LOGIN PAGE
// ============================================================

import { useState } from "react";

import Image from "next/image";

import {
  useRouter,
} from "next/navigation";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";


// ============================================================
// MAIN PAGE
// ============================================================

export default function AdminLoginPage() {

  // ==========================================================
  // ROUTER
  // ==========================================================

  const router =
    useRouter();


  // ==========================================================
  // STATES
  // ==========================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOGIN FUNCTION
  // ==========================================================

  const handleLogin =
    async (event) => {

      event.preventDefault();


      // Clear old error
      setError("");


      // Basic validation
      if (
        !email.trim() ||
        !password.trim()
      ) {

        setError(
          "Please enter email and password."
        );

        return;
      }


      setLoading(true);


      try {

        const response =
          await fetch(
            "/api/auth/login",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  email:
                    email.trim(),

                  password,
                }),
            }
          );


        const data =
          await response.json();


        // ====================================================
        // LOGIN FAILED
        // ====================================================

        if (!response.ok) {

          setError(
            data.message ||
            "Invalid email or password."
          );

          return;
        }


        // ====================================================
        // ONLY ADMIN / ANALYST ALLOWED
        // ====================================================

        if (
          data.user?.role !==
            "Admin" &&
          data.user?.role !==
            "Analyst"
        ) {

          // Clear cookie again
          await fetch(
            "/api/auth/logout",
            {
              method: "POST",
            }
          );


          setError(
            "You do not have permission to access the admin panel."
          );

          return;
        }


        // ====================================================
        // SUCCESS
        // ====================================================

        router.push(
          "/admin"
        );


        router.refresh();

      } catch (error) {

        console.error(
          "ADMIN LOGIN ERROR:",
          error
        );


        setError(
          "Unable to connect to the server."
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <main className="admin-login-page">


      {/* ======================================================
          BACKGROUND EFFECTS
      ====================================================== */}

      <div className="admin-login-grid"></div>

      <div className="admin-login-glow glow-one"></div>

      <div className="admin-login-glow glow-two"></div>


      {/* ======================================================
          LOGIN WRAPPER
      ====================================================== */}

      <div className="admin-login-wrapper">


        {/* ====================================================
            LEFT BRAND SIDE
        ==================================================== */}

        <section className="admin-login-brand">


          {/* LOGO */}

          <div className="admin-login-brand-logo">

            <Image
              src="/images/safetalk-logo2.png"
              alt="SafeTalkAI"
              width={170}
              height={120}
              priority
            />

          </div>


          {/* CONTENT */}

          <div className="admin-login-brand-content">

            <span className="admin-login-badge">

              <ShieldCheck size={15} />

              Secure Administration

            </span>


            <h1>

              Intelligent moderation
              for safer digital spaces.

            </h1>


            <p>

              SafeTalkAI helps administrators
              analyze multilingual social media
              content for sentiment, threats,
              toxicity, hate speech and risk.

            </p>

          </div>


          {/* FEATURE INFO */}

          <div className="admin-login-features">

            <div>

              <span>01</span>

              <p>
                Multilingual
                <strong>
                  English, Urdu & Roman Urdu
                </strong>
              </p>

            </div>


            <div>

              <span>02</span>

              <p>
                AI Analysis
                <strong>
                  Threat & Toxicity Detection
                </strong>
              </p>

            </div>


            <div>

              <span>03</span>

              <p>
                Secure Access
                <strong>
                  Role-Based Administration
                </strong>
              </p>

            </div>

          </div>

        </section>


        {/* ====================================================
            RIGHT LOGIN CARD
        ==================================================== */}

        <section className="admin-login-card">


          {/* TOP */}

          <div className="admin-login-card-top">

            <div className="admin-login-shield">

              <ShieldCheck size={25} />

            </div>


            <div>

              <span>
                ADMIN PORTAL
              </span>

              <h2>
                Welcome Back
              </h2>

              <p>
                Sign in to access your
                SafeTalkAI administration panel.
              </p>

            </div>

          </div>


          {/* ==================================================
              FORM
          ================================================== */}

          <form
            className="admin-login-form"
            onSubmit={handleLogin}
          >


            {/* EMAIL */}

            <div className="admin-login-field">

              <label
                htmlFor="admin-email"
              >
                Email Address
              </label>


              <div className="admin-login-input">

                <Mail size={18} />


                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@safetalk.ai"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  disabled={loading}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="admin-login-field">

              <div className="admin-login-label-row">

                <label
                  htmlFor="admin-password"
                >
                  Password
                </label>


                <span>
                  Administrator access
                </span>

              </div>


              <div className="admin-login-input">

                <LockKeyhole size={18} />


                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />


                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (

                    <EyeOff size={17} />

                  ) : (

                    <Eye size={17} />

                  )}

                </button>

              </div>

            </div>


            {/* ERROR */}

            {error && (

              <div className="admin-login-error">

                {error}

              </div>

            )}


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >

              {loading ? (

                <>
                  <LoaderCircle
                    size={19}
                    className="analysis-spinner"
                  />

                  Signing In...
                </>

              ) : (

                <>
                  Sign In to Admin Panel

                  <ArrowRight size={18} />
                </>

              )}

            </button>

          </form>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="admin-login-footer">

            <ShieldCheck size={14} />

            <span>
              Protected by SafeTalkAI secure
              authentication
            </span>

          </div>

        </section>

      </div>

    </main>

  );
}