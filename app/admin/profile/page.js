"use client";

// ============================================================
// SAFETALK AI
// ADMIN PROFILE PAGE
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  UserRound,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  CalendarDays,
  Clock3,
  Pencil,
  Save,
  X,
  LoaderCircle,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AdminProfilePage() {

  // ==========================================================
  // ROUTER
  // ==========================================================

  const router =
    useRouter();


  // ==========================================================
  // STATES
  // ==========================================================

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================================
  // FORM DATA
  // ==========================================================

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      department: "",
    });


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


          // ==================================================
          // NOT LOGGED IN
          // ==================================================

          if (!response.ok) {

            router.push(
              "/admin/login"
            );

            return;
          }


          if (
            data.success &&
            data.user
          ) {

            setUser(
              data.user
            );


            setFormData({

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

          }

        } catch (error) {

          console.error(
            "PROFILE LOAD ERROR:",
            error
          );


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
  // HANDLE INPUT
  // ==========================================================

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } =
        event.target;


      setFormData(
        (previous) => ({

          ...previous,

          [name]:
            value,

        })
      );

    };


  // ==========================================================
  // CANCEL EDIT
  // ==========================================================

  const handleCancel = () => {

    setEditing(false);

    setMessage("");

    setError("");


    setFormData({

      name:
        user?.name ||
        "",

      phone:
        user?.phone ||
        "",

      department:
        user?.department ||
        "",

    });

  };


  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSave =
    async () => {

      if (
        !formData.name.trim()
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
                  formData
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


        setEditing(false);


        setMessage(
          "Profile updated successfully."
        );


        router.refresh();

      } catch (error) {

        console.error(
          "PROFILE UPDATE ERROR:",
          error
        );


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

      <div className="profile-loading">

        <LoaderCircle
          size={28}
          className="analysis-spinner"
        />

        Loading profile...

      </div>

    );

  }


  // ==========================================================
  // USER INITIAL
  // ==========================================================

  const userInitial =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() ||
    "A";


  return (

    <div className="admin-profile-page">


      {/* ======================================================
          PAGE HEADER
          LOGOUT REMOVED FROM HERE
      ====================================================== */}

      <div className="profile-page-header">

        <div className="profile-page-heading">

          <div className="profile-page-heading-icon">

            <UserRound size={27} />

          </div>


          <div>

            <h1>
              Admin Profile
            </h1>

            <p>
              Manage your account information
              and administrator profile.
            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          MESSAGE
      ====================================================== */}

      {message && (

        <div className="profile-message">

          {message}

        </div>

      )}


      {error && (

        <div
          className="profile-message"
          style={{
            color:
              "#d9304f",

            background:
              "#fff2f4",

            borderColor:
              "#ffd3da",
          }}
        >

          {error}

        </div>

      )}


      {/* ======================================================
          PROFILE CONTENT
      ====================================================== */}

      <div className="profile-content-grid">


        {/* ====================================================
            LEFT PROFILE CARD
        ==================================================== */}

        <section className="profile-summary-card">

          <div className="profile-large-avatar">

            {userInitial}

          </div>


          <h2>

            {user?.name ||
              "Admin User"}

          </h2>


          <p className="profile-email">

            {user?.email ||
              "admin@safetalk.ai"}

          </p>


          <div className="profile-role">

            <ShieldCheck size={15} />

            {user?.role ||
              "Admin"}

          </div>


          <div className="profile-status">

            <span></span>

            {user?.status ||
              "Active"}

          </div>

        </section>


        {/* ====================================================
            RIGHT INFORMATION CARD
        ==================================================== */}

        <section className="profile-details-card">


          {/* HEADER */}

          <div className="profile-details-header">

            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Your SafeTalkAI administrator
                account details.
              </p>

            </div>


            {!editing ? (

              <button
                type="button"
                className="profile-edit-button"
                onClick={() =>
                  setEditing(true)
                }
              >

                <Pencil size={16} />

                Edit Profile

              </button>

            ) : (

              <div className="profile-edit-actions">

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={
                    handleCancel
                  }
                  disabled={saving}
                >

                  <X size={16} />

                  Cancel

                </button>


                <button
                  type="button"
                  className="profile-save-button"
                  onClick={
                    handleSave
                  }
                  disabled={saving}
                >

                  {saving ? (

                    <LoaderCircle
                      size={16}
                      className="analysis-spinner"
                    />

                  ) : (

                    <Save size={16} />

                  )}

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            )}

          </div>


          {/* ==================================================
              INFORMATION
          ================================================== */}

          <div className="profile-fields-grid">


            {/* NAME */}

            <div className="profile-field">

              <label>

                <UserRound size={16} />

                Full Name

              </label>


              {editing ? (

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                />

              ) : (

                <div className="profile-field-value">

                  {user?.name ||
                    "--"}

                </div>

              )}

            </div>


            {/* EMAIL */}

            <div className="profile-field">

              <label>

                <Mail size={16} />

                Email Address

              </label>


              <div className="profile-field-value">

                {user?.email ||
                  "--"}

              </div>

            </div>


            {/* PHONE */}

            <div className="profile-field">

              <label>

                <Phone size={16} />

                Phone Number

              </label>


              {editing ? (

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                />

              ) : (

                <div className="profile-field-value">

                  {user?.phone ||
                    "Not added"}

                </div>

              )}

            </div>


            {/* DEPARTMENT */}

            <div className="profile-field">

              <label>

                <Building2 size={16} />

                Department

              </label>


              {editing ? (

                <input
                  type="text"
                  name="department"
                  placeholder="Administration"
                  value={
                    formData.department
                  }
                  onChange={
                    handleChange
                  }
                />

              ) : (

                <div className="profile-field-value">

                  {user?.department ||
                    "Administration"}

                </div>

              )}

            </div>

          </div>


          {/* ==================================================
              ACCOUNT INFORMATION
          ================================================== */}

          <div className="profile-account-info">


            <div>

              <CalendarDays size={18} />

              <div>

                <span>
                  Member Since
                </span>

                <strong>

                  {user?.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : "--"}

                </strong>

              </div>

            </div>


            <div>

              <Clock3 size={18} />

              <div>

                <span>
                  Last Login
                </span>

                <strong>

                  {user?.lastLogin
                    ? new Date(
                        user.lastLogin
                      ).toLocaleString()
                    : "Current Session"}

                </strong>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>

  );
}