# ============================================================
# SAFETALK AI
# TOXICITY MODEL EVALUATION
# NO RETRAINING
# ============================================================

from pathlib import Path

import numpy as np
import pandas as pd
import torch

from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    classification_report,
    confusion_matrix,
)

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR /
    "models" /
    "toxicity_model"
)

# ============================================================
# CHANGE ONLY THIS PATH
# ============================================================

TEST_CSV = (
    BASE_DIR /
    "datasets" /
    "toxicity_test.csv"
)


# ============================================================
# SETTINGS
# ============================================================

TEXT_COLUMN = "Roman_Urdu"

LABEL_COLUMN = "Toxic"

MAX_LENGTH = 128

BATCH_SIZE = 16


# ============================================================
# DEVICE
# ============================================================

device = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)

print(
    "Device:",
    device
)


# ============================================================
# LOAD MODEL + TOKENIZER
# ============================================================

print(
    "\nLoading toxicity model..."
)

tokenizer = (
    AutoTokenizer
    .from_pretrained(
        MODEL_PATH
    )
)

model = (
    AutoModelForSequenceClassification
    .from_pretrained(
        MODEL_PATH
    )
)

model.to(
    device
)

model.eval()

print(
    "✅ Toxicity model loaded"
)


# ============================================================
# LOAD TEST DATA
# ============================================================

print(
    "\nLoading test dataset..."
)

df = pd.read_csv(
    TEST_CSV
)


if TEXT_COLUMN not in df.columns:

    raise ValueError(
        f"Column '{TEXT_COLUMN}' not found. "
        f"Available columns: {df.columns.tolist()}"
    )


if LABEL_COLUMN not in df.columns:

    raise ValueError(
        f"Column '{LABEL_COLUMN}' not found. "
        f"Available columns: {df.columns.tolist()}"
    )


df = (
    df[
        [
            TEXT_COLUMN,
            LABEL_COLUMN,
        ]
    ]
    .dropna()
    .copy()
)


df[TEXT_COLUMN] = (
    df[TEXT_COLUMN]
    .astype(str)
)


df[LABEL_COLUMN] = (
    pd.to_numeric(
        df[LABEL_COLUMN],
        errors="coerce",
    )
)


df = (
    df
    .dropna()
    .copy()
)


df[LABEL_COLUMN] = (
    df[LABEL_COLUMN]
    .astype(int)
)


print(
    "Test rows:",
    len(df)
)


print(
    "\nLabel counts:"
)

print(
    df[LABEL_COLUMN]
    .value_counts()
    .sort_index()
)


# ============================================================
# PREDICTION
# ============================================================

texts = (
    df[TEXT_COLUMN]
    .tolist()
)

true_labels = (
    df[LABEL_COLUMN]
    .tolist()
)


predictions = []


print(
    "\nRunning evaluation..."
)


with torch.no_grad():

    for start in range(
        0,
        len(texts),
        BATCH_SIZE,
    ):

        batch_texts = (
            texts[
                start:
                start + BATCH_SIZE
            ]
        )


        encoded = tokenizer(
            batch_texts,
            padding=True,
            truncation=True,
            max_length=MAX_LENGTH,
            return_tensors="pt",
        )


        encoded = {
            key:
                value.to(device)

            for key, value
            in encoded.items()
        }


        outputs = model(
            **encoded
        )


        logits = (
            outputs.logits
        )


        batch_predictions = (
            torch.argmax(
                logits,
                dim=1,
            )
            .cpu()
            .numpy()
            .tolist()
        )


        predictions.extend(
            batch_predictions
        )


# ============================================================
# METRICS
# ============================================================

accuracy = (
    accuracy_score(
        true_labels,
        predictions,
    )
)


precision_macro, recall_macro, f1_macro, _ = (
    precision_recall_fscore_support(
        true_labels,
        predictions,
        average="macro",
        zero_division=0,
    )
)


precision_weighted, recall_weighted, f1_weighted, _ = (
    precision_recall_fscore_support(
        true_labels,
        predictions,
        average="weighted",
        zero_division=0,
    )
)


# ============================================================
# RESULTS
# ============================================================

print(
    "\n" +
    "=" * 60
)

print(
    "TOXICITY MODEL EVALUATION"
)

print(
    "=" * 60
)


print(
    f"Accuracy:           {accuracy * 100:.2f}%"
)

print(
    f"Macro Precision:    {precision_macro * 100:.2f}%"
)

print(
    f"Macro Recall:       {recall_macro * 100:.2f}%"
)

print(
    f"Macro F1:           {f1_macro * 100:.2f}%"
)

print(
    f"Weighted F1:        {f1_weighted * 100:.2f}%"
)


print(
    "\nClassification Report:"
)


print(
    classification_report(
        true_labels,
        predictions,
        target_names=[
            "Non-Toxic",
            "Toxic",
        ],
        digits=4,
        zero_division=0,
    )
)


print(
    "Confusion Matrix:"
)


print(
    confusion_matrix(
        true_labels,
        predictions,
    )
)


print(
    "\n✅ Toxicity evaluation complete"
)