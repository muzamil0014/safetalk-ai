# ============================================================
# SAFETALK AI
# TOXICITY MODEL SERVICE
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
    / "toxicity_model"
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
# CHECK MODEL
# ============================================================

if not MODEL_DIR.exists():

    raise FileNotFoundError(
        f"Toxicity model folder not found: {MODEL_DIR}"
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
        "0": "Non-Toxic",
        "1": "Toxic",
    }


# ============================================================
# LOAD TOKENIZER
# ============================================================

print()
print("=" * 70)
print("SAFETALK AI - TOXICITY MODEL")
print("=" * 70)

print("Model Path:", MODEL_DIR)
print("Device:", DEVICE)

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


print(
    "✅ Toxicity model loaded successfully"
)


# ============================================================
# SETTINGS
# ============================================================

MAX_LENGTH = 128


# ============================================================
# PREDICT TOXICITY
# ============================================================

def predict_toxicity(
    text: str,
):

    text = str(
        text
    ).strip()


    if not text:

        raise ValueError(
            "Text cannot be empty."
        )


    # --------------------------------------------------------
    # TOKENIZE
    # --------------------------------------------------------

    inputs = tokenizer(

        text,

        return_tensors="pt",

        truncation=True,

        padding=True,

        max_length=MAX_LENGTH,

    )


    inputs = {

        key:
            value.to(
                DEVICE
            )

        for key, value
        in inputs.items()

    }


    # --------------------------------------------------------
    # INFERENCE
    # --------------------------------------------------------

    with torch.no_grad():

        outputs = model(
            **inputs
        )


    probabilities = torch.softmax(

        outputs.logits,

        dim=-1,

    )[0]


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
    # SCORES
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


        scores[
            label_name
        ] = round(

            float(
                probabilities[
                    index
                ].item()
            )
            * 100,

            2,

        )


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

        "is_toxic":
            int(
                predicted_id == 1
            ),

        "device":
            str(
                DEVICE
            ),

    }


# ============================================================
# MODEL INFO
# ============================================================

def get_toxicity_model_info():

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