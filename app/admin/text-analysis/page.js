"use client";

// ============================================================
// SAFETALK AI
// ADMIN TEXT ANALYSIS PAGE
// ============================================================

import PublicAnalysisSection
  from "@/components/public/PublicAnalysisSection";


export default function AdminTextAnalysisPage() {

  return (

    <div className="admin-text-analysis-page">

      <PublicAnalysisSection
        mode="admin"
      />

    </div>

  );
}