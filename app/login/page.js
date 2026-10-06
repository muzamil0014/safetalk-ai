"use client";

// ============================================================
// SAFETALK AI
// PUBLIC USER LOGIN PAGE
// NEXT.JS SUSPENSE FIX
// ============================================================

import {
  Suspense,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";


// ============================================================
// LOGIN CONTENT
// ============================================================

function LoginContent() {

  // ==========================================================
  // ROUTER
  // ==========================================================

  const router =
    useRouter();


  const searchParams =
    useSearchParams();


  // ==========================================================
  // QUERY PARAMETERS
  // ==========================================================

  const registered =
    searchParams.get(
      "registered"
    );


  const redirect =
    searchParams.get(
      "redirect"
    );


  // ==========================================================
  // STATES
  // ==========================================================

  const [
    email,
    setEmail,
  ] =
    useState("");


  const [
    password,
    setPassword,
  ] =
    useState("");


  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  // ==========================================================
  // LOGIN SUBMIT
  // ==========================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setLoading(true);

      setError("");


      try {

        // ====================================================
        // LOGIN REQUEST
        // ====================================================

        const response =
          await fetch(
            "/api/auth/login",
            {
              method:
                "POST",

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
        // ADMIN / ANALYST BLOCK
        //
        // Public login normal users ke liye hai.
        // Admin/Analyst ko /admin/login use karna hoga.
        // ====================================================

        if (
          data.user?.role ===
            "Admin" ||
          data.user?.role ===
            "Analyst"
        ) {

          await fetch(
            "/api/auth/logout",
            {
              method:
                "POST",
            }
          );


          setError(
            "Administrator accounts must use the Admin Login page."
          );

          return;
        }


        // ====================================================
        // ONLY USER ROLE ALLOWED
        // ====================================================

        if (
          data.user?.role !==
          "User"
        ) {

          await fetch(
            "/api/auth/logout",
            {
              method:
                "POST",
            }
          );


          setError(
            "This account cannot access the public user area."
          );

          return;
        }


        // ====================================================
        // LOGIN SUCCESS
        // ====================================================

        if (
          redirect ===
          "analyze"
        ) {

          router.push(
            "/#analyze"
          );

        } else {

          router.push(
            "/"
          );

        }


        router.refresh();


      } catch (error) {

        console.error(
          "PUBLIC LOGIN ERROR:",
          error
        );


        setError(
          "Unable to connect to server."
        );


      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <main className="public-auth-page">


      {/* ======================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div className="public-auth-glow">
      </div>


      {/* ======================================================
          AUTH CONTAINER
      ====================================================== */}

      <div className="public-auth-container">


        {/* ====================================================
            LEFT BRAND SIDE
        ==================================================== */}

        <section className="public-auth-brand">


          {/* LOGO */}

          <Link href="/">

            <Image
              src="/images/safetalk-logo2.png"
              alt="SafeTalkAI"
              width={140}
              height={110}
              priority
            />

          </Link>


          {/* BRAND LABEL */}

          <span>
            AI-POWERED MODERATION
          </span>


          {/* TITLE */}

          <h1>
            Welcome Back
          </h1>


          {/* DESCRIPTION */}

          <p>
            Login to SafeTalkAI to analyze
            multilingual social media text,
            review your previous results,
            and manage your profile.
          </p>


          {/* FEATURE */}

          <div className="public-auth-brand-feature">

            <ShieldCheck
              size={19}
            />

            Secure user authentication

          </div>

        </section>


        {/* ====================================================
            RIGHT LOGIN CARD
        ==================================================== */}

        <section className="public-auth-card">


          {/* LABEL */}

          <span className="public-auth-label">

            USER LOGIN

          </span>


          {/* TITLE */}

          <h2>
            Sign In
          </h2>


          {/* DESCRIPTION */}

          <p>
            Sign in and continue using
            SafeTalkAI on the public website.
          </p>


          {/* ==================================================
              REGISTER SUCCESS MESSAGE
          ================================================== */}

          {registered && (

            <div className="public-auth-success">

              Account created successfully.
              You can now login.

            </div>

          )}


          {/* ==================================================
              LOGIN FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="public-auth-form"
          >


            {/* ================================================
                EMAIL
            ================================================ */}

            <label
              htmlFor="user-email"
            >
              Email Address
            </label>


            <div className="public-auth-input">

              <Mail
                size={18}
              />


              <input
                id="user-email"
                type="email"
                placeholder="you@example.com"
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


            {/* ================================================
                PASSWORD
            ================================================ */}

            <label
              htmlFor="user-password"
            >
              Password
            </label>


            <div className="public-auth-input">

              <LockKeyhole
                size={18}
              />


              <input
                id="user-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
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


              {/* SHOW / HIDE PASSWORD */}

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword ? (

                  <EyeOff
                    size={17}
                  />

                ) : (

                  <Eye
                    size={17}
                  />

                )}

              </button>

            </div>


            {/* ================================================
                ERROR
            ================================================ */}

            {error && (

              <div className="public-auth-error">

                {error}

              </div>

            )}


            {/* ================================================
                SUBMIT
            ================================================ */}

            <button
              type="submit"
              className="public-auth-submit"
              disabled={loading}
            >

              {loading ? (

                <>

                  <LoaderCircle
                    size={18}
                    className="analysis-spinner"
                  />

                  Signing In...

                </>

              ) : (

                <>

                  Sign In

                  <ArrowRight
                    size={18}
                  />

                </>

              )}

            </button>

          </form>


          {/* ==================================================
              REGISTER
          ================================================== */}

          <div className="public-auth-switch">

            Don't have an account?

            <Link href="/register">

              Register

            </Link>

          </div>


          {/* ==================================================
              ADMIN LOGIN
          ================================================== */}

          <Link
            href="/admin/login"
            className="public-admin-login-link"
          >
            Administrator Login
          </Link>

        </section>

      </div>

    </main>

  );

}


// ============================================================
// SUSPENSE LOADING
// ============================================================

function LoginLoading() {

  return (

    <main className="public-auth-page">

      <div className="public-auth-glow">
      </div>


      <div className="public-auth-container">

        <section className="public-auth-card">

          <LoaderCircle
            size={28}
            className="analysis-spinner"
          />

        </section>

      </div>

    </main>

  );

}


// ============================================================
// MAIN PAGE
//
// useSearchParams() LoginContent ke andar hai.
// LoginContent Suspense ke andar render hota hai.
// Next.js production build error fix.
// ============================================================

export default function LoginPage() {

  return (

    <Suspense
      fallback={
        <LoginLoading />
      }
    >

      <LoginContent />

    </Suspense>

  );

}