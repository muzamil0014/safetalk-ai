// ============================================================
// SAFETALK AI
// DASHBOARD STAT CARD
// ============================================================

import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";

export default function StatCard({
  title,
  value,
  change,
  trend = "up",
  icon: Icon,
  type = "blue",
}) {

  const isUp = trend === "up";

  return (
    <div className="stat-card">

      {/* ICON */}
      <div className={`stat-icon ${type}`}>

        {Icon && <Icon size={24} />}

      </div>


      {/* CONTENT */}
      <div className="stat-content">

        <p className="stat-title">
          {title}
        </p>

        <h3>
          {value}
        </h3>


        {/* TREND */}
        <div
          className={`stat-change ${
            isUp ? "increase" : "decrease"
          }`}
        >

          {isUp ? (
            <ArrowUp size={14} />
          ) : (
            <ArrowDown size={14} />
          )}

          <span>{change}</span>

          <small>from last week</small>

        </div>

      </div>

    </div>
  );
}