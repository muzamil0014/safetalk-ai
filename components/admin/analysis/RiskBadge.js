// ============================================================
// SAFETALK AI
// RISK LEVEL BADGE
// ============================================================

import {
  ShieldCheck,
  ShieldAlert,
  TriangleAlert,
  OctagonAlert,
} from "lucide-react";


export default function RiskBadge({
  level = "Low",
  score = 0,
}) {

  // ==========================================================
  // LEVEL SETTINGS
  // ==========================================================

  const riskConfig = {
    Low: {
      icon: ShieldCheck,
      className: "low",
      description: "Low risk content",
    },

    Medium: {
      icon: ShieldAlert,
      className: "medium",
      description: "Moderate risk content",
    },

    High: {
      icon: TriangleAlert,
      className: "high",
      description: "High risk content",
    },

    Critical: {
      icon: OctagonAlert,
      className: "critical",
      description: "Critical risk content",
    },
  };


  const config =
    riskConfig[level] || riskConfig.Low;

  const Icon = config.icon;


  return (
    <div
      className={`analysis-risk-box ${config.className}`}
    >

      {/* ICON */}
      <div className="analysis-risk-icon">

        <Icon size={25} />

      </div>


      {/* CONTENT */}
      <div className="analysis-risk-content">

        <span className="analysis-risk-label">
          Risk Level
        </span>

        <strong>
          {level}
        </strong>

        <small>
          {config.description}
        </small>

      </div>


      {/* SCORE */}
      <div className="analysis-risk-score">

        <span>
          {score}
        </span>

        <small>
          / 100
        </small>

      </div>

    </div>
  );
}