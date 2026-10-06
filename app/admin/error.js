"use client";

// ============================================================
// SAFETALK AI
// ADMIN ERROR BOUNDARY
// ============================================================

import {
  TriangleAlert,
  RefreshCw,
} from "lucide-react";


export default function AdminError({
  error,
  reset,
}) {

  return (

    <div
      style={{
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >

      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          padding: "30px",
          textAlign: "center",
          background: "#fff",
          border:
            "1px solid #e3eaf5",
          borderRadius: "18px",
        }}
      >

        <TriangleAlert
          size={42}
        />


        <h2
          style={{
            marginTop: "15px",
          }}
        >
          Something went wrong
        </h2>


        <p
          style={{
            marginTop: "8px",
            color: "#7f899d",
          }}
        >
          {error?.message ||
            "SafeTalkAI could not load this section."}
        </p>


        <button
          className="module-primary-button"
          style={{
            marginTop: "18px",
          }}
          onClick={reset}
        >

          <RefreshCw size={16} />

          Try Again

        </button>

      </div>

    </div>
  );
}