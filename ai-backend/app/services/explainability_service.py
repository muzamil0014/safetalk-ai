# ============================================================
# SAFETALK AI
# EXPLAINABLE AI SERVICE
# ============================================================
#
# PURPOSE:
# - Important words / phrases
# - Human-readable reasons
# - Model evidence summary
# - Multilingual support:
#   English
#   Roman Urdu
#   Urdu
#
# NOTE:
# This is an explanation layer built from:
# - model outputs
# - final threat labels
# - semantic evidence
# - transparent phrase matching
#
# It does NOT claim token-level causal attribution.
# ============================================================

import re
from typing import Dict, Any, List


# ============================================================
# THREAT DISPLAY NAMES
# ============================================================

THREAT_LABEL_NAMES = {
    "physical_threat": "Physical Threat",
    "death_threat": "Death Threat",
    "harassment": "Harassment",
    "abusive_language": "Abusive Language",
    "cyber_threat": "Cyber Threat",
    "hate_speech": "Hate Speech",
    "sexual_threat": "Sexual Threat",
    "self_harm": "Self-Harm Related",
}


# ============================================================
# EXPLAINABILITY PHRASES
# ============================================================

EXPLANATION_PATTERNS = {

    # ========================================================
    # DEATH THREAT
    # ========================================================

    "Death Threat": [

        # English
        r"\bkill\s+you\b",
        r"\bkill\s+him\b",
        r"\bkill\s+her\b",
        r"\bmurder\s+you\b",
        r"\bshoot\s+you\b",
        r"\bstab\s+you\b",
        r"\byou\s+will\s+die\b",

        # Roman Urdu
        r"\bmaar\s+dunga\b",
        r"\bmar\s+dunga\b",
        r"\bmaar\s+dongi\b",
        r"\bmar\s+dongi\b",
        r"\bjaan\s+se\s+maar\b",
        r"\bjan\s+se\s+mar\b",

        # Urdu
        r"جان سے مار",
        r"قتل",
        r"مار دوں",
        r"مار دوں گا",
        r"مار دوں گی",
    ],


    # ========================================================
    # PHYSICAL THREAT
    # ========================================================

    "Physical Threat": [

        # English
        r"\bbeat\s+you\b",
        r"\bhit\s+you\b",
        r"\bpunch\s+you\b",
        r"\bhurt\s+you\b",
        r"\bbreak\s+your\b",

        # Roman Urdu
        r"\bmaarunga\b",
        r"\bmarunga\b",
        r"\bpitai\b",
        r"\bpeetunga\b",
        r"\btod\s+dunga\b",

        # Urdu
        r"ماروں گا",
        r"ماروں گی",
        r"پیٹوں گا",
        r"توڑ دوں",
    ],


    # ========================================================
    # CYBER THREAT
    # ========================================================

    "Cyber Threat": [

        # English
        r"\bhack\s+your\b",
        r"\bhack\s+you\b",
        r"\bhack\s+account\b",
        r"\bleak\s+your\b",
        r"\bsteal\s+your\s+password\b",
        r"\bdelete\s+your\s+account\b",

        # Roman Urdu
        r"\baccount\s+hack\b",
        r"\bhack\s+kar\b",
        r"\bhack\s+karunga\b",
        r"\bhack\s+kar\s+dunga\b",
        r"\bpassword\s+chura\b",
        r"\baccount\s+ura\b",

        # Urdu
        r"اکاؤنٹ ہیک",
        r"ہیک کر",
        r"پاس ورڈ چوری",
    ],


    # ========================================================
    # SELF HARM
    # ========================================================

    "Self-Harm Related": [

        # English
        r"\bkill\s+myself\b",
        r"\bhurt\s+myself\b",
        r"\bend\s+my\s+life\b",
        r"\bsuicide\b",

        # Roman Urdu
        r"\bkhud\s+ko\s+maar\b",
        r"\bkhud\s+ko\s+mar\b",
        r"\bapni\s+jaan\b",
        r"\bsuicide\b",

        # Urdu
        r"خود کو مار",
        r"اپنی جان",
        r"خودکشی",
    ],


    # ========================================================
    # HARASSMENT
    # ========================================================

    "Harassment": [

        # English
        r"\bstupid\b",
        r"\bidiot\b",
        r"\bloser\b",
        r"\bshut\s+up\b",
        r"\bgo\s+away\b",

        # Roman Urdu
        r"\bpagal\b",
        r"\bbewakoof\b",
        r"\bnikal\b",
        r"\bchup\s+kar\b",

        # Urdu
        r"بے وقوف",
        r"پاگل",
        r"چپ کرو",
    ],


    # ========================================================
    # ABUSIVE LANGUAGE
    # ========================================================

    "Abusive Language": [

        # English
        r"\bshit\b",
        r"\bfuck\b",
        r"\basshole\b",
        r"\bbitch\b",
        r"\bbastard\b",

        # Roman Urdu
        r"\bharami\b",
        r"\bkameena\b",
        r"\bkamina\b",
        r"\bkutta\b",
        r"\bkutiya\b",
        r"\bghatiya\b",

        # Urdu
        r"حرامی",
        r"کمینہ",
        r"کتا",
        r"گھٹیا",
    ],


    # ========================================================
    # HATE SPEECH
    # ========================================================

    "Hate Speech": [

        r"\bhate\s+all\b",
        r"\bthose\s+people\b",
        r"\bpeople\s+like\s+you\b",

        r"\bsab\s+se\s+nafrat\b",
        r"\bnafrat\b",

        r"نفرت",
    ],


    # ========================================================
    # SEXUAL THREAT
    # ========================================================

    "Sexual Threat": [

        r"\bforce\s+you\b",
        r"\bsexually\b",
        r"\brape\b",

        r"\bzabardasti\b",

        r"زبردستی",
        r"جنسی",
    ],
}


# ============================================================
# CLEAN TEXT
# ============================================================

def clean_text(text: str) -> str:

    text = str(
        text or ""
    ).strip()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text


# ============================================================
# UNIQUE LIST
# ============================================================

def unique_list(
    values: List[str]
) -> List[str]:

    seen = set()

    output = []

    for value in values:

        value = str(
            value
        ).strip()

        if not value:
            continue

        key = value.lower()

        if key in seen:
            continue

        seen.add(
            key
        )

        output.append(
            value
        )

    return output


# ============================================================
# FIND MATCHING PHRASES
# ============================================================

def find_matching_phrases(
    text: str,
    category: str
) -> List[str]:

    patterns = (
        EXPLANATION_PATTERNS.get(
            category,
            []
        )
    )

    matches = []

    for pattern in patterns:

        found = re.finditer(
            pattern,
            text,
            flags=re.IGNORECASE
        )

        for match in found:

            phrase = (
                match.group(0)
                .strip()
            )

            if phrase:
                matches.append(
                    phrase
                )

    return unique_list(
        matches
    )


# ============================================================
# NORMALIZE SEMANTIC EVIDENCE
# ============================================================

def normalize_semantic_evidence(
    threat_result: Dict[str, Any]
) -> List[str]:

    evidence = (
        threat_result.get(
            "semantic_evidence",
            []
        )
    )

    if not evidence:
        return []

    if isinstance(
        evidence,
        list
    ):

        values = []

        for item in evidence:

            if isinstance(
                item,
                str
            ):
                values.append(
                    item
                )

            elif isinstance(
                item,
                dict
            ):

                for value in (
                    item.values()
                ):

                    if isinstance(
                        value,
                        str
                    ):
                        values.append(
                            value
                        )

                    elif isinstance(
                        value,
                        list
                    ):

                        values.extend(
                            [
                                str(x)
                                for x in value
                            ]
                        )

        return unique_list(
            values
        )

    if isinstance(
        evidence,
        dict
    ):

        values = []

        for value in (
            evidence.values()
        ):

            if isinstance(
                value,
                str
            ):
                values.append(
                    value
                )

            elif isinstance(
                value,
                list
            ):
                values.extend(
                    [
                        str(x)
                        for x in value
                    ]
                )

        return unique_list(
            values
        )

    return []


# ============================================================
# GET PRIMARY THREAT CONFIDENCE
# ============================================================

def get_primary_threat_confidence(
    threat_result: Dict[str, Any]
) -> float:

    primary = (
        threat_result.get(
            "primary_threat",
            ""
        )
        or ""
    )

    scores = (
        threat_result.get(
            "scores",
            {}
        )
    )

    for key, display_name in (
        THREAT_LABEL_NAMES.items()
    ):

        if (
            display_name ==
            primary
        ):

            return round(
                float(
                    scores
                    .get(
                        key,
                        {}
                    )
                    .get(
                        "percentage",
                        0
                    )
                    or 0
                ),
                2
            )

    return 0.0


# ============================================================
# GET IMPORTANT PHRASES
# ============================================================

def get_important_phrases(
    text: str,
    threat_result: Dict[str, Any],
    hate_speech_result: Dict[str, Any],
    toxicity_result: Dict[str, Any],
) -> List[str]:

    important = []

    primary = (
        threat_result.get(
            "primary_threat",
            ""
        )
        or ""
    )

    active_labels = (
        threat_result.get(
            "active_labels",
            []
        )
        or []
    )

    # ========================================================
    # PRIMARY CATEGORY PHRASES
    # ========================================================

    if (
        primary
        and
        primary != "No Threat"
    ):

        important.extend(
            find_matching_phrases(
                text,
                primary
            )
        )


    # ========================================================
    # ACTIVE CATEGORY PHRASES
    # ========================================================

    for category in (
        active_labels
    ):

        important.extend(
            find_matching_phrases(
                text,
                category
            )
        )


    # ========================================================
    # SEMANTIC EVIDENCE
    # ========================================================

    important.extend(
        normalize_semantic_evidence(
            threat_result
        )
    )


    # ========================================================
    # DEDICATED HATE SPEECH
    # ========================================================

    if int(
        hate_speech_result.get(
            "is_hate_speech",
            0
        )
        or 0
    ) == 1:

        important.extend(
            find_matching_phrases(
                text,
                "Hate Speech"
            )
        )


    # ========================================================
    # TOXICITY
    # ========================================================

    if int(
        toxicity_result.get(
            "is_toxic",
            0
        )
        or 0
    ) == 1:

        important.extend(
            find_matching_phrases(
                text,
                "Abusive Language"
            )
        )

        important.extend(
            find_matching_phrases(
                text,
                "Harassment"
            )
        )


    # ========================================================
    # FALLBACK
    # ========================================================

    important = unique_list(
        important
    )

    return important[:12]


# ============================================================
# BUILD REASONS
# ============================================================

def build_reasons(
    threat_result: Dict[str, Any],
    sentiment_result: Dict[str, Any],
    toxicity_result: Dict[str, Any],
    hate_speech_result: Dict[str, Any],
    risk_result: Dict[str, Any],
    language_result: Dict[str, Any],
) -> List[str]:

    reasons = []

    is_threat = int(
        threat_result.get(
            "is_threat",
            0
        )
        or 0
    )

    primary = (
        threat_result.get(
            "primary_threat",
            "No Threat"
        )
        or "No Threat"
    )

    primary_confidence = (
        get_primary_threat_confidence(
            threat_result
        )
    )

    sentiment_label = (
        sentiment_result.get(
            "label",
            "Unknown"
        )
    )

    sentiment_confidence = (
        sentiment_result.get(
            "confidence",
            0
        )
    )

    toxicity_label = (
        toxicity_result.get(
            "label",
            "Unknown"
        )
    )

    toxicity_confidence = (
        toxicity_result.get(
            "confidence",
            0
        )
    )

    hate_label = (
        hate_speech_result.get(
            "label",
            "Unknown"
        )
    )

    hate_confidence = (
        hate_speech_result.get(
            "confidence",
            0
        )
    )

    risk_score = (
        risk_result.get(
            "score",
            0
        )
    )

    risk_level = (
        risk_result.get(
            "level",
            "Low"
        )
    )

    language_label = (
        language_result.get(
            "label",
            "Unknown"
        )
    )


    # ========================================================
    # LANGUAGE
    # ========================================================

    reasons.append(
        (
            f"Language identified as "
            f"{language_label}."
        )
    )


    # ========================================================
    # THREAT
    # ========================================================

    if (
        primary !=
        "No Threat"
    ):

        reasons.append(
            (
                f"Primary category is "
                f"{primary} with "
                f"{primary_confidence:.2f}% "
                f"model confidence."
            )
        )

    elif is_threat == 0:

        reasons.append(
            "No direct threat category was detected."
        )


    # ========================================================
    # SENTIMENT
    # ========================================================

    reasons.append(
        (
            f"Sentiment model classified the text as "
            f"{sentiment_label} with "
            f"{float(sentiment_confidence):.2f}% confidence."
        )
    )


    # ========================================================
    # TOXICITY
    # ========================================================

    reasons.append(
        (
            f"Toxicity model classified the text as "
            f"{toxicity_label} with "
            f"{float(toxicity_confidence):.2f}% confidence."
        )
    )


    # ========================================================
    # HATE SPEECH
    # ========================================================

    reasons.append(
        (
            f"Hate-speech model classified the text as "
            f"{hate_label} with "
            f"{float(hate_confidence):.2f}% confidence."
        )
    )


    # ========================================================
    # RISK
    # ========================================================

    reasons.append(
        (
            f"Combined risk is "
            f"{risk_level} "
            f"({risk_score}/100)."
        )
    )

    return reasons


# ============================================================
# BUILD SUMMARY
# ============================================================

def build_summary(
    threat_result: Dict[str, Any],
    sentiment_result: Dict[str, Any],
    toxicity_result: Dict[str, Any],
    hate_speech_result: Dict[str, Any],
    risk_result: Dict[str, Any],
    language_result: Dict[str, Any],
) -> str:

    primary = (
        threat_result.get(
            "primary_threat",
            "No Threat"
        )
        or
        "No Threat"
    )

    is_threat = int(
        threat_result.get(
            "is_threat",
            0
        )
        or 0
    )

    sentiment = (
        sentiment_result.get(
            "label",
            "Unknown"
        )
    )

    toxicity = (
        toxicity_result.get(
            "label",
            "Unknown"
        )
    )

    hate = (
        hate_speech_result.get(
            "label",
            "Unknown"
        )
    )

    risk_level = (
        risk_result.get(
            "level",
            "Low"
        )
    )

    risk_score = (
        risk_result.get(
            "score",
            0
        )
    )

    language = (
        language_result.get(
            "label",
            "Unknown"
        )
    )


    if is_threat == 1:

        return (
            f"SafeTalkAI detected {primary} in "
            f"{language} text. "
            f"The text was classified as "
            f"{sentiment} sentiment, "
            f"{toxicity}, and {hate}. "
            f"The combined risk level is "
            f"{risk_level} with a score of "
            f"{risk_score}/100."
        )


    if (
        primary !=
        "No Threat"
    ):

        return (
            f"SafeTalkAI detected harmful content "
            f"related to {primary}, but no direct "
            f"threat was confirmed. "
            f"The text is {language}, "
            f"with {sentiment} sentiment, "
            f"{toxicity}, and {hate}. "
            f"The combined risk is "
            f"{risk_level} ({risk_score}/100)."
        )


    return (
        f"SafeTalkAI did not detect a direct "
        f"threat in this {language} text. "
        f"The text was classified as "
        f"{sentiment} sentiment, "
        f"{toxicity}, and {hate}. "
        f"The combined risk is "
        f"{risk_level} ({risk_score}/100)."
    )


# ============================================================
# BUILD MODEL EVIDENCE
# ============================================================

def build_model_evidence(
    threat_result: Dict[str, Any],
    sentiment_result: Dict[str, Any],
    toxicity_result: Dict[str, Any],
    hate_speech_result: Dict[str, Any],
    risk_result: Dict[str, Any],
    language_result: Dict[str, Any],
) -> Dict[str, Any]:

    return {

        "language": {
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
        },


        "threat": {
            "is_threat":
                threat_result.get(
                    "is_threat",
                    0
                ),

            "primary_category":
                threat_result.get(
                    "primary_threat",
                    "No Threat"
                ),

            "confidence":
                get_primary_threat_confidence(
                    threat_result
                ),

            "active_labels":
                threat_result.get(
                    "active_labels",
                    []
                ),
        },


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
        },


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

            "is_toxic":
                toxicity_result.get(
                    "is_toxic",
                    0
                ),
        },


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

            "is_hate_speech":
                hate_speech_result.get(
                    "is_hate_speech",
                    0
                ),
        },


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
        },
    }


# ============================================================
# MAIN EXPLAIN FUNCTION
# ============================================================

def explain_prediction(
    text: str,
    threat_result: Dict[str, Any],
    sentiment_result: Dict[str, Any],
    toxicity_result: Dict[str, Any],
    hate_speech_result: Dict[str, Any],
    risk_result: Dict[str, Any],
    language_result: Dict[str, Any],
) -> Dict[str, Any]:

    text = clean_text(
        text
    )


    important_phrases = (
        get_important_phrases(
            text=text,
            threat_result=
                threat_result,
            hate_speech_result=
                hate_speech_result,
            toxicity_result=
                toxicity_result,
        )
    )


    reasons = (
        build_reasons(
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


    summary = (
        build_summary(
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


    model_evidence = (
        build_model_evidence(
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


    return {

        "important_phrases":
            important_phrases,

        "summary":
            summary,

        "reasons":
            reasons,

        "model_evidence":
            model_evidence,

        "method":
            (
                "Model outputs + semantic evidence "
                "+ multilingual phrase matching"
            ),
    }