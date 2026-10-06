# ============================================================
# SAFETALK AI
# STEP 68
# TRAIN / VALIDATION / TEST SPLIT
#
# Train      = 70%
# Validation = 15%
# Test       = 15%
# ============================================================

from pathlib import Path

import pandas as pd

from sklearn.model_selection import train_test_split


# ============================================================
# CONFIGURATION
# ============================================================

RANDOM_STATE = 42

TRAIN_SIZE = 0.70

VALIDATION_SIZE = 0.15

TEST_SIZE = 0.15


# ============================================================
# PATHS
# ============================================================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

PROCESSED_DIR = (
    BASE_DIR
    / "datasets"
    / "processed"
)

SPLITS_DIR = (
    BASE_DIR
    / "datasets"
    / "splits"
)


INPUT_FILE = (
    PROCESSED_DIR
    / "final_multilabel_threat_dataset_v2.csv"
)


TRAIN_FILE = (
    SPLITS_DIR
    / "threat_train.csv"
)


VALIDATION_FILE = (
    SPLITS_DIR
    / "threat_validation.csv"
)


TEST_FILE = (
    SPLITS_DIR
    / "threat_test.csv"
)


# ============================================================
# LABEL COLUMNS
# ============================================================

LABEL_COLUMNS = [

    "physical_threat",

    "death_threat",

    "harassment",

    "abusive_language",

    "cyber_threat",

    "hate_speech",

    "sexual_threat",

    "self_harm",

]


# ============================================================
# CREATE SPLIT DIRECTORY
# ============================================================

SPLITS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# CHECK INPUT FILE
# ============================================================

if not INPUT_FILE.exists():

    raise FileNotFoundError(

        f"\nDataset not found:\n{INPUT_FILE}"

    )


# ============================================================
# LOAD DATASET
# ============================================================

print()

print("=" * 70)

print(
    "SAFETALK AI"
)

print(
    "STEP 68 - TRAIN / VALIDATION / TEST SPLIT"
)

print("=" * 70)


df = pd.read_csv(
    INPUT_FILE
)


print(
    f"\nOriginal Dataset Rows: {len(df)}"
)


# ============================================================
# REMOVE OLD ID
#
# IDs will be created again separately for each split.
# ============================================================

if "id" in df.columns:

    df = df.drop(
        columns=[
            "id",
        ]
    )


# ============================================================
# CHECK TEXT
# ============================================================

df["text"] = (
    df["text"]
    .astype("string")
    .str.strip()
)


df = df[
    df["text"].notna()
].copy()


df = df[
    df["text"].str.len() > 0
].copy()


df = df.reset_index(
    drop=True
)


# ============================================================
# CHECK DUPLICATES
# ============================================================

duplicate_count = int(

    df.duplicated(
        subset=[
            "text",
            "language",
        ]
    )
    .sum()

)


print(
    f"Duplicate text rows: {duplicate_count}"
)


# ============================================================
# REMOVE DUPLICATES IF ANY
# ============================================================

if duplicate_count > 0:

    df = df.drop_duplicates(

        subset=[
            "text",
            "language",
        ],

        keep="first",

    ).reset_index(
        drop=True
    )


# ============================================================
# CHECK REQUIRED STRATIFY COLUMN
# ============================================================

if "primary_threat" not in df.columns:

    raise ValueError(

        "primary_threat column is missing."

    )


# ============================================================
# CLEAN PRIMARY THREAT
# ============================================================

df["primary_threat"] = (

    df["primary_threat"]
    .fillna(
        "No Threat"
    )
    .astype(str)
    .str.strip()

)


# ============================================================
# SHOW PRIMARY CLASS DISTRIBUTION
# ============================================================

print()

print("=" * 70)

print(
    "ORIGINAL PRIMARY THREAT DISTRIBUTION"
)

print("=" * 70)


print(

    df[
        "primary_threat"
    ]
    .value_counts()

)


# ============================================================
# FIRST SPLIT
#
# 70% = Train
# 30% = Temporary
#
# Temporary will later become:
#
# 15% Validation
# 15% Test
# ============================================================

train_df, temp_df = train_test_split(

    df,

    test_size=0.30,

    random_state=RANDOM_STATE,

    shuffle=True,

    stratify=df[
        "primary_threat"
    ],

)


# ============================================================
# SECOND SPLIT
#
# Temporary = 30%
#
# Divide equally:
#
# 15% Validation
# 15% Test
# ============================================================

validation_df, test_df = train_test_split(

    temp_df,

    test_size=0.50,

    random_state=RANDOM_STATE,

    shuffle=True,

    stratify=temp_df[
        "primary_threat"
    ],

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
# ADD NEW IDs
# ============================================================

train_df.insert(

    0,

    "id",

    range(
        1,
        len(train_df) + 1
    ),

)


validation_df.insert(

    0,

    "id",

    range(
        1,
        len(validation_df) + 1
    ),

)


test_df.insert(

    0,

    "id",

    range(
        1,
        len(test_df) + 1
    ),

)


# ============================================================
# SAVE FILES
# ============================================================

train_df.to_csv(

    TRAIN_FILE,

    index=False,

    encoding="utf-8-sig",

)


validation_df.to_csv(

    VALIDATION_FILE,

    index=False,

    encoding="utf-8-sig",

)


test_df.to_csv(

    TEST_FILE,

    index=False,

    encoding="utf-8-sig",

)


# ============================================================
# REPORT FUNCTION
# ============================================================

def print_split_report(
    name,
    split_df,
):

    print()

    print("=" * 70)

    print(
        f"{name} DATASET"
    )

    print("=" * 70)


    # --------------------------------------------------------
    # Total rows
    # --------------------------------------------------------

    total = len(
        split_df
    )


    percentage = (
        total
        / len(df)
    ) * 100


    print(
        f"\nRows: {total}"
    )

    print(
        f"Percentage: {percentage:.2f}%"
    )


    # --------------------------------------------------------
    # Languages
    # --------------------------------------------------------

    print()

    print(
        "Language Counts:"
    )

    print(

        split_df[
            "language"
        ]
        .value_counts()

    )


    # --------------------------------------------------------
    # Overall threat
    # --------------------------------------------------------

    print()

    print(
        "Overall Threat:"
    )

    print(

        split_df[
            "is_threat"
        ]
        .value_counts()
        .sort_index()

    )


    # --------------------------------------------------------
    # Primary threat
    # --------------------------------------------------------

    print()

    print(
        "Primary Threat Counts:"
    )

    print(

        split_df[
            "primary_threat"
        ]
        .value_counts()

    )


    # --------------------------------------------------------
    # Multi-label counts
    # --------------------------------------------------------

    print()

    print(
        "Multi-label Counts:"
    )


    for column in LABEL_COLUMNS:

        if column in split_df.columns:

            count = int(

                split_df[
                    column
                ]
                .sum()

            )

            print(
                f"{column}: {count}"
            )


# ============================================================
# PRINT REPORTS
# ============================================================

print_split_report(

    "TRAIN",

    train_df,

)


print_split_report(

    "VALIDATION",

    validation_df,

)


print_split_report(

    "TEST",

    test_df,

)


# ============================================================
# VERIFY NO DATA LEAKAGE
# ============================================================

print()

print("=" * 70)

print(
    "DATA LEAKAGE CHECK"
)

print("=" * 70)


train_texts = set(

    zip(
        train_df["text"],
        train_df["language"],
    )

)


validation_texts = set(

    zip(
        validation_df["text"],
        validation_df["language"],
    )

)


test_texts = set(

    zip(
        test_df["text"],
        test_df["language"],
    )

)


train_validation_overlap = len(

    train_texts
    .intersection(
        validation_texts
    )

)


train_test_overlap = len(

    train_texts
    .intersection(
        test_texts
    )

)


validation_test_overlap = len(

    validation_texts
    .intersection(
        test_texts
    )

)


print(
    f"Train ↔ Validation overlap: "
    f"{train_validation_overlap}"
)

print(
    f"Train ↔ Test overlap: "
    f"{train_test_overlap}"
)

print(
    f"Validation ↔ Test overlap: "
    f"{validation_test_overlap}"
)


# ============================================================
# FINAL SUMMARY
# ============================================================

total_rows = (

    len(train_df)
    +
    len(validation_df)
    +
    len(test_df)

)


print()

print("=" * 70)

print(
    "FINAL SPLIT SUMMARY"
)

print("=" * 70)


print(
    f"\nOriginal Rows: {len(df)}"
)

print(
    f"Train Rows: {len(train_df)}"
)

print(
    f"Validation Rows: {len(validation_df)}"
)

print(
    f"Test Rows: {len(test_df)}"
)

print(
    f"Total Split Rows: {total_rows}"
)


# ============================================================
# SAVE LOCATIONS
# ============================================================

print()

print(
    "Files Saved:"
)

print(
    f"Train      : {TRAIN_FILE}"
)

print(
    f"Validation : {VALIDATION_FILE}"
)

print(
    f"Test       : {TEST_FILE}"
)


print()

print("=" * 70)

print(
    "✅ STEP 68 TRAIN / VALIDATION / TEST SPLIT COMPLETE"
)

print("=" * 70)