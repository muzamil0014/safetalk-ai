"use client";

// ============================================================
// SAFETALK AI
// PUBLIC + ADMIN TEXT ANALYSIS
// REAL FASTAPI INTEGRATION
// ============================================================

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ScanText,
  Languages,
  Sparkles,
  LoaderCircle,
  ShieldCheck,
  LockKeyhole,
  TriangleAlert,
  BrainCircuit,
  SearchCheck,
} from "lucide-react";


// ============================================================
// THREAT LABELS
// ============================================================

const LABEL_NAMES = {
  physical_threat:
    "Physical Threat",

  death_threat:
    "Death Threat",

  harassment:
    "Harassment",

  abusive_language:
    "Abusive Language",

  cyber_threat:
    "Cyber Threat",

  hate_speech:
    "Hate Speech",

  sexual_threat:
    "Sexual Threat",

  self_harm:
    "Self-Harm Related",
};


// ============================================================
// SAFE PERCENT
// ============================================================

function safePercent(value) {

  const number =
    Number(value) || 0;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(number)
    )
  );
}


// ============================================================
// SCORE BAR
// ============================================================

function ScoreBar({
  value,
  variant = "default",
}) {

  const safeValue =
    safePercent(value);

  return (

    <div className="public-result-progress">

      <div
        className={
          variant === "danger"
            ? "public-result-progress-fill danger"
            : "public-result-progress-fill"
        }
        style={{
          width:
            `${safeValue}%`,
        }}
      />

    </div>
  );
}


// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  type,
  icon,
  title,
  value,
  confidence,
  description,
}) {

  return (

    <div
      className={
        `public-result-card ${type}`
      }
    >

      <div className="public-result-card-top">

        <div className="public-result-card-icon">
          {icon}
        </div>

        <span>
          {title}
        </span>

      </div>


      <strong className="public-result-card-value">

        {value}

      </strong>


      {description && (

        <p>
          {description}
        </p>

      )}


      <div className="public-result-confidence-area">

        <div>

          <span>
            Confidence
          </span>

          <strong>
            {safePercent(
              confidence
            )}%
          </strong>

        </div>

        <ScoreBar
          value={
            confidence
          }
        />

      </div>

    </div>
  );
}


// ============================================================
// PRIMARY THREAT CONFIDENCE
// ============================================================

function getPrimaryConfidence(
  result
) {

  if (
    !result?.primary_threat ||
    !result?.scores
  ) {
    return 0;
  }


  const entry =
    Object.entries(
      LABEL_NAMES
    ).find(
      ([, label]) =>
        label ===
        result.primary_threat
    );


  if (!entry) {
    return 0;
  }


  const key =
    entry[0];


  return safePercent(
    result
      ?.scores
      ?.[key]
      ?.percentage ||
    0
  );
}


// ============================================================
// THREAT CATEGORIES
// ============================================================

function getThreatCategories(
  result
) {

  if (
    !result?.scores ||
    typeof result.scores !==
      "object"
  ) {

    return [];
  }


  return Object.entries(
    result.scores
  )
    .filter(
      ([, score]) =>
        Number(
          score?.prediction
        ) === 1
    )

    .map(
      ([key, score]) => ({

        key,

        label:
          LABEL_NAMES[key] ||
          key,

        confidence:
          safePercent(
            score?.percentage
          ),

      })
    )

    .sort(
      (a, b) =>
        b.confidence -
        a.confidence
    );
}


// ============================================================
// RESULT COMPONENT
// ============================================================

function PublicResult({
  result,
  originalText,
}) {

  if (!result) {
    return null;
  }


  // ==========================================================
  // SENTIMENT
  // ==========================================================

  const sentiment = {

    label:
      result
        ?.sentiment
        ?.label ||
      "Neutral",

    confidence:
      safePercent(
        result
          ?.sentiment
          ?.confidence
      ),

  };


  // ==========================================================
  // TOXICITY
  // ==========================================================

  const toxicity = {

    label:
      result
        ?.toxicity
        ?.label ||
      "Non-Toxic",

    confidence:
      safePercent(
        result
          ?.toxicity
          ?.confidence
      ),

    isToxic:
      Number(
        result
          ?.toxicity
          ?.is_toxic ||
        0
      ),

  };


  // ==========================================================
  // HATE SPEECH
  // ==========================================================

  const hateSpeech = {

    label:
      result
        ?.hate_speech
        ?.label ||
      "Non-Hate",

    confidence:
      safePercent(
        result
          ?.hate_speech
          ?.confidence
      ),

    isHateSpeech:
      Number(
        result
          ?.hate_speech
          ?.is_hate_speech ||
        0
      ),

  };


  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const language = {

    label:
      result
        ?.language
        ?.label ||
      "Unknown",

    confidence:
      safePercent(
        result
          ?.language
          ?.confidence
      ),

  };


  // ==========================================================
  // RISK
  // ==========================================================

  const risk = {

    score:
      safePercent(
        result
          ?.risk
          ?.score
      ),

    level:
      result
        ?.risk
        ?.level ||
      "Low",

  };


  // ==========================================================
  // EXPLAINABLE AI
  // ==========================================================

  const importantPhrases =
    Array.isArray(
      result
        ?.explainability
        ?.important_phrases
    )
      ? result
          .explainability
          .important_phrases
      : [];


  const reasons =
    Array.isArray(
      result
        ?.explainability
        ?.reasons
    )
      ? result
          .explainability
          .reasons
      : [];


  const explanationMethod =
    result
      ?.explainability
      ?.method ||
    "Model outputs and semantic evidence.";


  const explanationSummary =
    result
      ?.explainability
      ?.summary ||
    `SafeTalkAI detected ${
      result?.primary_threat ||
      "No Threat"
    } with a ${
      risk.level
    } risk level.`;


  // ==========================================================
  // THREAT
  // ==========================================================

  const primaryConfidence =
    getPrimaryConfidence(
      result
    );


  const categories =
    getThreatCategories(
      result
    );


  const highestConfidence =
    categories.length > 0
      ? categories[0]
          .confidence
      : 0;


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="public-result-wrapper">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="public-result-header">

        <div className="public-result-header-left">

          <div className="public-result-header-icon">

            <Sparkles
              size={25}
            />

          </div>


          <div>

            <span className="public-result-kicker">
              AI RESULT
            </span>

            <h2>
              Analysis Result
            </h2>

            <p>
              Complete SafeTalkAI multilingual content analysis.
            </p>

          </div>

        </div>


        <div className="public-result-language-badge">

          <Languages
            size={17}
          />

          <div>

            <span>
              Detected Language
            </span>

            <strong>
              {language.label}
            </strong>

          </div>

        </div>

      </div>


      {/* ======================================================
          SUBMITTED TEXT
      ====================================================== */}

      <div className="public-result-original">

        <span>
          SUBMITTED TEXT
        </span>

        <p>
          “{originalText}”
        </p>

      </div>


      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="public-result-grid">


        <SummaryCard
          type="sentiment"
          icon={
            <Sparkles
              size={19}
            />
          }
          title="Sentiment"
          value={
            sentiment.label
          }
          confidence={
            sentiment.confidence
          }
          description="Multilingual sentiment model"
        />


        <SummaryCard
          type="threat"
          icon={
            result?.is_threat ===
            1
              ? (
                <TriangleAlert
                  size={19}
                />
              )
              : (
                <ShieldCheck
                  size={19}
                />
              )
          }
          title="Threat Status"
          value={
            result
              ?.primary_threat &&
            result.primary_threat !==
              "No Threat"
              ? result
                  .primary_threat
              : "No Direct Threat"
          }
          confidence={
            primaryConfidence
          }
          description="Multi-label threat model"
        />


        <SummaryCard
          type="toxicity"
          icon={
            toxicity.isToxic ===
            1
              ? (
                <TriangleAlert
                  size={19}
                />
              )
              : (
                <ScanText
                  size={19}
                />
              )
          }
          title="Toxicity"
          value={
            toxicity.label
          }
          confidence={
            toxicity.confidence
          }
          description="Multilingual toxicity model"
        />


        <SummaryCard
          type="hate"
          icon={
            hateSpeech
              .isHateSpeech === 1
              ? (
                <TriangleAlert
                  size={19}
                />
              )
              : (
                <ShieldCheck
                  size={19}
                />
              )
          }
          title="Hate Speech"
          value={
            hateSpeech.label
          }
          confidence={
            hateSpeech.confidence
          }
          description="Multilingual hate-speech model"
        />

      </div>


      {/* ======================================================
          THREAT + RISK
      ====================================================== */}

      <div className="public-result-main-layout">


        {/* ====================================================
            THREAT CLASSIFICATION
        ==================================================== */}

        <div className="public-result-block public-threat-panel">

          <div className="public-result-block-heading">

            <div className="public-result-block-icon">

              <ShieldCheck
                size={20}
              />

            </div>


            <div>

              <h3>
                Threat Classification
              </h3>

              <p>
                Final detected categories from the AI model.
              </p>

            </div>


            <span
              className={
                result?.is_threat ===
                1
                  ? "public-result-status danger"
                  : "public-result-status safe"
              }
            >

              {
                result?.is_threat ===
                1
                  ? "Threat Detected"
                  : "Safe"
              }

            </span>

          </div>


          {/* PRIMARY THREAT */}

          <div className="public-primary-threat">

            <div>

              <span>
                Primary Threat Category
              </span>

              <strong>

                {
                  result
                    ?.primary_threat ||
                  "No Threat"
                }

              </strong>

            </div>


            <b>
              {primaryConfidence}%
            </b>

          </div>


          {/* CATEGORY HEADING */}

          <div className="public-category-caption">

            <strong>
              Category Confidence
            </strong>

            <span>
              Detected categories
            </span>

          </div>


          {/* CATEGORY LIST */}

          <div className="public-threat-category-grid">

            {
              categories.length >
              0
                ? categories.map(
                    (
                      category
                    ) => {

                      const isTop =
                        category
                          .confidence ===
                        highestConfidence;


                      return (

                        <div
                          key={
                            category.key
                          }
                          className={
                            isTop
                              ? "public-threat-category top-score"
                              : "public-threat-category"
                          }
                        >

                          <div className="public-threat-category-top">

                            <span>
                              {category.label}
                            </span>

                            <strong>
                              {category.confidence}%
                            </strong>

                          </div>


                          <ScoreBar
                            value={
                              category
                                .confidence
                            }
                            variant={
                              isTop
                                ? "danger"
                                : "default"
                            }
                          />

                        </div>
                      );
                    }
                  )
                : (

                  <div className="public-threat-category">

                    <div className="public-threat-category-top">

                      <span>
                        No Threat Category Detected
                      </span>

                      <strong>
                        0%
                      </strong>

                    </div>

                    <ScoreBar
                      value={0}
                    />

                  </div>

                )
            }

          </div>

        </div>


        {/* ====================================================
            RISK
        ==================================================== */}

        <aside className="public-result-risk-column">


          <div className="public-risk-level-card">

            <div className="public-risk-card-icon">

              <TriangleAlert
                size={22}
              />

            </div>


            <div className="public-risk-card-copy">

              <span>
                Risk Level
              </span>

              <strong>
                {risk.level}
              </strong>

              <small>
                Final combined AI risk level.
              </small>

            </div>


            <div className="public-risk-big-value">

              {risk.score}

              <span>
                /100
              </span>

            </div>

          </div>


          <div className="public-risk-score-card">

            <div className="public-risk-card-icon purple">

              <Sparkles
                size={22}
              />

            </div>


            <div>

              <span>
                Risk Score
              </span>

              <strong>
                {risk.score} / 100
              </strong>

              <p>
                Calculated from threat, toxicity,
                hate speech and sentiment.
              </p>


              <ScoreBar
                value={
                  risk.score
                }
                variant={
                  risk.score >= 50
                    ? "danger"
                    : "default"
                }
              />

            </div>

          </div>

        </aside>

      </div>


      {/* ======================================================
          EXPLAINABLE AI
      ====================================================== */}

      <div className="public-result-block public-explain-panel">

        <div className="public-result-block-heading">

          <div className="public-result-block-icon explain">

            <BrainCircuit
              size={20}
            />

          </div>


          <div>

            <h3>
              Explainable AI
            </h3>

            <p>
              Understand the evidence behind the result.
            </p>

          </div>

        </div>


        {/* IMPORTANT WORDS */}

        <div className="public-important-words">

          <span>
            IMPORTANT WORDS / PHRASES
          </span>


          <div>

            {
              importantPhrases.length >
              0
                ? importantPhrases.map(
                    (
                      phrase,
                      index
                    ) => (

                      <strong
                        key={
                          `${phrase}-${index}`
                        }
                      >
                        {phrase}
                      </strong>

                    )
                  )
                : (

                  <strong>
                    No strong phrase-level evidence detected
                  </strong>

                )
            }

          </div>

        </div>


        {/* EXPLANATION */}

        <div className="public-explanation">

          <Sparkles
            size={18}
          />


          <div>

            <strong>
              Why this result?
            </strong>

            <p>
              {explanationSummary}
            </p>

          </div>

        </div>


        {/* REASONS */}

        {reasons.length > 0 && (

          <div className="public-important-words">

            <span>
              AI EVIDENCE
            </span>


            <div
              style={{
                display:
                  "grid",

                gap:
                  "10px",

                width:
                  "100%",
              }}
            >

              {reasons.map(
                (
                  reason,
                  index
                ) => (

                  <div
                    key={
                      `${reason}-${index}`
                    }
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "flex-start",

                      gap:
                        "8px",
                    }}
                  >

                    <SearchCheck
                      size={16}
                    />

                    <span>
                      {reason}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* METHOD */}

        <div className="public-explanation">

          <BrainCircuit
            size={18}
          />


          <div>

            <strong>
              Explanation Method
            </strong>

            <p>
              {explanationMethod}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// MAIN COMPONENT
//
// mode = "public"
// mode = "admin"
// ============================================================

export default function PublicAnalysisSection({
  mode = "public",
}) {

  // ==========================================================
  // ROUTER
  // ==========================================================

  const router =
    useRouter();


  // ==========================================================
  // STATES
  // ==========================================================

  const [
    text,
    setText,
  ] =
    useState("");


  const [
    language,
    setLanguage,
  ] =
    useState(
      "auto"
    );


  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );


  const [
    result,
    setResult,
  ] =
    useState(
      null
    );


  const [
    message,
    setMessage,
  ] =
    useState("");


  const [
    error,
    setError,
  ] =
    useState("");


  // ==========================================================
  // FASTAPI URL
  // ==========================================================

  const AI_API_URL =
    process.env
      .NEXT_PUBLIC_AI_API_URL ||
    "http://127.0.0.1:8000";


  // ==========================================================
  // GET LOGGED USER
  // ==========================================================

  const getLoggedUser =
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
          return null;
        }


        const data =
          await response.json();


        return (
          data?.user ||
          null
        );

      } catch (
        loginError
      ) {

        console.error(
          "LOGIN CHECK ERROR:",
          loginError
        );

        return null;
      }

    };


  // ==========================================================
  // ANALYZE TEXT
  // ==========================================================

  const analyzeText =
    async () => {

      // ======================================================
      // VALIDATION
      // ======================================================

      if (
        !text.trim()
      ) {

        setError(
          "Please enter text to analyze."
        );

        return;
      }


      setError("");

      setMessage("");

      setResult(null);


      // ======================================================
      // LOGIN CHECK
      // ======================================================

      const user =
        await getLoggedUser();


      if (!user) {

        if (
          mode === "admin"
        ) {

          router.push(
            "/login?redirect=/admin/text-analysis"
          );

        } else {

          router.push(
            "/login?redirect=analyze"
          );

        }

        return;
      }


      // ======================================================
      // PUBLIC ACCESS
      // ======================================================

      if (
        mode === "public" &&
        user.role !==
          "User"
      ) {

        setError(
          "Please use a normal user account to analyze text from the public website."
        );

        return;
      }


      // ======================================================
      // ADMIN ACCESS
      // ======================================================

      if (
        mode === "admin" &&
        user.role !==
          "Admin"
      ) {

        setError(
          "Only Admin can use Admin Text Analysis."
        );

        return;
      }


      // ======================================================
      // START
      // ======================================================

      setLoading(
        true
      );


      try {

        // ====================================================
        // REAL FASTAPI REQUEST
        //
        // ONLY TEXT IS SENT.
        // LANGUAGE IS AUTO-DETECTED BY BACKEND.
        // ====================================================

        const aiResponse =
          await fetch(
            `${AI_API_URL}/analyze`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({

                  text:
                    text.trim(),

                }),
            }
          );


        // ====================================================
        // READ RESPONSE
        // ====================================================

        let aiData =
          null;


        try {

          aiData =
            await aiResponse.json();

        } catch {

          throw new Error(
            "AI backend returned an invalid response."
          );

        }


        if (
          !aiResponse.ok
        ) {

          throw new Error(
            aiData?.detail ||
            aiData?.message ||
            "AI analysis failed."
          );

        }


        // ====================================================
        // SHOW RESULT
        // ====================================================

        setResult(
          aiData
        );


        // ====================================================
        // PRIMARY THREAT CONFIDENCE
        // ====================================================

        const primaryConfidence =
          getPrimaryConfidence(
            aiData
          );


        // ====================================================
        // DATABASE PAYLOAD
        //
        // IMPORTANT:
        // NO "language" FIELD.
        // detectedLanguage ONLY.
        // ====================================================

        const analysisPayload = {

          // TEXT

          text:
            text.trim(),


          // LANGUAGE

          detectedLanguage:
            aiData
              ?.language
              ?.label ||
            "Unknown",


          // SENTIMENT

          sentiment: {

            label:
              aiData
                ?.sentiment
                ?.label ||
              "Neutral",

            confidence:
              Number(
                aiData
                  ?.sentiment
                  ?.confidence ||
                0
              ),

          },


          // THREAT

          isThreat:
            Number(
              aiData
                ?.is_threat ||
              0
            ),


          primaryThreat: {

            label:
              aiData
                ?.primary_threat ||
              "No Threat",

            confidence:
              Number(
                primaryConfidence ||
                0
              ),

          },


          // TOXICITY

          toxicity: {

            label:
              aiData
                ?.toxicity
                ?.label ||
              "Non-Toxic",

            confidence:
              Number(
                aiData
                  ?.toxicity
                  ?.confidence ||
                0
              ),

          },


          // HATE SPEECH

          hateSpeech: {

            label:
              aiData
                ?.hate_speech
                ?.label ||
              "Non-Hate",

            confidence:
              Number(
                aiData
                  ?.hate_speech
                  ?.confidence ||
                0
              ),

          },


          // RISK

          riskScore:
            Number(
              aiData
                ?.risk
                ?.score ||
              0
            ),


          riskLevel:
            aiData
              ?.risk
              ?.level ||
            "Low",


          // EXPLANATION

          explanation:
            aiData
              ?.explainability
              ?.summary ||
            "",


          // SOURCE

          source:
            mode === "admin"
              ? "Admin Manual"
              : "Manual",

        };


        // ====================================================
        // SAVE TO MONGODB
        // ====================================================

        const saveResponse =
          await fetch(
            "/api/analyses",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  analysisPayload
                ),
            }
          );


        // ====================================================
        // READ SAVE RESPONSE
        // ====================================================

        let saveData =
          null;


        try {

          saveData =
            await saveResponse.json();

        } catch {

          saveData = {
            message:
              "History API returned an invalid response.",
          };

        }


        // ====================================================
        // SAVE FAILED
        // ====================================================

        if (
          !saveResponse.ok
        ) {

          setError(
            saveData?.message
              ? `History save failed: ${saveData.message}`
              : "History save failed."
          );

          setMessage("");

          return;
        }


        // ====================================================
        // SUCCESS
        // ====================================================

        setError("");


        setMessage(
          mode === "admin"
            ? "Admin analysis completed and saved successfully."
            : "Analysis completed and saved to your history."
        );


      } catch (
        analysisError
      ) {

        console.error(
          "SAFETALK ANALYSIS ERROR:",
          analysisError
        );


        setError(
          analysisError
            ?.message ||
          "Unable to analyze text. Make sure the AI backend is running."
        );


      } finally {

        setLoading(
          false
        );

      }

    };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <section
  id="analyze"
  className={
    mode === "admin"
      ? "public-analysis-section admin-analysis-theme"
      : "public-analysis-section"
  }
>

      <div className="public-analysis-container">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="public-analysis-heading">

          <span>

            {
              mode === "admin"
                ? "ADMIN AI ANALYSIS"
                : "TRY SAFETALKAI"
            }

          </span>


          <h2>

            {
              mode === "admin"
                ? "Admin Text Analysis"
                : "Analyze your text"
            }

          </h2>


          <p>

            {
              mode === "admin"
                ? "Analyze text using the same real SafeTalkAI models used on the public website."
                : "Analyze language, sentiment, threats, toxicity, hate speech, risk and AI evidence."
            }

          </p>

        </div>


        {/* ====================================================
            INPUT CARD
        ==================================================== */}

        <div className="public-analysis-card">


          {/* CARD HEADER */}

          <div className="public-analysis-card-header">

            <div className="public-analysis-title-icon">

              <ScanText
                size={24}
              />

            </div>


            <div>

              <h3>
                Text Analysis
              </h3>

              <p>
                Enter social media text below.
              </p>

            </div>


            <div className="public-analysis-secure">

              <ShieldCheck
                size={15}
              />

              {
                mode === "admin"
                  ? "Admin Protected"
                  : "Login Protected"
              }

            </div>

          </div>


          {/* ==================================================
              LANGUAGE SELECTOR
          ================================================== */}

          <div className="public-analysis-language">

            <Languages
              size={17}
            />


            <select
              value={
                language
              }
              onChange={
                (
                  event
                ) =>
                  setLanguage(
                    event
                      .target
                      .value
                  )
              }
              disabled={
                loading
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


          {/* ==================================================
              TEXTAREA
          ================================================== */}

          <textarea
            value={
              text
            }
            onChange={
              (
                event
              ) =>
                setText(
                  event
                    .target
                    .value
                )
            }
            maxLength={
              3000
            }
            disabled={
              loading
            }
            className="public-analysis-textarea"
            placeholder={`Paste social media text here...

Example:

"I will kill you"

"main tumhara account hack kar dunga"

"میں تمہیں جان سے مار دوں گا"`}
          />


          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="public-analysis-actions">

            <div>

              <span>
                {text.length} / 3000
              </span>


              <small>

                <LockKeyhole
                  size={13}
                />

                {
                  mode === "admin"
                    ? "Admin access required"
                    : "Login required for analysis"
                }

              </small>

            </div>


            <button
              type="button"
              onClick={
                analyzeText
              }
              disabled={
                loading ||
                !text.trim()
              }
            >

              {
                loading
                  ? (
                    <>

                      <LoaderCircle
                        size={18}
                        className="analysis-spinner"
                      />

                      Analyzing...

                    </>
                  )
                  : (
                    <>

                      <Sparkles
                        size={18}
                      />

                      Analyze Text

                    </>
                  )
              }

            </button>

          </div>

        </div>


        {/* ====================================================
            SUCCESS
        ==================================================== */}

        {message && (

          <div className="public-analysis-message success">

            <ShieldCheck
              size={16}
            />

            {message}

          </div>

        )}


        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="public-analysis-message error">

            <TriangleAlert
              size={16}
            />

            {error}

          </div>

        )}


        {/* ====================================================
            RESULT
        ==================================================== */}

        {result && (

          <div className="public-analysis-result">

            <PublicResult
              result={
                result
              }
              originalText={
                text
              }
            />

          </div>

        )}

      </div>

    </section>
  );
}