# ============================================================
# SAFETALK AI
# HATE SPEECH MODEL EVALUATION
# NO RETRAINING
# ============================================================

from pathlib import Path

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
    "hate_speech_model"
)

TEST_CSV = (
    BASE_DIR /
    "datasets" /
    "splits" /
    "hate_speech_test.csv"
)


# ============================================================
# SETTINGS
# ============================================================

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
    "\nLoading hate speech model..."
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
    "✅ Hate speech model loaded"
)


# ============================================================
# LOAD TEST DATASET
# ============================================================

print(
    "\nLoading test dataset..."
)

df = pd.read_csv(
    TEST_CSV
)


print(
    "Available columns:",
    df.columns.tolist()
)


# ============================================================
# AUTO DETECT TEXT COLUMN
# ============================================================

possible_text_columns = [
    "text",
    "Text",
    "sentence",
    "Sentence",
    "comment",
    "Comment",
    "content",
    "Content",
    "tweet",
    "Tweet",
]


TEXT_COLUMN = None


for column in possible_text_columns:

    if column in df.columns:

        TEXT_COLUMN = column
        break


if TEXT_COLUMN is None:

    raise ValueError(
        "Text column automatically detect nahi hui. "
        f"Available columns: {df.columns.tolist()}"
    )


# ============================================================
# AUTO DETECT LABEL COLUMN
# ============================================================

possible_label_columns = [
    "label",
    "Label",
    "labels",
    "Labels",
    "hate",
    "Hate",
    "hate_label",
    "hate_speech",
    "target",
    "Target",
]


LABEL_COLUMN = None


for column in possible_label_columns:

    if column in df.columns:

        LABEL_COLUMN = column
        break


if LABEL_COLUMN is None:

    raise ValueError(
        "Label column automatically detect nahi hui. "
        f"Available columns: {df.columns.tolist()}"
    )


print(
    "Text column:",
    TEXT_COLUMN
)

print(
    "Label column:",
    LABEL_COLUMN
)


# ============================================================
# CLEAN DATA
# ============================================================

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


# ============================================================
# CONVERT LABELS
# ============================================================

def convert_label(value):

    # already numeric
    if isinstance(
        value,
        (int, float)
    ):

        return int(
            value
        )


    value = (
        str(value)
        .strip()
        .lower()
    )


    # Hate Speech
    hate_values = [
        "1",
        "hate",
        "hate speech",
        "hateful",
        "offensive",
        "toxic",
        "yes",
        "true",
    ]


    # Non Hate
    non_hate_values = [
        "0",
        "non-hate",
        "non hate",
        "not hate",
        "normal",
        "neutral",
        "no",
        "false",
    ]


    if value in hate_values:

        return 1


    if value in non_hate_values:

        return 0


    try:

        return int(
            float(value)
        )

    except Exception:

        return None


df[LABEL_COLUMN] = (
    df[LABEL_COLUMN]
    .apply(
        convert_label
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


# ============================================================
# VALID LABELS ONLY
# ============================================================

df = df[
    df[LABEL_COLUMN]
    .isin(
        [
            0,
            1,
        ]
    )
].copy()


print(
    "\nTest rows:",
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
# PREPARE DATA
# ============================================================

texts = (
    df[TEXT_COLUMN]
    .tolist()
)

true_labels = (
    df[LABEL_COLUMN]
    .tolist()
)


# ============================================================
# RUN PREDICTIONS
# ============================================================

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
    "HATE SPEECH MODEL EVALUATION"
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
            "Non-Hate",
            "Hate Speech",
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
    "\n✅ Hate speech evaluation complete"
)