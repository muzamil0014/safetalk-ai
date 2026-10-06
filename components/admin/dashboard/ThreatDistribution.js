"use client";

// ============================================================
// SAFETALK AI
// THREAT CATEGORY DISTRIBUTION
// REAL MONGODB DATA
// ============================================================

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


export default function ThreatDistribution({
  data = [],
}) {

  return (

    <div className="dashboard-panel threat-distribution-panel">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="panel-header">

        <h3>
          Threat Category Distribution
        </h3>

      </div>


      {/* ======================================================
          CHART
      ====================================================== */}

      <div className="threat-chart">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={data}
            margin={{
              top: 15,
              right: 20,
              left: -10,
              bottom: 10,
            }}
          >


            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e8edf6"
            />


            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{
                fill:
                  "#77809a",

                fontSize:
                  11,
              }}
            />


            <YAxis
              allowDecimals={
                false
              }
              axisLine={false}
              tickLine={false}
              tick={{
                fill:
                  "#77809a",

                fontSize:
                  11,
              }}
            />


            <Tooltip
              contentStyle={{
                borderRadius:
                  "12px",

                border:
                  "none",

                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.12)",
              }}
            />


            <Bar
              dataKey="value"
              name="Detected"
              fill="#8438ff"
              radius={[
                7,
                7,
                0,
                0,
              ]}
              barSize={34}
            />


          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}