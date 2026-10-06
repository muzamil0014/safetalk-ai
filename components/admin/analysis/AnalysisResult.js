// ============================================================
// SAFETALK AI
// COMPLETE ANALYSIS RESULT
// ============================================================

import {
  Activity,
  BadgeAlert,
  BrainCircuit,
  Languages,
  MessageCircleWarning,
  ShieldAlert,
  ShieldCheck,
  Skull,
  Sparkles,
} from "lucide-react";

import RiskBadge
  from "@/components/admin/analysis/RiskBadge";

import ExplanationBox
  from "@/components/admin/analysis/ExplanationBox";


// ============================================================
// CONFIDENCE BAR COMPONENT
// ============================================================

function ConfidenceBar({
  label,
  value,
  type = "purple",
}) {

  return (
    <div className="analysis-confidence-item">

      <div className="analysis-confidence-top">

        <span>
          {label}
        </span>

        <strong>
          {value}%
        </strong>

      </div>


      <div className="analysis-confidence-track">

        <span
          className={`analysis-confidence-fill ${type}`}
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AnalysisResult({
  result,
  originalText,
}) {

  if (!result) {
    return null;
  }


  const threatDetected =
    result.threatStatus ===
    "Threat Detected";


  return (
    <section className="analysis-result-wrapper">


      {/* ======================================================
          RESULT HEADER
      ====================================================== */}

      <div className="analysis-result-header">

        <div className="analysis-result-heading">

          <div className="analysis-result-heading-icon">

            <Sparkles size={22} />

          </div>


          <div>

            <h2>
              Analysis Result
            </h2>

            <p>
              AI analysis of the submitted text.
            </p>

          </div>

        </div>


        {/* LANGUAGE */}

        <div className="analysis-result-language">

          <Languages size={17} />

          <div>

            <span>
              Language
            </span>

            <strong>
              {result.language}
            </strong>

          </div>

        </div>

      </div>


      {/* ======================================================
          TOP RESULT CARDS
      ====================================================== */}

      <div className="analysis-result-grid">


        {/* SENTIMENT */}

        <div className="analysis-metric-card sentiment">

          <div className="analysis-metric-icon">

            <Activity size={22} />

          </div>


          <div className="analysis-metric-content">

            <span>
              Sentiment
            </span>

            <strong>
              {result.sentiment.label}
            </strong>

            <small>
              {result.sentiment.confidence}%
              confidence
            </small>

          </div>


          <div className="analysis-circle-score">

            {result.sentiment.confidence}%

          </div>

        </div>


        {/* THREAT STATUS */}

        <div
          className={`analysis-metric-card threat ${
            threatDetected
              ? "danger"
              : "safe"
          }`}
        >

          <div className="analysis-metric-icon">

            {threatDetected ? (
              <ShieldAlert size={22} />
            ) : (
              <ShieldCheck size={22} />
            )}

          </div>


          <div className="analysis-metric-content">

            <span>
              Threat Status
            </span>

            <strong>
              {result.threatStatus}
            </strong>

            <small>
              Overall threat classification
            </small>

          </div>

        </div>


        {/* TOXICITY */}

        <div className="analysis-metric-card toxicity">

          <div className="analysis-metric-icon">

            <Skull size={22} />

          </div>


          <div className="analysis-metric-content">

            <span>
              Toxicity
            </span>

            <strong>
              {result.toxicity.label}
            </strong>

            <small>
              {result.toxicity.confidence}%
              confidence
            </small>

          </div>


          <div className="analysis-circle-score">

            {result.toxicity.confidence}%

          </div>

        </div>


        {/* HATE SPEECH */}

        <div className="analysis-metric-card hate">

          <div className="analysis-metric-icon">

            <MessageCircleWarning size={22} />

          </div>


          <div className="analysis-metric-content">

            <span>
              Hate Speech
            </span>

            <strong>
              {result.hateSpeech.label}
            </strong>

            <small>
              {result.hateSpeech.confidence}%
              confidence
            </small>

          </div>


          <div className="analysis-circle-score">

            {result.hateSpeech.confidence}%

          </div>

        </div>

      </div>


      {/* ======================================================
          THREAT DETAILS + RISK
      ====================================================== */}

      <div className="analysis-details-grid">


        {/* ====================================================
            THREAT CATEGORIES
        ==================================================== */}

        <div className="analysis-threat-card">

          <div className="analysis-section-title">

            <div>

              <BadgeAlert size={19} />

              <h3>
                Threat Classification
              </h3>

            </div>


            <span
              className={`analysis-threat-status-pill ${
                threatDetected
                  ? "detected"
                  : "safe"
              }`}
            >
              {result.threatStatus}
            </span>

          </div>


          {/* PRIMARY CATEGORY */}

          <div className="analysis-primary-threat">

            <div>

              <span>
                Primary Threat Category
              </span>

              <strong>
                {result.primaryThreat.label}
              </strong>

            </div>


            <div className="analysis-primary-score">

              {result.primaryThreat.confidence}%

            </div>

          </div>


          {/* SECONDARY CATEGORIES */}

          <div className="analysis-secondary-header">

            <span>
              Category Confidence
            </span>

            <small>
              Multi-label classification
            </small>

          </div>


          <div className="analysis-confidence-list">

            {result.threatCategories.map(
              (item, index) => (

                <ConfidenceBar
                  key={item.label}
                  label={item.label}
                  value={item.confidence}
                  type={
                    index === 0
                      ? "red"
                      : index === 1
                      ? "purple"
                      : "blue"
                  }
                />

              )
            )}

          </div>

        </div>


        {/* ====================================================
            RISK
        ==================================================== */}

        <div className="analysis-risk-column">

          <RiskBadge
            level={result.riskLevel}
            score={result.riskScore}
          />


          {/* RISK INFORMATION */}

          <div className="analysis-risk-summary">

            <div className="analysis-risk-summary-icon">

              <BrainCircuit size={20} />

            </div>


            <div>

              <span>
                Risk Score
              </span>

              <strong>
                {result.riskScore} / 100
              </strong>

              <p>
                Risk combines threat category,
                toxicity, hate speech and
                sentiment indicators.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          EXPLAINABLE AI
      ====================================================== */}

      <ExplanationBox
        originalText={originalText}
        explanation={result.explanation}
        importantWords={result.importantWords}
      />

    </section>
  );
}