"use client";

// ============================================================
// SAFETALK AI
// PUBLIC USER PROFILE
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  UserRound,
  Mail,
  Phone,
  Building2,
  Save,
  LoaderCircle,
  ArrowLeft,
  History,
  ShieldCheck,
} from "lucide-react";

import PublicNavbar
  from "@/components/public/PublicNavbar";


// ============================================================
// MAIN PAGE
// ============================================================

export default function ProfilePage() {

  const router =
    useRouter();


  const [user, setUser] =
    useState(null);

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      department: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  useEffect(() => {

    const loadProfile =
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


          const data =
            await response.json();


          if (!response.ok) {

            router.push(
              "/login"
            );

            return;
          }


          if (
            data.user?.role !==
            "User"
          ) {

            router.push(
              "/"
            );

            return;
          }


          setUser(
            data.user
          );


          setForm({

            name:
              data.user.name ||
              "",

            phone:
              data.user.phone ||
              "",

            department:
              data.user.department ||
              "",

          });

        } catch {

          setError(
            "Unable to load profile."
          );

        } finally {

          setLoading(false);

        }

      };


    loadProfile();

  }, [router]);


  // ==========================================================
  // CHANGE
  // ==========================================================

  const handleChange =
    (event) => {

      setForm({

        ...form,

        [event.target.name]:
          event.target.value,

      });

    };


  // ==========================================================
  // SAVE
  // ==========================================================

  const saveProfile =
    async () => {

      if (
        !form.name.trim()
      ) {

        setError(
          "Name is required."
        );

        return;
      }


      setSaving(true);

      setMessage("");

      setError("");


      try {

        const response =
          await fetch(
            "/api/auth/me",
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  form
                ),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
            "Unable to update profile."
          );

          return;
        }


        setUser(
          data.user
        );


        setMessage(
          "Profile updated successfully."
        );

      } catch {

        setError(
          "Unable to connect to server."
        );

      } finally {

        setSaving(false);

      }

    };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <main className="public-account-page">

        <PublicNavbar />


        <div className="public-account-loading">

          <LoaderCircle
            className="analysis-spinner"
            size={28}
          />

          Loading profile...

        </div>

      </main>

    );

  }


  const initial =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";


  return (

    <main className="public-account-page">

      <PublicNavbar />


      <div className="public-account-container">


        {/* ====================================================
            TOP
        ==================================================== */}

        <div className="public-account-top">

          <Link href="/">

            <ArrowLeft size={17} />

            Back to SafeTalkAI

          </Link>


          <Link
            href="/history"
            className="public-history-button"
          >

            <History size={17} />

            Analysis History

          </Link>

        </div>


        {/* ====================================================
            HEADING
        ==================================================== */}

        <div className="public-account-heading">

          <span>
            USER ACCOUNT
          </span>


          <h1>
            My Profile
          </h1>


          <p>
            Manage your SafeTalkAI account
            information.
          </p>

        </div>


        <div className="public-profile-grid">


          {/* ==================================================
              SUMMARY
          ================================================== */}

          <section className="public-profile-summary">

            <div className="public-profile-avatar-large">

              {initial}

            </div>


            <h2>
              {user?.name}
            </h2>


            <p>
              {user?.email}
            </p>


            <div className="public-profile-role">

              <ShieldCheck size={15} />

              User

            </div>


            <div className="public-profile-active">

              <span></span>

              {user?.status ||
                "Active"}

            </div>

          </section>


          {/* ==================================================
              INFORMATION
          ================================================== */}

          <section className="public-profile-form-card">

            <h2>
              Personal Information
            </h2>


            <p>
              Update your account information.
            </p>


            {message && (

              <div className="public-profile-message success">

                {message}

              </div>

            )}


            {error && (

              <div className="public-profile-message error">

                {error}

              </div>

            )}


            <div className="public-profile-form">


              {/* NAME */}

              <label>

                <UserRound size={15} />

                Full Name

              </label>


              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />


              {/* EMAIL */}

              <label>

                <Mail size={15} />

                Email Address

              </label>


              <input
                type="email"
                value={
                  user?.email ||
                  ""
                }
                disabled
              />


              {/* PHONE */}

              <label>

                <Phone size={15} />

                Phone Number

              </label>


              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
              />


              {/* DEPARTMENT */}

              <label>

                <Building2 size={15} />

                Department

              </label>


              <input
                type="text"
                name="department"
                placeholder="Enter department"
                value={
                  form.department
                }
                onChange={handleChange}
              />


              {/* SAVE */}

              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
              >

                {saving ? (

                  <LoaderCircle
                    size={17}
                    className="analysis-spinner"
                  />

                ) : (

                  <Save size={17} />

                )}


                {saving
                  ? "Saving..."
                  : "Save Profile"}

              </button>

            </div>

          </section>

        </div>

      </div>

    </main>

  );
}