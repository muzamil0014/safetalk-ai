"use client";

// ============================================================
// SAFETALK AI
// SETTINGS PAGE
// REAL MONGODB SETTINGS
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Settings,
  Save,
  Shield,
  Bell,
  Languages,
  Gauge,
  UserRound,
  LoaderCircle,
} from "lucide-react";


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const defaultSettings = {

  appName:
    "SafeTalkAI",

  defaultLanguage:
    "auto",

  notifications:
    true,

  criticalAlerts:
    true,

  highRiskThreshold:
    70,

  criticalRiskThreshold:
    85,

};


// ============================================================
// MAIN PAGE
// ============================================================

export default function SettingsPage() {

  // ==========================================================
  // STATES
  // ==========================================================

  const [settings, setSettings] =
    useState(
      defaultSettings
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD SETTINGS
  // ==========================================================

  useEffect(() => {

    const loadSettings =
      async () => {

        setLoading(true);

        setError("");


        try {

          const response =
            await fetch(
              "/api/admin/settings",
              {
                cache:
                  "no-store",
              }
            );


          const data =
            await response.json();


          if (!response.ok) {

            setError(
              data.message ||
              "Unable to load settings."
            );

            return;

          }


          if (
            data.settings
          ) {

            setSettings({

              appName:
                data.settings.appName ??
                defaultSettings.appName,

              defaultLanguage:
                data.settings.defaultLanguage ??
                defaultSettings.defaultLanguage,

              notifications:
                data.settings.notifications ??
                defaultSettings.notifications,

              criticalAlerts:
                data.settings.criticalAlerts ??
                defaultSettings.criticalAlerts,

              highRiskThreshold:
                data.settings.highRiskThreshold ??
                defaultSettings.highRiskThreshold,

              criticalRiskThreshold:
                data.settings.criticalRiskThreshold ??
                defaultSettings.criticalRiskThreshold,

            });

          }

        } catch (error) {

          console.error(
            "LOAD SETTINGS ERROR:",
            error
          );


          setError(
            "Unable to connect to server."
          );

        } finally {

          setLoading(false);

        }

      };


    loadSettings();

  }, []);


  // ==========================================================
  // UPDATE FIELD
  // ==========================================================

  const updateSetting =
    (key, value) => {

      setSettings(
        (previous) => ({

          ...previous,

          [key]:
            value,

        })
      );


      setMessage("");

      setError("");

    };


  // ==========================================================
  // SAVE SETTINGS
  // ==========================================================

  const handleSave =
    async () => {

      setSaving(true);

      setMessage("");

      setError("");


      try {

        const response =
          await fetch(
            "/api/admin/settings",
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  settings
                ),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
            "Unable to save settings."
          );

          return;

        }


        setSettings({

          appName:
            data.settings.appName,

          defaultLanguage:
            data.settings.defaultLanguage,

          notifications:
            data.settings.notifications,

          criticalAlerts:
            data.settings.criticalAlerts,

          highRiskThreshold:
            data.settings.highRiskThreshold,

          criticalRiskThreshold:
            data.settings.criticalRiskThreshold,

        });


        setMessage(
          "Settings saved successfully."
        );

      } catch (error) {

        console.error(
          "SAVE SETTINGS ERROR:",
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

        Loading settings...

      </div>

    );

  }


  return (

    <div className="admin-module-page">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="module-page-header">

        <div className="module-page-title">

          <div className="module-title-icon">

            <Settings size={22} />

          </div>


          <div>

            <h1>
              Settings
            </h1>

            <p>
              Configure SafeTalkAI system
              preferences and risk thresholds.
            </p>

          </div>

        </div>


        <button
          type="button"
          className="module-primary-button"
          onClick={handleSave}
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
            : "Save Changes"}

        </button>

      </div>


      {/* ======================================================
          MESSAGES
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
              "#fff1f3",
            borderColor:
              "#ffd4dc",
            marginBottom:
              "15px",
          }}
        >

          {error}

        </div>

      )}


      {/* ======================================================
          SETTINGS LAYOUT
      ====================================================== */}

      <div className="settings-layout">


        {/* ====================================================
            GENERAL
        ==================================================== */}

        <section className="settings-card">

          <div className="settings-card-title">

            <Settings size={20} />

            <div>

              <h2>
                General
              </h2>

              <p>
                Basic application preferences.
              </p>

            </div>

          </div>


          <div className="settings-form-grid">

            <div className="settings-field">

              <label>
                Application Name
              </label>


              <input
                type="text"
                value={
                  settings.appName
                }
                onChange={(event) =>
                  updateSetting(
                    "appName",
                    event.target.value
                  )
                }
              />

            </div>


            <div className="settings-field">

              <label>
                Default Language
              </label>


              <select
                value={
                  settings.defaultLanguage
                }
                onChange={(event) =>
                  updateSetting(
                    "defaultLanguage",
                    event.target.value
                  )
                }
              >

                <option value="auto">
                  Auto Detect
                </option>

                <option value="english">
                  English
                </option>

                <option value="urdu">
                  Urdu
                </option>

                <option value="roman-urdu">
                  Roman Urdu
                </option>

              </select>

            </div>

          </div>

        </section>


        {/* ====================================================
            RISK THRESHOLDS
        ==================================================== */}

        <section className="settings-card">

          <div className="settings-card-title">

            <Gauge size={20} />

            <div>

              <h2>
                Risk Thresholds
              </h2>

              <p>
                Configure system risk boundaries.
              </p>

            </div>

          </div>


          <div className="settings-form-grid">

            <div className="settings-field">

              <label>
                High Risk Threshold
              </label>


              <input
                type="number"
                min="0"
                max="100"
                value={
                  settings.highRiskThreshold
                }
                onChange={(event) =>
                  updateSetting(
                    "highRiskThreshold",
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </div>


            <div className="settings-field">

              <label>
                Critical Risk Threshold
              </label>


              <input
                type="number"
                min="0"
                max="100"
                value={
                  settings.criticalRiskThreshold
                }
                onChange={(event) =>
                  updateSetting(
                    "criticalRiskThreshold",
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </div>

          </div>

        </section>


        {/* ====================================================
            NOTIFICATIONS
        ==================================================== */}

        <section className="settings-card">

          <div className="settings-card-title">

            <Bell size={20} />

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Configure system alert behavior.
              </p>

            </div>

          </div>


          <div className="settings-toggle-row">

            <div>

              <strong>
                System Notifications
              </strong>

              <span>
                Enable SafeTalkAI notifications.
              </span>

            </div>


            <button
              type="button"
              className={`settings-toggle ${
                settings.notifications
                  ? "enabled"
                  : ""
              }`}
              onClick={() =>
                updateSetting(
                  "notifications",
                  !settings.notifications
                )
              }
            >

              <span></span>

            </button>

          </div>


          <div className="settings-toggle-row">

            <div>

              <strong>
                Critical Risk Alerts
              </strong>

              <span>
                Generate alerts for critical
                analysis results.
              </span>

            </div>


            <button
              type="button"
              className={`settings-toggle ${
                settings.criticalAlerts
                  ? "enabled"
                  : ""
              }`}
              onClick={() =>
                updateSetting(
                  "criticalAlerts",
                  !settings.criticalAlerts
                )
              }
            >

              <span></span>

            </button>

          </div>

        </section>


        {/* ====================================================
            FUTURE MODULES
        ==================================================== */}

        <section className="settings-card settings-small-cards">

          <div className="settings-mini-item">

            <Shield size={19} />

            <div>

              <strong>
                Security
              </strong>

              <span>
                Authentication and security
                controls.
              </span>

            </div>

          </div>


          <div className="settings-mini-item">

            <Languages size={19} />

            <div>

              <strong>
                Languages
              </strong>

              <span>
                English, Urdu and Roman Urdu.
              </span>

            </div>

          </div>


          <div className="settings-mini-item">

            <UserRound size={19} />

            <div>

              <strong>
                Admin Profile
              </strong>

              <span>
                Profile managed separately.
              </span>

            </div>

          </div>

        </section>

      </div>

    </div>

  );
}