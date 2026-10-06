# ============================================================
# SAFETALK AI
# ANALYZE API ROUTE
# ============================================================
#
# FEATURES:
#
# 1. Language Detection
# 2. Threat Detection
# 3. Sentiment Analysis
# 4. Toxicity Detection
# 5. Hate Speech Detection
# 6. Risk Score
# 7. Risk Level
# 8. Explainable AI
#
# ============================================================

from fastapi import (
    APIRouter,
    HTTPException
)

from pydantic import (
    BaseModel
)


from app.services.language_service import (
    detect_language
)

from app.services.threat_service import (
    predict_threat
)

from app.services.sentiment_service import (
    predict_sentiment
)

from app.services.toxicity_service import (
    predict_toxicity
)

from app.services.hate_speech_service import (
    predict_hate_speech
)

from app.services.risk_service import (
    calculate_risk
)

from app.services.explainability_service import (
    explain_prediction
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter()


# ============================================================
# REQUEST MODEL
# ============================================================

class AnalyzeRequest(
    BaseModel
):

    text: str

    language: str = "auto"


# ============================================================
# ANALYZE ENDPOINT
# ============================================================

@router.post(
    "/analyze"
)
def analyze_text(
    request: AnalyzeRequest
):

    # ========================================================
    # CLEAN TEXT
    # ========================================================

    text = (
        request.text
        .strip()
    )


    selected_language = (
        request.language
        or
        "auto"
    )


    # ========================================================
    # VALIDATION
    # ========================================================

    if not text:

        raise HTTPException(
            status_code=400,
            detail=
                "Text is required."
        )


    try:

        # ====================================================
        # 1. LANGUAGE DETECTION
        # ====================================================

        language_result = (
            detect_language(
                text=text,

                selected_language=
                    selected_language
            )
        )


        # ====================================================
        # 2. THREAT MODEL
        # ====================================================

        threat_result = (
            predict_threat(
                text
            )
        )


        # ====================================================
        # 3. SENTIMENT MODEL
        # ====================================================

        sentiment_result = (
            predict_sentiment(
                text
            )
        )


        # ====================================================
        # 4. TOXICITY MODEL
        # ====================================================

        toxicity_result = (
            predict_toxicity(
                text
            )
        )


        # ====================================================
        # 5. HATE SPEECH MODEL
        # ====================================================

        hate_speech_result = (
            predict_hate_speech(
                text
            )
        )


        # ====================================================
        # 6. RISK ENGINE
        # ====================================================

        risk_result = (
            calculate_risk(

                threat_result=
                    threat_result,

                sentiment_result=
                    sentiment_result,

                toxicity_result=
                    toxicity_result,

                hate_speech_result=
                    hate_speech_result,
            )
        )


        # ====================================================
        # 7. EXPLAINABLE AI
        # ====================================================

        explainability_result = (
            explain_prediction(

                text=
                    text,

                threat_result=
                    threat_result,

                sentiment_result=
                    sentiment_result,

                toxicity_result=
                    toxicity_result,

                hate_speech_result=
                    hate_speech_result,

                risk_result=
                    risk_result,

                language_result=
                    language_result,
            )
        )


        # ====================================================
        # FINAL RESPONSE
        # ====================================================

        return {

            # =================================================
            # TEXT
            # =================================================

            "text":
                text,


            # =================================================
            # LANGUAGE
            # =================================================

            "language": {

                "code":
                    language_result.get(
                        "code",
                        "unknown"
                    ),

                "label":
                    language_result.get(
                        "label",
                        "Unknown"
                    ),

                "confidence":
                    language_result.get(
                        "confidence",
                        0
                    ),

                "method":
                    language_result.get(
                        "method",
                        "auto"
                    ),

                "is_auto_detected":
                    language_result.get(
                        "is_auto_detected",
                        True
                    ),

                "signals":
                    language_result.get(
                        "signals",
                        {}
                    ),
            },


            # =================================================
            # SENTIMENT
            # =================================================

            "sentiment": {

                "label":
                    sentiment_result.get(
                        "label",
                        "Unknown"
                    ),

                "confidence":
                    sentiment_result.get(
                        "confidence",
                        0
                    ),

                "scores":
                    sentiment_result.get(
                        "scores",
                        {}
                    ),
            },


            # =================================================
            # TOXICITY
            # =================================================

            "toxicity": {

                "label":
                    toxicity_result.get(
                        "label",
                        "Unknown"
                    ),

                "confidence":
                    toxicity_result.get(
                        "confidence",
                        0
                    ),

                "scores":
                    toxicity_result.get(
                        "scores",
                        {}
                    ),

                "is_toxic":
                    toxicity_result.get(
                        "is_toxic",
                        0
                    ),
            },


            # =================================================
            # HATE SPEECH
            # =================================================

            "hate_speech": {

                "label":
                    hate_speech_result.get(
                        "label",
                        "Unknown"
                    ),

                "confidence":
                    hate_speech_result.get(
                        "confidence",
                        0
                    ),

                "scores":
                    hate_speech_result.get(
                        "scores",
                        {}
                    ),

                "is_hate_speech":
                    hate_speech_result.get(
                        "is_hate_speech",
                        0
                    ),
            },


            # =================================================
            # THREAT
            # =================================================

            "is_threat":
                threat_result.get(
                    "is_threat",
                    0
                ),


            "primary_threat":
                threat_result.get(
                    "primary_threat",
                    "No Threat"
                ),


            "active_labels":
                threat_result.get(
                    "active_labels",
                    []
                ),


            "raw_predictions":
                threat_result.get(
                    "raw_predictions",
                    {}
                ),


            "predictions":
                threat_result.get(
                    "predictions",
                    {}
                ),


            "scores":
                threat_result.get(
                    "scores",
                    {}
                ),


            "semantic_evidence":
                threat_result.get(
                    "semantic_evidence",
                    []
                ),


            "abusive_primary_override":
                threat_result.get(
                    "abusive_primary_override",
                    False
                ),


            # =================================================
            # RISK
            # =================================================

            "risk": {

                "score":
                    risk_result.get(
                        "score",
                        0
                    ),

                "level":
                    risk_result.get(
                        "level",
                        "Low"
                    ),

                "components":
                    risk_result.get(
                        "components",
                        {}
                    ),
            },


            # =================================================
            # EXPLAINABLE AI
            # =================================================

            "explainability": {

                "important_phrases":
                    explainability_result.get(
                        "important_phrases",
                        []
                    ),

                "summary":
                    explainability_result.get(
                        "summary",
                        ""
                    ),

                "reasons":
                    explainability_result.get(
                        "reasons",
                        []
                    ),

                "model_evidence":
                    explainability_result.get(
                        "model_evidence",
                        {}
                    ),

                "method":
                    explainability_result.get(
                        "method",
                        ""
                    ),
            },


            # =================================================
            # DEVICES
            # =================================================

            "devices": {

                "threat":
                    threat_result.get(
                        "device",
                        "unknown"
                    ),

                "sentiment":
                    sentiment_result.get(
                        "device",
                        "unknown"
                    ),

                "toxicity":
                    toxicity_result.get(
                        "device",
                        "unknown"
                    ),

                "hate_speech":
                    hate_speech_result.get(
                        "device",
                        "unknown"
                    ),
            },
        }


    # ========================================================
    # ERROR
    # ========================================================

    except HTTPException:

        raise


    except Exception as error:

        print(
            "\n"
            "============================================================"
        )

        print(
            "SAFETALK AI ANALYZE ERROR"
        )

        print(
            "============================================================"
        )

        print(
            str(error)
        )

        print(
            "============================================================"
        )


        raise HTTPException(
            status_code=500,

            detail=(
                f"AI analysis failed: "
                f"{str(error)}"
            )
        )