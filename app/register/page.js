"use client";

// ============================================================
// SAFETALK AI
// PUBLIC USER REGISTER PAGE
// ============================================================

import {
  useState,
} from "react";

import Link from "next/link";

import Image from "next/image";

import {
  useRouter,
} from "next/navigation";

import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function RegisterPage() {

  const router =
    useRouter();


  // ==========================================================
  // STATES
  // ==========================================================

  const [
    form,
    setForm,
  ] =
    useState({
      name: "",
      email: "",
      password: "",
    });


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
  // CHANGE
  // ==========================================================

  const handleChange =
    (
      event
    ) => {

      setForm({
        ...form,

        [event.target.name]:
          event.target.value,
      });

    };


  // ==========================================================
  // REGISTER
  // ==========================================================

  const handleSubmit =
    async (
      event
    ) => {

      event.preventDefault();


      setError("");


      // ======================================================
      // VALIDATION
      // ======================================================

      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.password.trim()
      ) {

        setError(
          "Please complete all fields."
        );

        return;
      }


      if (
        form.password.length <
        8
      ) {

        setError(
          "Password must be at least 8 characters."
        );

        return;
      }


      setLoading(
        true
      );


      try {

        const response =
          await fetch(
            "/api/auth/register",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  name:
                    form.name.trim(),

                  email:
                    form.email.trim(),

                  password:
                    form.password,
                }),
            }
          );


        const data =
          await response.json();


        // ====================================================
        // ERROR
        // ====================================================

        if (
          !response.ok
        ) {

          setError(
            data.message ||
            "Unable to create account."
          );

          return;
        }


        // ====================================================
        // SUCCESS
        // ====================================================

        router.push(
          "/login?registered=true"
        );


        router.refresh();


      } catch (
        registerError
      ) {

        console.error(
          "REGISTER ERROR:",
          registerError
        );


        setError(
          "Unable to connect to server."
        );


      } finally {

        setLoading(
          false
        );

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
          CONTAINER
      ====================================================== */}

      <div className="public-auth-container">


        {/* ====================================================
            LEFT BRAND SIDE
        ==================================================== */}

        <section className="public-auth-brand">


          {/* LOGO */}

          <Link
            href="/"
            className="public-auth-logo-link"
          >

            <Image
              src="/images/safetalk-logo2.png"
              alt="SafeTalkAI"
              width={140}
              height={110}
              priority
            />

          </Link>


          {/* LABEL */}

          <span>
            SAFER DIGITAL COMMUNITIES
          </span>


          {/* TITLE */}

          <h1>
            Join SafeTalkAI
          </h1>


          {/* DESCRIPTION */}

          <p>
            Create your account and analyze
            multilingual social media content
            using artificial intelligence.
          </p>


          {/* FEATURE */}

          <div className="public-auth-brand-feature">

            <ShieldCheck
              size={19}
            />

            Secure AI-powered text analysis

          </div>

        </section>


        {/* ====================================================
            RIGHT REGISTER CARD
        ==================================================== */}

        <section className="public-auth-card">


          {/* LABEL */}

          <span className="public-auth-label">
            CREATE ACCOUNT
          </span>


          {/* TITLE */}

          <h2>
            Get Started
          </h2>


          {/* DESCRIPTION */}

          <p>
            Create your SafeTalkAI user account.
          </p>


          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="public-auth-form"
          >


            {/* =================================================
                NAME
            ================================================= */}

            <label
              htmlFor="register-name"
            >
              Full Name
            </label>


            <div className="public-auth-input">

              <UserRound
                size={18}
              />


              <input
                id="register-name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                autoComplete="name"
                disabled={
                  loading
                }
                required
              />

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <label
              htmlFor="register-email"
            >
              Email Address
            </label>


            <div className="public-auth-input">

              <Mail
                size={18}
              />


              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                autoComplete="email"
                disabled={
                  loading
                }
                required
              />

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <label
              htmlFor="register-password"
            >
              Password
            </label>


            <div className="public-auth-input">

              <LockKeyhole
                size={18}
              />


              <input
                id="register-password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Minimum 8 characters"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                autoComplete="new-password"
                disabled={
                  loading
                }
                required
              />


              <button
                type="button"
                className="public-auth-password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                disabled={
                  loading
                }
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


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="public-auth-error">

                {error}

              </div>

            )}


            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="public-auth-submit"
              disabled={
                loading
              }
            >

              {loading ? (

                <>

                  <LoaderCircle
                    size={18}
                    className="analysis-spinner"
                  />

                  Creating Account...

                </>

              ) : (

                <>

                  Create Account

                  <ArrowRight
                    size={18}
                  />

                </>

              )}

            </button>

          </form>


          {/* ==================================================
              LOGIN
          ================================================== */}

          <div className="public-auth-switch">

            Already have an account?

            <Link href="/login">

              Login

            </Link>

          </div>

        </section>

      </div>

    </main>

  );
}