"use client";

// ============================================================
// SAFETALK AI
// CONTENT DISTRIBUTION DONUT CHART
// REAL MONGODB DATA
// ============================================================

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";


export default function ContentDistribution({
  data = [],
  total = 0,
}) {

  // ==========================================================
  // DISTRIBUTION TOTAL
  // ==========================================================

  const distributionTotal =
    data.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item?.value ||
          0
        ),
      0
    );


  return (

    <div className="dashboard-panel distribution-panel">


      {/* TITLE */}

      <div className="panel-header">

        <h3>
          Content Distribution
        </h3>

      </div>


      <div className="distribution-content">


        {/* ====================================================
            DONUT CHART
        ==================================================== */}

        <div className="donut-wrapper">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={80}
                paddingAngle={1}
                stroke="none"
              >

                {data.map(
                  (item) => (

                    <Cell
                      key={
                        item.name
                      }
                      fill={
                        item.color
                      }
                    />

                  )
                )}

              </Pie>

            </PieChart>

          </ResponsiveContainer>


          {/* CENTER TEXT */}

          <div className="donut-center">

            <strong>
              {total}
            </strong>

            <span>
              Total
            </span>

          </div>

        </div>


        {/* ====================================================
            LEGEND
        ==================================================== */}

        <div className="distribution-legend">

          {data.map(
            (item) => {

              const percentage =
                distributionTotal > 0
                  ? Math.round(
                      (
                        Number(
                          item.value ||
                          0
                        ) /
                        distributionTotal
                      ) *
                        100
                    )
                  : 0;


              return (

                <div
                  key={
                    item.name
                  }
                  className="distribution-item"
                >

                  <div className="distribution-name">

                    <span
                      className="legend-dot"
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    />

                    {item.name}

                  </div>


                  <strong>
                    {percentage}%
                  </strong>

                </div>

              );

            }
          )}

        </div>

      </div>

    </div>
  );
}