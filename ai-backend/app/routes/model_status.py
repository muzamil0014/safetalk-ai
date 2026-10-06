# ============================================================
# SAFETALK AI
# MODEL STATUS API
# ============================================================

from pathlib import Path

from fastapi import APIRouter


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/models",
    tags=["Model Management"],
)


# ============================================================
# PROJECT PATHS
# ============================================================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parents[2]
)

MODELS_DIR = (
    BASE_DIR /
    "models"
)


# ============================================================
# CHECK MODEL FILES
# ============================================================

def model_exists(
    folder_name: str
) -> bool:

    model_path = (
        MODELS_DIR /
        folder_name
    )

    if not model_path.exists():
        return False

    if not model_path.is_dir():
        return False

    possible_files = [
        "config.json",
        "model.safetensors",
        "pytorch_model.bin",
        "tokenizer.json",
        "tokenizer_config.json",
    ]

    return any(
        (
            model_path /
            file_name
        ).exists()
        for file_name
        in possible_files
    )


# ============================================================
# MODEL STATUS
# ============================================================

@router.get(
    "/status"
)
def get_model_status():

    # ========================================================
    # CHECK REAL MODEL FOLDERS
    # ========================================================

    sentiment_active = model_exists(
        "sentiment_model"
    )

    threat_active = model_exists(
        "threat_model"
    )

    toxicity_active = model_exists(
        "toxicity_model"
    )

    hate_active = model_exists(
        "hate_speech_model"
    )


    # ========================================================
    # MODEL INFORMATION
    # ========================================================

    models = [


        # ====================================================
        # SENTIMENT MODEL
        # ====================================================

        {
            "id":
                "sentiment",

            "name":
                "Sentiment Model",

            "description":
                "Positive, Negative and Neutral classification.",

            "status":
                (
                    "Active"
                    if sentiment_active
                    else "Unavailable"
                ),

            "loaded":
                sentiment_active,

            "base_model":
                "XLM-RoBERTa",

            "version":
                "v1.0",

            "task":
                "3-Class Classification",

            "accuracy":
                72.94,

            "f1":
                72.81,

            "macro_f1":
                72.81,

            "languages":
                [
                    "Multilingual"
                ],

            "model_path":
                "models/sentiment_model",
        },


        # ====================================================
        # THREAT MODEL
        # ====================================================

        {
            "id":
                "threat",

            "name":
                "Threat Classification Model",

            "description":
                "Multi-label threat category detection.",

            "status":
                (
                    "Active"
                    if threat_active
                    else "Unavailable"
                ),

            "loaded":
                threat_active,

            "base_model":
                "XLM-RoBERTa",

            "version":
                "v1.0",

            "task":
                "Multi-Label Classification",

            "accuracy":
                None,

            "f1":
                86.18,

            "micro_f1":
                86.18,

            "macro_f1":
                55.48,

            "labels":
                8,

            "languages":
                [
                    "Multilingual"
                ],

            "model_path":
                "models/threat_model",
        },


        # ====================================================
        # TOXICITY MODEL
        # ====================================================

        {
            "id":
                "toxicity",

            "name":
                "Toxicity Model",

            "description":
                "Detect toxic and abusive content.",

            "status":
                (
                    "Active"
                    if toxicity_active
                    else "Unavailable"
                ),

            "loaded":
                toxicity_active,

            "base_model":
                "XLM-RoBERTa",

            "version":
                "v1.0",

            "task":
                "Binary Classification",

            "accuracy":
                96.03,

            "f1":
                90.96,

            "macro_f1":
                90.96,

            "precision_macro":
                90.05,

            "recall_macro":
                91.94,

            "weighted_f1":
                96.08,

            "languages":
                [
                    "English",
                    "Roman Urdu",
                ],

            "model_path":
                "models/toxicity_model",
        },


        # ====================================================
        # HATE SPEECH MODEL
        # ====================================================

        {
            "id":
                "hate-speech",

            "name":
                "Hate Speech Model",

            "description":
                "Identify hate speech related content.",

            "status":
                (
                    "Active"
                    if hate_active
                    else "Unavailable"
                ),

            "loaded":
                hate_active,

            "base_model":
                "XLM-RoBERTa",

            "version":
                "v1.0",

            "task":
                "Binary Classification",

            "accuracy":
                96.29,

            "f1":
                88.82,

            "macro_f1":
                88.82,

            "precision_macro":
                85.92,

            "recall_macro":
                92.40,

            "weighted_f1":
                96.45,

            "languages":
                [
                    "English",
                    "Urdu",
                    "Roman Urdu",
                ],

            "model_path":
                "models/hate_speech_model",
        },


        # ====================================================
        # LANGUAGE DETECTION
        # ====================================================

        {
            "id":
                "language",

            "name":
                "Language Detection",

            "description":
                "English, Urdu and Roman Urdu detection.",

            "status":
                "Active",

            "loaded":
                True,

            "base_model":
                "Rule-Based Logic",

            "version":
                "v1.0",

            "task":
                "Language Detection",

            "accuracy":
                None,

            "f1":
                None,

            "languages":
                [
                    "English",
                    "Urdu",
                    "Roman Urdu",
                ],

            "model_path":
                "app/services/language_service.py",
        },

    ]


    # ========================================================
    # SUMMARY
    # ========================================================

    active_models = sum(
        1
        for model
        in models
        if model["loaded"]
    )

    trained_models = sum(
        1
        for model
        in models[:4]
        if model["loaded"]
    )

    unavailable_models = sum(
        1
        for model
        in models[:4]
        if not model["loaded"]
    )


    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "success":
            True,

        "summary": {

            "total_models":
                len(models),

            "trained_models":
                trained_models,

            "active_models":
                active_models,

            "unavailable_models":
                unavailable_models,

            "base_model":
                "XLM-RoBERTa",
        },

        "models":
            models,
    }