# ============================================================
# SAFETALK AI
# RISK SCORE + RISK LEVEL SERVICE
# ============================================================

from typing import Dict, Any


# ============================================================
# RISK LEVEL THRESHOLDS
# ============================================================

RISK_LEVELS = {
    "low": {
        "min": 0,
        "max": 24,
        "label": "Low",
    },
    "medium": {
        "min": 25,
        "max": 49,
        "label": "Medium",
    },
    "high": {
        "min": 50,
        "max": 74,
        "label": "High",
    },
    "critical": {
        "min": 75,
        "max": 100,
        "label": "Critical",
    },
}


# ============================================================
# DIRECT THREAT LABELS
# ============================================================

DIRECT_THREAT_LABELS = [
    "physical_threat",
    "death_threat",
    "cyber_threat",
    "sexual_threat",
    "self_harm",
]


# ============================================================
# NON-DIRECT HARMFUL THREAT LABELS
# ============================================================

HARMFUL_LABELS = [
    "harassment",
    "abusive_language",
    "hate_speech",
]


# ============================================================
# SAFE NUMBER
# ============================================================

def safe_number(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


# ============================================================
# CLAMP
# ============================================================

def clamp(value, minimum=0.0, maximum=100.0):
    return max(
        minimum,
        min(maximum, value)
    )


# ============================================================
# GET THREAT SCORE
# ============================================================

def get_threat_percentage(
    threat_result: Dict[str, Any],
    label: str
) -> float:

    scores = threat_result.get(
        "scores",
        {}
    )

    label_data = scores.get(
        label,
        {}
    )

    return safe_number(
        label_data.get(
            "percentage",
            0
        )
    )


# ============================================================
# GET MAX DIRECT THREAT SCORE
# ============================================================

def get_direct_threat_score(
    threat_result: Dict[str, Any]
) -> float:

    values = [
        get_threat_percentage(
            threat_result,
            label
        )
        for label in DIRECT_THREAT_LABELS
    ]

    if not values:
        return 0.0

    return max(values)


# ============================================================
# GET MAX HARMFUL CATEGORY SCORE
# ============================================================

def get_harmful_category_score(
    threat_result: Dict[str, Any]
) -> float:

    values = [
        get_threat_percentage(
            threat_result,
            label
        )
        for label in HARMFUL_LABELS
    ]

    if not values:
        return 0.0

    return max(values)


# ============================================================
# GET NEGATIVE SENTIMENT SCORE
# ============================================================

def get_negative_sentiment_score(
    sentiment_result: Dict[str, Any]
) -> float:

    scores = sentiment_result.get(
        "scores",
        {}
    )

    return safe_number(
        scores.get(
            "Negative",
            0
        )
    )


# ============================================================
# GET TOXICITY SCORE
# ============================================================

def get_toxicity_score(
    toxicity_result: Dict[str, Any]
) -> float:

    scores = toxicity_result.get(
        "scores",
        {}
    )

    return safe_number(
        scores.get(
            "Toxic",
            0
        )
    )


# ============================================================
# GET HATE SPEECH SCORE
# ============================================================

def get_hate_speech_score(
    hate_speech_result: Dict[str, Any]
) -> float:

    scores = hate_speech_result.get(
        "scores",
        {}
    )

    return safe_number(
        scores.get(
            "Hate Speech",
            0
        )
    )


# ============================================================
# GET RISK LEVEL
# ============================================================

def get_risk_level(
    risk_score: float
) -> str:

    if risk_score >= 75:
        return "Critical"

    if risk_score >= 50:
        return "High"

    if risk_score >= 25:
        return "Medium"

    return "Low"


# ============================================================
# APPLY DIRECT THREAT SAFETY RULES
# ============================================================

def apply_direct_threat_rules(
    risk_score: float,
    threat_result: Dict[str, Any]
) -> float:

    is_threat = int(
        threat_result.get(
            "is_threat",
            0
        )
        or 0
    )

    primary_threat = (
        threat_result.get(
            "primary_threat",
            ""
        )
        or ""
    )

    if is_threat != 1:
        return risk_score

    # --------------------------------------------------------
    # ANY CONFIRMED DIRECT THREAT
    # --------------------------------------------------------

    risk_score = max(
        risk_score,
        60
    )

    # --------------------------------------------------------
    # DEATH THREAT
    # --------------------------------------------------------

    if primary_threat == "Death Threat":
        risk_score = max(
            risk_score,
            90
        )

    # --------------------------------------------------------
    # PHYSICAL THREAT
    # --------------------------------------------------------

    elif primary_threat == "Physical Threat":
        risk_score = max(
            risk_score,
            80
        )

    # --------------------------------------------------------
    # SEXUAL THREAT
    # --------------------------------------------------------

    elif primary_threat == "Sexual Threat":
        risk_score = max(
            risk_score,
            85
        )

    # --------------------------------------------------------
    # SELF-HARM
    # --------------------------------------------------------

    elif primary_threat == "Self-Harm Related":
        risk_score = max(
            risk_score,
            85
        )

    # --------------------------------------------------------
    # CYBER THREAT
    # --------------------------------------------------------

    elif primary_threat == "Cyber Threat":
        risk_score = max(
            risk_score,
            65
        )

    return risk_score


# ============================================================
# CALCULATE FINAL RISK
# ============================================================

def calculate_risk(
    threat_result: Dict[str, Any],
    sentiment_result: Dict[str, Any],
    toxicity_result: Dict[str, Any],
    hate_speech_result: Dict[str, Any],
) -> Dict[str, Any]:

    # ========================================================
    # GET MODEL SCORES
    # ========================================================

    direct_threat_score = (
        get_direct_threat_score(
            threat_result
        )
    )

    harmful_category_score = (
        get_harmful_category_score(
            threat_result
        )
    )

    negative_sentiment_score = (
        get_negative_sentiment_score(
            sentiment_result
        )
    )

    toxicity_score = (
        get_toxicity_score(
            toxicity_result
        )
    )

    hate_speech_score = (
        get_hate_speech_score(
            hate_speech_result
        )
    )

    # ========================================================
    # NORMALIZE 0 - 1
    # ========================================================

    direct_normalized = (
        direct_threat_score / 100
    )

    harmful_normalized = (
        harmful_category_score / 100
    )

    negative_normalized = (
        negative_sentiment_score / 100
    )

    toxicity_normalized = (
        toxicity_score / 100
    )

    hate_normalized = (
        hate_speech_score / 100
    )

    # ========================================================
    # WEIGHTED RISK FORMULA
    #
    # Direct Threat       = 45%
    # Harmful Category    = 15%
    # Toxicity            = 20%
    # Hate Speech         = 15%
    # Negative Sentiment  = 5%
    #
    # TOTAL               = 100%
    # ========================================================

    direct_contribution = (
        direct_normalized * 45
    )

    harmful_contribution = (
        harmful_normalized * 15
    )

    toxicity_contribution = (
        toxicity_normalized * 20
    )

    hate_contribution = (
        hate_normalized * 15
    )

    sentiment_contribution = (
        negative_normalized * 5
    )

    # ========================================================
    # BASE RISK SCORE
    # ========================================================

    risk_score = (
        direct_contribution
        + harmful_contribution
        + toxicity_contribution
        + hate_contribution
        + sentiment_contribution
    )

    # ========================================================
    # DIRECT THREAT SAFETY OVERRIDES
    # ========================================================

    risk_score = apply_direct_threat_rules(
        risk_score,
        threat_result
    )

    # ========================================================
    # FINAL SCORE 0 - 100
    # ========================================================

    risk_score = clamp(
        risk_score,
        0,
        100
    )

    risk_score = round(
        risk_score,
        2
    )

    # ========================================================
    # RISK LEVEL
    # ========================================================

    risk_level = get_risk_level(
        risk_score
    )

    # ========================================================
    # RETURN RESULT
    # ========================================================

    return {
        "score": risk_score,

        "level": risk_level,

        "components": {
            "direct_threat": {
                "score": round(
                    direct_threat_score,
                    2
                ),
                "weight": 45,
                "contribution": round(
                    direct_contribution,
                    2
                ),
            },

            "harmful_category": {
                "score": round(
                    harmful_category_score,
                    2
                ),
                "weight": 15,
                "contribution": round(
                    harmful_contribution,
                    2
                ),
            },

            "toxicity": {
                "score": round(
                    toxicity_score,
                    2
                ),
                "weight": 20,
                "contribution": round(
                    toxicity_contribution,
                    2
                ),
            },

            "hate_speech": {
                "score": round(
                    hate_speech_score,
                    2
                ),
                "weight": 15,
                "contribution": round(
                    hate_contribution,
                    2
                ),
            },

            "negative_sentiment": {
                "score": round(
                    negative_sentiment_score,
                    2
                ),
                "weight": 5,
                "contribution": round(
                    sentiment_contribution,
                    2
                ),
            },
        },
    }