# ============================================================
# SAFETALK AI
# THREAT MODEL SERVICE
#
# REAL MULTI-LABEL MODEL
# + DIRECT THREAT CONFLICT CLEANUP
# + SMART PRIMARY CATEGORY SELECTION
# + ABUSIVE / PROFANITY PRIMARY OVERRIDE
#
# IMPORTANT:
# Model probabilities, thresholds and predictions are NOT
# changed by the abusive-language primary rule.
#
# Only primary_threat display selection is improved.
# ============================================================


from pathlib import Path

import json
import re

import torch

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
    .parent
)


MODEL_DIR = (
    BASE_DIR
    / "models"
    / "threat_model"
)


THRESHOLDS_FILE = (
    MODEL_DIR
    / "thresholds.json"
)


LABELS_FILE = (
    MODEL_DIR
    / "labels.json"
)


# ============================================================
# DEVICE
# ============================================================

DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


# ============================================================
# REQUIRED FILES
# ============================================================

required_files = [

    MODEL_DIR
    / "config.json",

    MODEL_DIR
    / "model.safetensors",

    MODEL_DIR
    / "tokenizer.json",

    THRESHOLDS_FILE,

    LABELS_FILE,

]


for file_path in required_files:

    if not file_path.exists():

        raise FileNotFoundError(
            f"Required model file not found: {file_path}"
        )


# ============================================================
# LOAD LABELS
# ============================================================

with open(
    LABELS_FILE,
    "r",
    encoding="utf-8",
) as file:

    LABELS = json.load(
        file
    )


# ============================================================
# NORMALIZE LABELS
#
# Supports either:
#
# [
#   "physical_threat",
#   ...
# ]
#
# OR
#
# {
#   "0": "physical_threat",
#   ...
# }
# ============================================================

if isinstance(
    LABELS,
    dict,
):

    LABELS = [

        LABELS[key]

        for key in sorted(
            LABELS.keys(),
            key=lambda item:
                int(item)
                if str(item).isdigit()
                else str(item)
        )

    ]


# ============================================================
# LOAD THRESHOLDS
# ============================================================

with open(
    THRESHOLDS_FILE,
    "r",
    encoding="utf-8",
) as file:

    THRESHOLDS = json.load(
        file
    )


# ============================================================
# LOAD TOKENIZER
# ============================================================

tokenizer = (
    AutoTokenizer
    .from_pretrained(
        str(
            MODEL_DIR
        ),
        local_files_only=True,
    )
)


# ============================================================
# LOAD MODEL
# ============================================================

model = (
    AutoModelForSequenceClassification
    .from_pretrained(
        str(
            MODEL_DIR
        ),
        local_files_only=True,
    )
)


model.to(
    DEVICE
)


model.eval()


print()
print("=" * 70)
print("SAFETALK AI - THREAT MODEL")
print("=" * 70)
print("Model:", MODEL_DIR)
print("Device:", DEVICE)
print("Labels:", LABELS)
print("✅ Threat model loaded successfully")


# ============================================================
# DISPLAY NAMES
# ============================================================

DISPLAY_NAMES = {

    "physical_threat":
        "Physical Threat",

    "death_threat":
        "Death Threat",

    "harassment":
        "Harassment",

    "abusive_language":
        "Abusive Language",

    "cyber_threat":
        "Cyber Threat",

    "hate_speech":
        "Hate Speech",

    "sexual_threat":
        "Sexual Threat",

    "self_harm":
        "Self-Harm Related",

}


# ============================================================
# DIRECT THREAT LABELS
#
# These determine is_threat.
#
# Harassment / abuse / hate can still be detected,
# but do not automatically mean direct physical threat.
# ============================================================

DIRECT_THREAT_LABELS = [

    "physical_threat",

    "death_threat",

    "cyber_threat",

    "sexual_threat",

    "self_harm",

]


# ============================================================
# SEMANTIC EVIDENCE PATTERNS
#
# Used ONLY for conflict cleanup between direct-threat labels.
#
# They do not replace the AI model.
# ============================================================

EVIDENCE_PATTERNS = {


    # ========================================================
    # DEATH THREAT
    # ========================================================

    "death_threat": [

        # English

        r"\bkill you\b",
        r"\bi will kill\b",
        r"\bmurder\b",
        r"\bshoot you\b",
        r"\byou will die\b",
        r"\bmake you dead\b",
        r"\bend your life\b",

        # Roman Urdu

        r"\bjaan se mar",
        r"\bjaan se maar",
        r"\bqatal\b",
        r"\bqatl\b",
        r"\bmaar dunga\b",
        r"\bmar dunga\b",
        r"\bmaar dungi\b",
        r"\bmar dungi\b",
        r"\bmaar dal",
        r"\bmar dal",
        r"\bzinda nahi chor",

        # Urdu

        r"جان سے مار",
        r"قتل",
        r"مار دوں",
        r"مار ڈال",
        r"زندہ نہیں چھوڑ",

    ],


    # ========================================================
    # PHYSICAL THREAT
    # ========================================================

    "physical_threat": [

        # English

        r"\bbeat you\b",
        r"\bpunch you\b",
        r"\bhit you\b",
        r"\bkick you\b",
        r"\bbreak your\b",
        r"\bhurt you\b",
        r"\battack you\b",

        # Roman Urdu

        r"\bpeet",
        r"\bpit",
        r"\bmukka\b",
        r"\bthappar\b",
        r"\blaat\b",
        r"\bhaddiyan tor",
        r"\bzakhmi\b",
        r"\bhamla\b",

        # Urdu

        r"پیٹ",
        r"مکا",
        r"تھپڑ",
        r"لات",
        r"ہڈیاں توڑ",
        r"زخمی",
        r"حملہ",

    ],


    # ========================================================
    # CYBER THREAT
    # ========================================================

    "cyber_threat": [

        # English / Roman Urdu

        r"\bhack\b",
        r"\bhacked\b",
        r"\bpassword\b",
        r"\baccount\b.*\bhack\b",
        r"\bdata\b.*\bleak\b",
        r"\bphotos?\b.*\bleak\b",
        r"\bprivate\b.*\bleak\b",
        r"\bemail\b.*\bhack\b",

        # Urdu

        r"ہیک",
        r"پاس ورڈ",
        r"اکاؤنٹ",
        r"ڈیٹا لیک",
        r"تصاویر لیک",
        r"معلومات لیک",

    ],


    # ========================================================
    # SEXUAL THREAT
    # ========================================================

    "sexual_threat": [

        # English / Roman Urdu

        r"\bsexual attack\b",
        r"\bsexual violence\b",
        r"\bsexual harm\b",
        r"\bforce.*sex\b",
        r"\bzabardasti.*sex\b",
        r"\bzabardasti.*touch\b",
        r"\bsexual threat\b",

        # Urdu

        r"جنسی حمل",
        r"جنسی تشدد",
        r"جنسی نقصان",
        r"زبردستی.*جنسی",
        r"زبردستی.*چھو",

    ],


    # ========================================================
    # SELF-HARM
    # ========================================================

    "self_harm": [

        # English

        r"\bkill myself\b",
        r"\bhurt myself\b",
        r"\bself[\s-]?harm\b",
        r"\bsuicide\b",
        r"\bend my life\b",
        r"\bdon't want to live\b",
        r"\bdo not want to live\b",

        # Roman Urdu

        r"\bkhud ko mar",
        r"\bkhud ko maar",
        r"\bapni jaan le",
        r"\bsuicide\b",
        r"\bzinda nahi rehna\b",
        r"\bapni zindagi khatam\b",
        r"\bapni life khatam\b",

        # Urdu

        r"خود کو مار",
        r"اپنی جان لے",
        r"خودکشی",
        r"زندہ نہیں رہنا",
        r"اپنی زندگی ختم",
        r"خود کو نقصان",

    ],

}


# ============================================================
# EXPLICIT ABUSIVE / PROFANITY PATTERNS
#
# Used only to decide:
#
# Harassment vs Abusive Language
#
# when BOTH have already been detected by the model.
#
# These rules DO NOT create an abusive prediction themselves.
# ============================================================

ABUSIVE_PATTERNS = [

    # ========================================================
    # ENGLISH
    # ========================================================

    r"\bfuck you\b",
    r"\bfucking\b",
    r"\bfuck off\b",
    r"\bpiece of shit\b",
    r"\bshithead\b",
    r"\bbullshit\b",
    r"\basshole\b",
    r"\bbastard\b",
    r"\bmotherfucker\b",
    r"\bson of a bitch\b",
    r"\bbitch\b",
    r"\bdickhead\b",
    r"\bprick\b",


    # ========================================================
    # ROMAN URDU / COMMON SOUTH ASIAN PROFANITY
    # ========================================================

    r"\bharami\b",
    r"\bharamzada\b",
    r"\bharamzade\b",

    r"\bkamina\b",
    r"\bkameena\b",
    r"\bkameeni\b",

    r"\bkanjar\b",

    r"\bchutiya\b",
    r"\bchutia\b",

    r"\bmadarchod\b",
    r"\bmadar chod\b",

    r"\bbehenchod\b",
    r"\bbhenchod\b",
    r"\bbehnchod\b",

    r"\bteri maa ki\b",
    r"\bteri ma ki\b",

    r"\bmaa ki\b",

    r"\bgaand\b",

]


# ============================================================
# NORMALIZE TEXT
# ============================================================

def normalize_text(
    text: str,
):

    text = str(
        text
    )

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text.strip()


# ============================================================
# FIND SEMANTIC EVIDENCE
# ============================================================

def find_semantic_evidence(
    text: str,
):

    text_lower = (
        normalize_text(
            text
        )
    )


    evidence = []


    for (
        label,
        patterns
    ) in EVIDENCE_PATTERNS.items():


        for pattern in patterns:

            if re.search(
                pattern,
                text_lower,
                flags=re.IGNORECASE,
            ):

                evidence.append(
                    label
                )

                break


    return evidence


# ============================================================
# CHECK EXPLICIT ABUSIVE LANGUAGE
# ============================================================

def has_explicit_abusive_language(
    text: str,
):

    text_lower = (
        normalize_text(
            text
        )
    )


    for pattern in ABUSIVE_PATTERNS:

        if re.search(
            pattern,
            text_lower,
            flags=re.IGNORECASE,
        ):

            return True


    return False


# ============================================================
# CLEAN DIRECT THREAT CONFLICTS
# ============================================================

def clean_direct_threat_conflicts(
    text,
    predictions,
    scores,
):

    cleaned = (
        predictions.copy()
    )


    # --------------------------------------------------------
    # CURRENT DIRECT LABELS
    # --------------------------------------------------------

    active_direct = [

        label

        for label
        in DIRECT_THREAT_LABELS

        if cleaned.get(
            label,
            0,
        ) == 1

    ]


    # --------------------------------------------------------
    # NOTHING TO CLEAN
    # --------------------------------------------------------

    if len(
        active_direct
    ) <= 1:

        return cleaned


    # --------------------------------------------------------
    # SEMANTIC EVIDENCE
    # --------------------------------------------------------

    evidence_labels = (
        find_semantic_evidence(
            text
        )
    )


    # ========================================================
    # SPECIAL SELF-HARM PROTECTION
    #
    # Example:
    # "I will kill myself"
    #
    # "kill" should not make Death Threat override
    # explicit self-harm language.
    # ========================================================

    if (
        "self_harm"
        in active_direct
        and
        "self_harm"
        in evidence_labels
    ):

        self_harm_specific_patterns = [

            r"\bkill myself\b",
            r"\bhurt myself\b",
            r"\bself[\s-]?harm\b",
            r"\bsuicide\b",
            r"\bend my life\b",

            r"\bkhud ko mar",
            r"\bkhud ko maar",
            r"\bapni jaan le",
            r"\bzinda nahi rehna\b",

            r"خود کو مار",
            r"اپنی جان لے",
            r"خودکشی",
            r"خود کو نقصان",

        ]


        normalized = (
            normalize_text(
                text
            )
        )


        self_harm_explicit = any(

            re.search(
                pattern,
                normalized,
                flags=re.IGNORECASE,
            )

            for pattern
            in self_harm_specific_patterns

        )


        if self_harm_explicit:

            for label in active_direct:

                if (
                    label
                    != "self_harm"
                ):

                    cleaned[
                        label
                    ] = 0


            return cleaned


    # --------------------------------------------------------
    # EVIDENCE THAT MODEL ALSO PREDICTED
    # --------------------------------------------------------

    supported_labels = [

        label

        for label
        in active_direct

        if label
        in evidence_labels

    ]


    # --------------------------------------------------------
    # KEEP SUPPORTED DIRECT LABELS
    # --------------------------------------------------------

    if supported_labels:

        for label in active_direct:

            if (
                label
                not in supported_labels
            ):

                cleaned[
                    label
                ] = 0


        return cleaned


    # --------------------------------------------------------
    # FALLBACK
    #
    # No clear semantic evidence:
    # keep strongest confidence margin over threshold.
    # --------------------------------------------------------

    def confidence_margin(
        label,
    ):

        probability = float(
            scores[
                label
            ][
                "probability"
            ]
        )


        threshold = float(
            scores[
                label
            ][
                "threshold"
            ]
        )


        return (
            probability
            -
            threshold
        )


    strongest_label = max(

        active_direct,

        key=
            confidence_margin,

    )


    for label in active_direct:

        if (
            label
            != strongest_label
        ):

            cleaned[
                label
            ] = 0


    return cleaned


# ============================================================
# GET ACTIVE INTERNAL LABELS
# ============================================================

def get_active_internal_labels(
    predictions,
):

    return [

        label

        for (
            label,
            prediction
        )
        in predictions.items()

        if prediction == 1

    ]


# ============================================================
# GET STRONGEST LABEL
# ============================================================

def get_strongest_label(
    labels,
    scores,
):

    if not labels:

        return None


    return max(

        labels,

        key=
            lambda label:
                float(
                    scores[
                        label
                    ][
                        "probability"
                    ]
                ),

    )


# ============================================================
# SMART PRIMARY THREAT
#
# PRIORITY:
#
# 1. If a DIRECT threat is detected:
#       direct threat remains primary.
#
# 2. If no direct threat exists,
#    BOTH harassment + abusive_language are active,
#    AND explicit profanity is found:
#       Abusive Language becomes primary.
#
# 3. Otherwise:
#       strongest active model probability wins.
#
# IMPORTANT:
# This changes ONLY primary_threat.
# It does NOT change model predictions or confidence scores.
# ============================================================

def get_primary_threat(
    text,
    predictions,
    scores,
):

    active_labels = (
        get_active_internal_labels(
            predictions
        )
    )


    if not active_labels:

        return "No Threat"


    # ========================================================
    # 1. DIRECT THREAT HAS PRIORITY
    # ========================================================

    active_direct_labels = [

        label

        for label
        in active_labels

        if label
        in DIRECT_THREAT_LABELS

    ]


    if active_direct_labels:

        strongest_direct = (
            get_strongest_label(

                active_direct_labels,

                scores,

            )
        )


        return (
            DISPLAY_NAMES.get(

                strongest_direct,

                strongest_direct,

            )
        )


    # ========================================================
    # 2. PROFANITY / ABUSIVE LANGUAGE PREFERENCE
    #
    # Only applies if AI itself has already detected
    # abusive_language.
    # ========================================================

    abusive_is_active = (

        "abusive_language"
        in active_labels

    )


    harassment_is_active = (

        "harassment"
        in active_labels

    )


    explicit_abuse = (
        has_explicit_abusive_language(
            text
        )
    )


    if (
        abusive_is_active
        and
        explicit_abuse
    ):

        return (
            DISPLAY_NAMES[
                "abusive_language"
            ]
        )


    # ========================================================
    # 3. OTHERWISE STRONGEST MODEL LABEL
    # ========================================================

    strongest_label = (
        get_strongest_label(

            active_labels,

            scores,

        )
    )


    return DISPLAY_NAMES.get(

        strongest_label,

        strongest_label,

    )


# ============================================================
# CALCULATE OVERALL DIRECT THREAT
# ============================================================

def calculate_is_threat(
    predictions,
):

    return int(

        any(

            predictions.get(
                label,
                0,
            ) == 1

            for label
            in DIRECT_THREAT_LABELS

        )

    )


# ============================================================
# PREDICT THREAT
# ============================================================

def predict_threat(
    text: str,
):

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    text = str(
        text
    ).strip()


    if not text:

        raise ValueError(
            "Text cannot be empty."
        )


    # --------------------------------------------------------
    # TOKENIZATION
    # --------------------------------------------------------

    inputs = tokenizer(

        text,

        return_tensors=
            "pt",

        truncation=
            True,

        padding=
            True,

        max_length=
            128,

    )


    # --------------------------------------------------------
    # MOVE TO DEVICE
    # --------------------------------------------------------

    inputs = {

        key:
            value.to(
                DEVICE
            )

        for (
            key,
            value
        )
        in inputs.items()

    }


    # --------------------------------------------------------
    # MODEL INFERENCE
    # --------------------------------------------------------

    with torch.no_grad():

        outputs = model(
            **inputs
        )


    # --------------------------------------------------------
    # SIGMOID PROBABILITIES
    # --------------------------------------------------------

    probabilities = (

        torch.sigmoid(
            outputs.logits
        )

        .cpu()

        .numpy()[0]

    )


    # ========================================================
    # RAW MODEL PREDICTIONS
    # ========================================================

    raw_predictions = {}


    scores = {}


    for (
        label,
        probability
    ) in zip(
        LABELS,
        probabilities,
    ):

        probability = float(
            probability
        )


        threshold = float(

            THRESHOLDS.get(
                label,
                0.50,
            )

        )


        prediction = int(

            probability
            >=
            threshold

        )


        raw_predictions[
            label
        ] = prediction


        scores[
            label
        ] = {

            "probability":
                round(
                    probability,
                    4,
                ),

            "percentage":
                round(
                    probability
                    * 100,
                    2,
                ),

            "threshold":
                round(
                    threshold,
                    4,
                ),

            "raw_prediction":
                prediction,

        }


    # ========================================================
    # DIRECT THREAT CONFLICT CLEANUP
    # ========================================================

    final_predictions = (
        clean_direct_threat_conflicts(

            text=
                text,

            predictions=
                raw_predictions,

            scores=
                scores,

        )
    )


    # ========================================================
    # ADD FINAL PREDICTIONS TO SCORES
    # ========================================================

    for label in LABELS:

        scores[
            label
        ][
            "prediction"
        ] = final_predictions.get(
            label,
            0,
        )


    # ========================================================
    # OVERALL DIRECT THREAT
    # ========================================================

    is_threat = (
        calculate_is_threat(
            final_predictions
        )
    )


    # ========================================================
    # SMART PRIMARY CATEGORY
    # ========================================================

    primary_threat = (
        get_primary_threat(

            text=
                text,

            predictions=
                final_predictions,

            scores=
                scores,

        )
    )


    # ========================================================
    # ACTIVE LABELS
    # ========================================================

    active_labels = [

        DISPLAY_NAMES.get(
            label,
            label,
        )

        for (
            label,
            prediction
        )
        in final_predictions.items()

        if prediction == 1

    ]


    # ========================================================
    # SEMANTIC EVIDENCE
    # ========================================================

    evidence = (
        find_semantic_evidence(
            text
        )
    )


    evidence_names = [

        DISPLAY_NAMES.get(
            label,
            label,
        )

        for label
        in evidence

    ]


    # ========================================================
    # ABUSIVE PRIMARY RULE DEBUG INFO
    # ========================================================

    abusive_primary_override = (

        "abusive_language"
        in final_predictions

        and

        final_predictions.get(
            "abusive_language",
            0,
        ) == 1

        and

        has_explicit_abusive_language(
            text
        )

        and

        not any(

            final_predictions.get(
                label,
                0,
            ) == 1

            for label
            in DIRECT_THREAT_LABELS

        )

    )


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "text":
            text,

        "is_threat":
            is_threat,

        "primary_threat":
            primary_threat,

        "active_labels":
            active_labels,

        # ----------------------------------------------
        # Original model threshold predictions
        # ----------------------------------------------

        "raw_predictions":
            raw_predictions,

        # ----------------------------------------------
        # Final post-processed predictions
        # ----------------------------------------------

        "predictions":
            final_predictions,

        # ----------------------------------------------
        # Confidence values
        # ----------------------------------------------

        "scores":
            scores,

        # ----------------------------------------------
        # Semantic direct-threat evidence
        # ----------------------------------------------

        "semantic_evidence":
            evidence_names,

        # ----------------------------------------------
        # Helpful debug value
        # ----------------------------------------------

        "abusive_primary_override":
            abusive_primary_override,

        "device":
            str(
                DEVICE
            ),

    }


# ============================================================
# MODEL INFORMATION
# ============================================================

def get_threat_model_info():

    return {

        "model_path":
            str(
                MODEL_DIR
            ),

        "device":
            str(
                DEVICE
            ),

        "labels":
            LABELS,

        "thresholds":
            THRESHOLDS,

        "post_processing": {

            "direct_threat_conflict_cleanup":
                True,

            "self_harm_conflict_cleanup":
                True,

            "abusive_primary_preference":
                True,

        },

    }