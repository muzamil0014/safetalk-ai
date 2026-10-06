# ============================================================
# SAFETALK AI
# SENTIMENT MODEL SERVICE
# ============================================================

from pathlib import Path
import json

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
    / "sentiment_model"
)

LABELS_FILE = (
    MODEL_DIR
    / "labels.json"
)


# ============================================================
# CHECK MODEL FOLDER
# ============================================================

if not MODEL_DIR.exists():

    raise FileNotFoundError(
        f"Sentiment model folder not found: {MODEL_DIR}"
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
# LOAD LABELS
# ============================================================

if LABELS_FILE.exists():

    with open(
        LABELS_FILE,
        "r",
        encoding="utf-8",
    ) as file:

        LABELS = json.load(
            file
        )

else:

    LABELS = {
        "0": "Negative",
        "1": "Neutral",
        "2": "Positive",
    }


# ============================================================
# LOAD TOKENIZER
# ============================================================

print()
print("=" * 70)
print("SAFETALK AI - SENTIMENT MODEL")
print("=" * 70)

print(
    "Model Path:",
    MODEL_DIR
)

print(
    "Device:",
    DEVICE
)

print(
    "Loading tokenizer..."
)


TOKENIZER = AutoTokenizer.from_pretrained(
    str(MODEL_DIR),
    local_files_only=True,
)


# ============================================================
# LOAD MODEL
# ============================================================

print(
    "Loading sentiment model..."
)


MODEL = (
    AutoModelForSequenceClassification
    .from_pretrained(
        str(MODEL_DIR),
        local_files_only=True,
    )
)


MODEL.to(
    DEVICE
)

MODEL.eval()


print(
    "✅ Sentiment model loaded successfully"
)


# ============================================================
# SETTINGS
# ============================================================

MAX_LENGTH = 128


# ============================================================
# PREDICT SENTIMENT
# ============================================================

def predict_sentiment(
    text: str,
):

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if text is None:

        text = ""


    text = str(
        text
    ).strip()


    if not text:

        return {

            "label":
                "Neutral",

            "confidence":
                0.0,

            "scores": {

                "Negative":
                    0.0,

                "Neutral":
                    0.0,

                "Positive":
                    0.0,

            },

            "device":
                str(
                    DEVICE
                ),

        }


    # --------------------------------------------------------
    # TOKENIZE
    # --------------------------------------------------------

    inputs = TOKENIZER(

        text,

        return_tensors="pt",

        truncation=True,

        padding=True,

        max_length=MAX_LENGTH,

    )


    # --------------------------------------------------------
    # MOVE INPUTS TO DEVICE
    # --------------------------------------------------------

    inputs = {

        key:
            value.to(
                DEVICE
            )

        for key, value
        in inputs.items()

    }


    # --------------------------------------------------------
    # MODEL INFERENCE
    # --------------------------------------------------------

    with torch.no_grad():

        outputs = MODEL(
            **inputs
        )


    # --------------------------------------------------------
    # SOFTMAX
    # --------------------------------------------------------

    probabilities = torch.softmax(

        outputs.logits,

        dim=-1,

    )[0]


    # --------------------------------------------------------
    # PREDICTED CLASS
    # --------------------------------------------------------

    predicted_id = int(

        torch.argmax(
            probabilities
        ).item()

    )


    predicted_label = LABELS.get(

        str(
            predicted_id
        ),

        str(
            predicted_id
        ),

    )


    confidence = float(

        probabilities[
            predicted_id
        ].item()

    )


    # --------------------------------------------------------
    # ALL SCORES
    # --------------------------------------------------------

    scores = {}


    for index in range(
        len(
            probabilities
        )
    ):

        label_name = LABELS.get(

            str(
                index
            ),

            str(
                index
            ),

        )


        probability = float(

            probabilities[
                index
            ].item()

        )


        scores[
            label_name
        ] = round(

            probability
            * 100,

            2,

        )


    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "label":
            predicted_label,

        "confidence":
            round(
                confidence
                * 100,
                2,
            ),

        "scores":
            scores,

        "device":
            str(
                DEVICE
            ),

    }


# ============================================================
# SENTIMENT MODEL INFO
# ============================================================

def get_sentiment_model_info():

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

        "max_length":
            MAX_LENGTH,

    }