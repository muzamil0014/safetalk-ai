"use client";

// ============================================================
// SAFETALK AI
// MODEL MANAGEMENT
// REAL FASTAPI AI CONNECTION
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  BrainCircuit,
  Activity,
  ShieldAlert,
  Skull,
  MessageCircleWarning,
  Languages,
  CheckCircle2,
  Database,
  Server,
  LoaderCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";


// ============================================================
// FASTAPI
// ============================================================

const AI_API_URL =
  process.env
    .NEXT_PUBLIC_AI_API_URL ||
  "http://127.0.0.1:8000";


// ============================================================
// MODEL ICONS
// ============================================================

const modelIcons = {

  sentiment:
    Activity,

  threat:
    ShieldAlert,

  toxicity:
    Skull,

  "hate-speech":
    MessageCircleWarning,

  language:
    Languages,

};


// ============================================================
// MAIN PAGE
// ============================================================

export default function ModelManagementPage() {


  // ==========================================================
  // STATES
  // ==========================================================

  const [models, setModels] =
    useState([]);

  const [summary, setSummary] =
    useState({

      total_models:
        0,

      trained_models:
        0,

      active_models:
        0,

      unavailable_models:
        0,

      base_model:
        "XLM-RoBERTa",

    });

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD MODEL STATUS
  // ==========================================================

  const loadModels =
    async (
      isRefresh = false
    ) => {

      if (isRefresh) {

        setRefreshing(
          true
        );

      } else {

        setLoading(
          true
        );

      }


      setError("");


      try {

        const response =
          await fetch(
            `${AI_API_URL}/models/status`,
            {
              method:
                "GET",

              cache:
                "no-store",
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data?.detail ||
            "Unable to load AI model status."
          );

        }


        setModels(
          data.models ||
          []
        );


        setSummary(
          data.summary || {

            total_models:
              0,

            trained_models:
              0,

            active_models:
              0,

            unavailable_models:
              0,

            base_model:
              "XLM-RoBERTa",

          }
        );


      } catch (error) {

        console.error(
          "MODEL STATUS ERROR:",
          error
        );


        setError(
          "Unable to connect to SafeTalkAI FastAPI backend."
        );


      } finally {

        setLoading(
          false
        );

        setRefreshing(
          false
        );

      }

    };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadModels();

  }, []);


  // ==========================================================
  // FORMAT PERCENTAGE
  // ==========================================================

  const percentage =
    (value) => {

      if (
        value === null ||
        value === undefined
      ) {

        return "Not Available";

      }


      const number =
        Number(
          value
        );


      if (
        Number.isNaN(
          number
        )
      ) {

        return "Not Available";

      }


      return `${number.toFixed(
        2
      )}%`;

    };


  // ==========================================================
  // MAIN MODEL METRICS
  // ==========================================================

  const getModelMetrics =
    (model) => {


      // ======================================================
      // SENTIMENT
      // ======================================================

      if (
        model.id ===
        "sentiment"
      ) {

        return {

          firstLabel:
            "Accuracy",

          firstValue:
            percentage(
              model.accuracy
            ),

          secondLabel:
            "Macro F1",

          secondValue:
            percentage(
              model.macro_f1 ??
              model.f1
            ),

        };

      }


      // ======================================================
      // THREAT
      // ======================================================

      if (
        model.id ===
        "threat"
      ) {

        return {

          firstLabel:
            "Micro F1",

          firstValue:
            percentage(
              model.micro_f1 ??
              model.f1
            ),

          secondLabel:
            "Macro F1",

          secondValue:
            percentage(
              model.macro_f1
            ),

        };

      }


      // ======================================================
      // TOXICITY
      // ======================================================

      if (
        model.id ===
        "toxicity"
      ) {

        return {

          firstLabel:
            "Accuracy",

          firstValue:
            percentage(
              model.accuracy
            ),

          secondLabel:
            "Macro F1",

          secondValue:
            percentage(
              model.macro_f1 ??
              model.f1
            ),

        };

      }


      // ======================================================
      // HATE SPEECH
      // ======================================================

      if (
        model.id ===
        "hate-speech"
      ) {

        return {

          firstLabel:
            "Accuracy",

          firstValue:
            percentage(
              model.accuracy
            ),

          secondLabel:
            "Macro F1",

          secondValue:
            percentage(
              model.macro_f1 ??
              model.f1
            ),

        };

      }


      // ======================================================
      // LANGUAGE DETECTION
      // ======================================================

      if (
        model.id ===
        "language"
      ) {

        return {

          firstLabel:
            "Method",

          firstValue:
            "Rule-Based",

          secondLabel:
            "Model Training",

          secondValue:
            "Not Required",

        };

      }


      // ======================================================
      // FALLBACK
      // ======================================================

      return {

        firstLabel:
          "Accuracy",

        firstValue:
          "Not Available",

        secondLabel:
          "F1 Score",

        secondValue:
          "Not Available",

      };

    };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="admin-module-page">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="module-page-header">

        <div className="module-page-title">

          <div className="module-title-icon">

            <BrainCircuit
              size={22}
            />

          </div>


          <div>

            <h1>
              Model Management
            </h1>


            <p>
              Monitor trained SafeTalkAI models,
              performance metrics and backend status.
            </p>

          </div>

        </div>


        {/* ====================================================
            REFRESH
        ==================================================== */}

        <button
          type="button"
          className="module-primary-button"
          onClick={() =>
            loadModels(
              true
            )
          }
          disabled={
            refreshing
          }
        >

          {refreshing ? (

            <LoaderCircle
              size={17}
              className="analysis-spinner"
            />

          ) : (

            <RefreshCw
              size={17}
            />

          )}


          {refreshing
            ? "Checking..."
            : "Refresh Models"}

        </button>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="profile-message">

          <XCircle
            size={18}
          />

          {error}

        </div>

      )}


      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading ? (

        <div className="profile-loading">

          <LoaderCircle
            size={26}
            className="analysis-spinner"
          />

          Checking AI models...

        </div>

      ) : (

        <>


          {/* ==================================================
              SUMMARY
          ================================================== */}

          <section className="model-summary-grid">


            {/* TOTAL */}

            <div className="model-summary-card">

              <BrainCircuit
                size={22}
              />

              <div>

                <span>
                  Total Components
                </span>

                <strong>
                  {summary.total_models}
                </strong>

              </div>

            </div>


            {/* TRAINED */}

            <div className="model-summary-card">

              <Database
                size={22}
              />

              <div>

                <span>
                  Trained Models
                </span>

                <strong>
                  {summary.trained_models}
                </strong>

              </div>

            </div>


            {/* ACTIVE */}

            <div className="model-summary-card">

              <CheckCircle2
                size={22}
              />

              <div>

                <span>
                  Active Components
                </span>

                <strong>
                  {summary.active_models}
                </strong>

              </div>

            </div>


            {/* BASE MODEL */}

            <div className="model-summary-card">

              <Server
                size={22}
              />

              <div>

                <span>
                  Base Model
                </span>

                <strong className="small-value">

                  {summary.base_model ||
                    "XLM-RoBERTa"}

                </strong>

              </div>

            </div>

          </section>


          {/* ==================================================
              MODEL CARDS
          ================================================== */}

          <section className="model-card-grid">

            {models.map(
              (model) => {

                const Icon =
                  modelIcons[
                    model.id
                  ] ||
                  BrainCircuit;


                const active =
                  model.status ===
                  "Active";


                const metrics =
                  getModelMetrics(
                    model
                  );


                return (

                  <div
                    key={model.id}
                    className="model-management-card"
                  >


                    {/* =================================================
                        TOP
                    ================================================= */}

                    <div className="model-management-top">

                      <div className="model-management-icon">

                        <Icon
                          size={24}
                        />

                      </div>


                      <span
                        className={
                          active
                            ? "model-status active"
                            : "model-status planned"
                        }
                      >

                        {active
                          ? "Active"
                          : "Unavailable"}

                      </span>

                    </div>


                    {/* =================================================
                        NAME
                    ================================================= */}

                    <h3>
                      {model.name}
                    </h3>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <p>
                      {model.description}
                    </p>


                    {/* =================================================
                        TASK
                    ================================================= */}

                    <div className="model-version">

                      <span>
                        Task
                      </span>

                      <strong>

                        {model.task ||
                          "Not Available"}

                      </strong>

                    </div>


                    {/* =================================================
                        MAIN METRICS
                    ================================================= */}

                    <div className="model-metrics">


                      {/* FIRST METRIC */}

                      <div>

                        <span>
                          {metrics.firstLabel}
                        </span>

                        <strong>
                          {metrics.firstValue}
                        </strong>

                      </div>


                      {/* SECOND METRIC */}

                      <div>

                        <span>
                          {metrics.secondLabel}
                        </span>

                        <strong>
                          {metrics.secondValue}
                        </strong>

                      </div>

                    </div>


                    {/* =================================================
                        TOXICITY EXTRA METRICS
                    ================================================= */}

                    {model.id ===
                      "toxicity" && (

                      <>

                        <div className="model-version">

                          <span>
                            Macro Precision
                          </span>

                          <strong>

                            {percentage(
                              model.precision_macro
                            )}

                          </strong>

                        </div>


                        <div className="model-version">

                          <span>
                            Macro Recall
                          </span>

                          <strong>

                            {percentage(
                              model.recall_macro
                            )}

                          </strong>

                        </div>


                        <div className="model-version">

                          <span>
                            Weighted F1
                          </span>

                          <strong>

                            {percentage(
                              model.weighted_f1
                            )}

                          </strong>

                        </div>

                      </>

                    )}


                    {/* =================================================
                        HATE SPEECH EXTRA METRICS
                    ================================================= */}

                    {model.id ===
                      "hate-speech" && (

                      <>

                        <div className="model-version">

                          <span>
                            Macro Precision
                          </span>

                          <strong>

                            {percentage(
                              model.precision_macro
                            )}

                          </strong>

                        </div>


                        <div className="model-version">

                          <span>
                            Macro Recall
                          </span>

                          <strong>

                            {percentage(
                              model.recall_macro
                            )}

                          </strong>

                        </div>


                        <div className="model-version">

                          <span>
                            Weighted F1
                          </span>

                          <strong>

                            {percentage(
                              model.weighted_f1
                            )}

                          </strong>

                        </div>

                      </>

                    )}


                    {/* =================================================
                        THREAT LABELS
                    ================================================= */}

                    {model.id ===
                      "threat" && (

                      <div className="model-version">

                        <span>
                          Threat Labels
                        </span>

                        <strong>

                          {model.labels ||
                            8}

                        </strong>

                      </div>

                    )}


                    {/* =================================================
                        BASE MODEL
                    ================================================= */}

                    <div className="model-version">

                      <span>

                        {model.id ===
                        "language"
                          ? "Detection Method"
                          : "Base Model"}

                      </span>

                      <strong>

                        {model.base_model ||
                          "Not Available"}

                      </strong>

                    </div>


                    {/* =================================================
                        VERSION
                    ================================================= */}

                    <div className="model-version">

                      <span>
                        Version
                      </span>

                      <strong>

                        {model.version ||
                          "v1.0"}

                      </strong>

                    </div>


                    {/* =================================================
                        LANGUAGES
                    ================================================= */}

                    <div className="model-version">

                      <span>
                        Languages
                      </span>

                      <strong>

                        {Array.isArray(
                          model.languages
                        )
                          ? model.languages.join(
                              ", "
                            )
                          : "Not Available"}

                      </strong>

                    </div>


                    {/* =================================================
                        BACKEND
                    ================================================= */}

                    <div className="model-version">

                      <span>
                        Backend
                      </span>

                      <strong>

                        {model.loaded
                          ? "Available"
                          : "Not Available"}

                      </strong>

                    </div>


                  </div>

                );

              }
            )}

          </section>

        </>

      )}

    </div>

  );
}