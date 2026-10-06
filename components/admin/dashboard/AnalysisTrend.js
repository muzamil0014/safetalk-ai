"use client";

// ============================================================
// SAFETALK AI
// ANALYSIS TREND LINE CHART
// REAL MONGODB DATA
// ============================================================

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  ChevronDown,
} from "lucide-react";


export default function AnalysisTrend({
  data = [],
}) {

  return (
    <div className="dashboard-panel analysis-trend-panel">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="panel-header">

        <h3>
          Analysis Trend
        </h3>


        <button
          type="button"
          className="panel-filter"
        >
          Last 7 Days

          <ChevronDown
            size={15}
          />
        </button>

      </div>


      {/* ======================================================
          CHART
      ====================================================== */}

      <div className="trend-chart">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={data}
            margin={{
              top: 15,
              right: 15,
              left: -10,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e8edf6"
            />


            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#77809a",
                fontSize: 12,
              }}
            />


            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#77809a",
                fontSize: 12,
              }}
            />


            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.15)",
              }}
            />


            <Legend />


            <Line
              type="monotone"
              dataKey="positive"
              name="Positive"
              stroke="#11c98d"
              strokeWidth={2.5}
              dot={false}
            />


            <Line
              type="monotone"
              dataKey="negative"
              name="Negative"
              stroke="#ff405c"
              strokeWidth={2.5}
              dot={false}
            />


            <Line
              type="monotone"
              dataKey="neutral"
              name="Neutral"
              stroke="#1685ff"
              strokeWidth={2.5}
              dot={false}
            />


            <Line
              type="monotone"
              dataKey="toxic"
              name="Toxic"
              stroke="#8538ff"
              strokeWidth={2.5}
              dot={false}
            />


            <Line
              type="monotone"
              dataKey="threat"
              name="Threat"
              stroke="#ff9f1c"
              strokeWidth={2.5}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}