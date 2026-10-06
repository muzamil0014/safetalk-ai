// ============================================================
// SAFETALK AI
// EXPLAINABLE AI BOX
// ============================================================

import {
  BrainCircuit,
  Lightbulb,
  Tags,
} from "lucide-react";


// ============================================================
// ESCAPE REGEX SPECIAL CHARACTERS
// ============================================================

function escapeRegExp(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


// ============================================================
// TEXT HIGHLIGHT FUNCTION
// ============================================================

function highlightImportantWords(
  text,
  importantWords = []
) {

  // Agar important words nahi hain
  if (!importantWords.length) {
    return text;
  }


  // Regex pattern prepare
  const pattern = importantWords
    .map((word) => escapeRegExp(word))
    .join("|");


  const regex =
    new RegExp(`(${pattern})`, "gi");


  // Text ko parts me split
  const parts = text.split(regex);


  return parts.map((part, index) => {

    const isImportant =
      importantWords.some(
        (word) =>
          word.toLowerCase() ===
          part.toLowerCase()
      );


    if (isImportant) {
      return (
        <mark
          key={`${part}-${index}`}
          className="analysis-highlight-word"
        >
          {part}
        </mark>
      );
    }


    return (
      <span key={`${part}-${index}`}>
        {part}
      </span>
    );
  });
}


export default function ExplanationBox({
  originalText = "",
  explanation = "",
  importantWords = [],
}) {

  return (
    <div className="analysis-explanation-card">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="analysis-explanation-header">

        <div className="analysis-explanation-title">

          <div className="analysis-explanation-icon">

            <BrainCircuit size={21} />

          </div>


          <div>

            <h3>
              Explainable AI
            </h3>

            <p>
              Understand why SafeTalkAI made
              this prediction.
            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          HIGHLIGHTED TEXT
      ====================================================== */}

      <div className="analysis-explanation-section">

        <div className="analysis-explanation-label">

          <Tags size={16} />

          <span>
            Important Words
          </span>

        </div>


        <div className="analysis-highlighted-text">

          {highlightImportantWords(
            originalText,
            importantWords
          )}

        </div>

      </div>


      {/* ======================================================
          IMPORTANT WORD TAGS
      ====================================================== */}

      <div className="analysis-important-tags">

        {importantWords.map((word) => (

          <span key={word}>
            {word}
          </span>

        ))}

      </div>


      {/* ======================================================
          EXPLANATION
      ====================================================== */}

      <div className="analysis-explanation-message">

        <div className="analysis-lightbulb">

          <Lightbulb size={18} />

        </div>


        <div>

          <strong>
            Why this result?
          </strong>

          <p>
            {explanation}
          </p>

        </div>

      </div>

    </div>
  );
}