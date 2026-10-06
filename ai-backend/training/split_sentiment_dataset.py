# ============================================================
# SAFETALK AI
# SENTIMENT DATASET SPLIT
# 70% TRAIN / 15% VALIDATION / 15% TEST
# ============================================================

from pathlib import Path

import pandas as pd

from sklearn.model_selection import train_test_split


# ============================================================
# PATHS
# ============================================================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

INPUT_FILE = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "sentiment_clean.csv"
)

OUTPUT_DIR = (
    BASE_DIR
    / "datasets"
    / "splits"
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

TRAIN_FILE = (
    OUTPUT_DIR
    / "sentiment_train.csv"
)

VALIDATION_FILE = (
    OUTPUT_DIR
    / "sentiment_validation.csv"
)

TEST_FILE = (
    OUTPUT_DIR
    / "sentiment_test.csv"
)


# ============================================================
# HEADER
# ============================================================

print()
print("=" * 70)
print("SAFETALK AI")
print("SENTIMENT DATASET SPLIT")
print("70% TRAIN / 15% VALIDATION / 15% TEST")
print("=" * 70)


# ============================================================
# LOAD DATASET
# ============================================================

if not INPUT_FILE.exists():

    raise FileNotFoundError(
        f"Dataset not found: {INPUT_FILE}"
    )


df = pd.read_csv(
    INPUT_FILE
)


print()
print(
    "Original Rows:",
    len(df)
)

print(
    "Original Columns:",
    df.columns.tolist()
)


# ============================================================
# DETECT SENTIMENT COLUMN
# ============================================================

if "label" in df.columns:

    SENTIMENT_COLUMN = "label"

elif "sentiment" in df.columns:

    SENTIMENT_COLUMN = "sentiment"

else:

    raise ValueError(
        "Sentiment column not found. "
        f"Available columns: {df.columns.tolist()}"
    )


print(
    "Detected Sentiment Column:",
    SENTIMENT_COLUMN
)


# ============================================================
# CHECK REQUIRED COLUMNS
# ============================================================

required_columns = [
    "text",
    "language",
    SENTIMENT_COLUMN,
]


missing_columns = [

    column

    for column in required_columns

    if column not in df.columns

]


if missing_columns:

    raise ValueError(
        f"Missing columns: {missing_columns}"
    )


# ============================================================
# KEEP REQUIRED COLUMNS
# ============================================================

df = df[
    [
        "text",
        SENTIMENT_COLUMN,
        "language",
    ]
].copy()


# ============================================================
# STANDARDIZE SENTIMENT COLUMN NAME
# ============================================================

df = df.rename(
    columns={
        SENTIMENT_COLUMN:
            "label"
    }
)


# ============================================================
# REMOVE MISSING VALUES
# ============================================================

before_missing = len(df)


df = df.dropna(
    subset=[
        "text",
        "label",
        "language",
    ]
)


print(
    "Removed Missing Rows:",
    before_missing - len(df)
)


# ============================================================
# CLEAN VALUES
# ============================================================

df["text"] = (

    df["text"]
    .astype(str)
    .str.strip()

)


df["label"] = (

    df["label"]
    .astype(str)
    .str.strip()
    .str.title()

)


df["language"] = (

    df["language"]
    .astype(str)
    .str.strip()

)


# ============================================================
# REMOVE EMPTY TEXT
# ============================================================

df = df[
    df["text"].str.len() > 0
].copy()


# ============================================================
# VALID SENTIMENT LABELS
# ============================================================

valid_labels = [
    "Positive",
    "Negative",
    "Neutral",
]


invalid_labels = df[
    ~df["label"].isin(
        valid_labels
    )
]["label"].value_counts()


if len(invalid_labels) > 0:

    print()
    print(
        "Invalid sentiment labels removed:"
    )

    print(
        invalid_labels
    )


df = df[
    df["label"].isin(
        valid_labels
    )
].copy()


# ============================================================
# VALID LANGUAGES
# ============================================================

valid_languages = [
    "English",
    "Urdu",
    "Roman Urdu",
]


df = df[
    df["language"].isin(
        valid_languages
    )
].copy()


# ============================================================
# DUPLICATE CHECK
# ============================================================

duplicate_count = (

    df["text"]
    .duplicated()
    .sum()

)


print()
print(
    "Duplicate Text Rows:",
    duplicate_count
)


df = df.drop_duplicates(
    subset=[
        "text",
    ],
    keep="first",
).reset_index(
    drop=True
)


print(
    "Rows After Cleaning:",
    len(df)
)


# ============================================================
# ORIGINAL DISTRIBUTION
# ============================================================

print()
print("=" * 70)
print("SENTIMENT DISTRIBUTION")
print("=" * 70)

print(
    df[
        "label"
    ]
    .value_counts()
)


print()
print("=" * 70)
print("LANGUAGE DISTRIBUTION")
print("=" * 70)

print(
    df[
        "language"
    ]
    .value_counts()
)


# ============================================================
# STRATIFICATION KEY
#
# Language + Sentiment dono ko balanced rakhega
# ============================================================

df["stratify_key"] = (

    df["language"]
    + "__"
    + df["label"]

)


# ============================================================
# 70% TRAIN
# 30% TEMP
# ============================================================

train_df, temp_df = train_test_split(

    df,

    test_size=0.30,

    random_state=42,

    stratify=df[
        "stratify_key"
    ],

)


# ============================================================
# 15% VALIDATION
# 15% TEST
# ============================================================

validation_df, test_df = train_test_split(

    temp_df,

    test_size=0.50,

    random_state=42,

    stratify=temp_df[
        "stratify_key"
    ],

)


# ============================================================
# REMOVE HELPER COLUMN
# ============================================================

for dataset in [
    train_df,
    validation_df,
    test_df,
]:

    dataset.drop(
        columns=[
            "stratify_key",
        ],
        inplace=True,
    )


# ============================================================
# RESET INDEX
# ============================================================

train_df = train_df.reset_index(
    drop=True
)

validation_df = validation_df.reset_index(
    drop=True
)

test_df = test_df.reset_index(
    drop=True
)


# ============================================================
# ADD IDS
# ============================================================

train_df.insert(
    0,
    "id",
    range(
        1,
        len(train_df) + 1,
    ),
)

validation_df.insert(
    0,
    "id",
    range(
        1,
        len(validation_df) + 1,
    ),
)

test_df.insert(
    0,
    "id",
    range(
        1,
        len(test_df) + 1,
    ),
)


# ============================================================
# REPORT FUNCTION
# ============================================================

def print_report(
    name,
    dataset,
    total_rows,
):

    print()
    print("=" * 70)
    print(
        f"{name} DATASET"
    )
    print("=" * 70)

    print()
    print(
        "Rows:",
        len(dataset)
    )

    print(
        "Percentage:",
        f"{len(dataset) / total_rows * 100:.2f}%"
    )


    print()
    print(
        "Sentiment Counts:"
    )

    print(
        dataset[
            "label"
        ]
        .value_counts()
    )


    print()
    print(
        "Language Counts:"
    )

    print(
        dataset[
            "language"
        ]
        .value_counts()
    )


    print()
    print(
        "Language + Sentiment:"
    )

    print(
        dataset.groupby(
            [
                "language",
                "label",
            ]
        )
        .size()
    )


# ============================================================
# REPORTS
# ============================================================

total_rows = len(df)


print_report(
    "TRAIN",
    train_df,
    total_rows,
)

print_report(
    "VALIDATION",
    validation_df,
    total_rows,
)

print_report(
    "TEST",
    test_df,
    total_rows,
)


# ============================================================
# DATA LEAKAGE CHECK
# ============================================================

train_texts = set(
    train_df["text"]
)

validation_texts = set(
    validation_df["text"]
)

test_texts = set(
    test_df["text"]
)


print()
print("=" * 70)
print("DATA LEAKAGE CHECK")
print("=" * 70)

print(
    "Train ↔ Validation overlap:",
    len(
        train_texts
        &
        validation_texts
    )
)

print(
    "Train ↔ Test overlap:",
    len(
        train_texts
        &
        test_texts
    )
)

print(
    "Validation ↔ Test overlap:",
    len(
        validation_texts
        &
        test_texts
    )
)


# ============================================================
# SAVE FILES
# ============================================================

train_df.to_csv(
    TRAIN_FILE,
    index=False,
)

validation_df.to_csv(
    VALIDATION_FILE,
    index=False,
)

test_df.to_csv(
    TEST_FILE,
    index=False,
)


# ============================================================
# FINAL SUMMARY
# ============================================================

print()
print("=" * 70)
print("FINAL SPLIT SUMMARY")
print("=" * 70)

print()
print(
    "Original Rows:",
    total_rows
)

print(
    "Train Rows:",
    len(train_df)
)

print(
    "Validation Rows:",
    len(validation_df)
)

print(
    "Test Rows:",
    len(test_df)
)

print(
    "Total Split Rows:",
    (
        len(train_df)
        +
        len(validation_df)
        +
        len(test_df)
    )
)


print()
print("Files Saved:")

print(
    "Train      :",
    TRAIN_FILE
)

print(
    "Validation :",
    VALIDATION_FILE
)

print(
    "Test       :",
    TEST_FILE
)


print()
print("=" * 70)
print(
    "✅ SENTIMENT TRAIN / VALIDATION / TEST SPLIT COMPLETE"
)
print("=" * 70)