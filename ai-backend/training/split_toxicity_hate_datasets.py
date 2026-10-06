# ============================================================
# SAFETALK AI
# FINAL TOXICITY + HATE SPEECH DATASET BUILDER
#
# Creates:
#
# datasets/processed/toxicity_clean.csv
# datasets/processed/hate_speech_clean.csv
#
# datasets/splits/toxicity_train.csv
# datasets/splits/toxicity_validation.csv
# datasets/splits/toxicity_test.csv
#
# datasets/splits/hate_speech_train.csv
# datasets/splits/hate_speech_validation.csv
# datasets/splits/hate_speech_test.csv
#
# Split:
# 70% Train
# 15% Validation
# 15% Test
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


DATASETS_DIR = (
    BASE_DIR
    / "datasets"
)


PROCESSED_DIR = (
    DATASETS_DIR
    / "processed"
)


SPLITS_DIR = (
    DATASETS_DIR
    / "splits"
)


SPLITS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# RANDOM STATE
# ============================================================

RANDOM_STATE = 42


# ============================================================
# SOURCE FILES
# ============================================================

JIGSAW_FILE = (
    PROCESSED_DIR
    / "jigsaw_clean.csv"
)


ROMAN_URDU_TOXICITY_FILE = (
    PROCESSED_DIR
    / "roman_urdu_toxicity_clean.csv"
)


ROMAN_URDU_HATE_FILE = (
    PROCESSED_DIR
    / "roman_urdu_hate_clean.csv"
)


URDU_HATE_FILE = (
    PROCESSED_DIR
    / "urdu_hate_clean.csv"
)


# ============================================================
# CHECK FILE EXISTS
# ============================================================

def check_file(
    path
):

    if not path.exists():

        raise FileNotFoundError(
            f"File not found: {path}"
        )


# ============================================================
# STANDARDIZE BINARY DATASET
# ============================================================

def standardize_dataset(
    df,
    label_column,
):

    # --------------------------------------------------------
    # KEEP REQUIRED COLUMNS
    # --------------------------------------------------------

    required_columns = [
        "text",
        "language",
        label_column,
    ]


    for column in required_columns:

        if column not in df.columns:

            raise ValueError(
                f"Missing column '{column}'. "
                f"Available columns: {list(df.columns)}"
            )


    df = df[
        required_columns
    ].copy()


    # --------------------------------------------------------
    # RENAME TARGET TO LABEL
    # --------------------------------------------------------

    df = df.rename(
        columns={
            label_column:
                "label"
        }
    )


    # --------------------------------------------------------
    # REMOVE MISSING VALUES
    # --------------------------------------------------------

    df = df.dropna(
        subset=[
            "text",
            "language",
            "label",
        ]
    )


    # --------------------------------------------------------
    # CLEAN TEXT
    # --------------------------------------------------------

    df["text"] = (
        df["text"]
        .astype(str)
        .str.strip()
    )


    # --------------------------------------------------------
    # CLEAN LANGUAGE
    # --------------------------------------------------------

    df["language"] = (
        df["language"]
        .astype(str)
        .str.strip()
    )


    # --------------------------------------------------------
    # LABEL TO INTEGER
    # --------------------------------------------------------

    df["label"] = pd.to_numeric(
        df["label"],
        errors="coerce",
    )


    df = df.dropna(
        subset=[
            "label"
        ]
    )


    df["label"] = (
        df["label"]
        .astype(int)
    )


    # --------------------------------------------------------
    # KEEP ONLY BINARY LABELS
    # --------------------------------------------------------

    df = df[
        df["label"].isin(
            [
                0,
                1,
            ]
        )
    ]


    # --------------------------------------------------------
    # REMOVE EMPTY TEXT
    # --------------------------------------------------------

    df = df[
        df["text"]
        .str.len()
        > 0
    ]


    # --------------------------------------------------------
    # RESET INDEX
    # --------------------------------------------------------

    df = df.reset_index(
        drop=True
    )


    return df


# ============================================================
# REMOVE DUPLICATES
# ============================================================

def remove_duplicates(
    df
):

    before = len(
        df
    )


    # --------------------------------------------------------
    # NORMALIZED TEXT FOR DUPLICATE CHECKING
    # --------------------------------------------------------

    df["_normalized_text"] = (
        df["text"]
        .astype(str)
        .str.strip()
        .str.lower()
        .str.replace(
            r"\s+",
            " ",
            regex=True,
        )
    )


    # --------------------------------------------------------
    # CHECK LABEL CONFLICTS
    # --------------------------------------------------------

    conflict_counts = (
        df.groupby(
            "_normalized_text"
        )["label"]
        .nunique()
    )


    conflicting_texts = set(
        conflict_counts[
            conflict_counts > 1
        ].index
    )


    print(
        "Conflicting duplicate texts:",
        len(
            conflicting_texts
        )
    )


    # --------------------------------------------------------
    # REMOVE CONFLICTING DUPLICATES
    #
    # Same sentence with label 0 and label 1 is unreliable.
    # --------------------------------------------------------

    if conflicting_texts:

        df = df[
            ~df[
                "_normalized_text"
            ].isin(
                conflicting_texts
            )
        ]


    # --------------------------------------------------------
    # REMOVE NORMAL DUPLICATES
    # --------------------------------------------------------

    df = df.drop_duplicates(
        subset=[
            "_normalized_text"
        ],
        keep="first",
    )


    df = df.drop(
        columns=[
            "_normalized_text"
        ]
    )


    df = df.reset_index(
        drop=True
    )


    after = len(
        df
    )


    print(
        "Duplicates/conflicts removed:",
        before - after
    )


    return df


# ============================================================
# ADD ID
# ============================================================

def add_ids(
    df
):

    df = df.reset_index(
        drop=True
    )


    if "id" in df.columns:

        df = df.drop(
            columns=[
                "id"
            ]
        )


    df.insert(
        0,
        "id",
        range(
            1,
            len(df) + 1
        ),
    )


    return df


# ============================================================
# PRINT DATASET STATS
# ============================================================

def print_stats(
    df,
    name,
):

    print()
    print(
        "=" * 80
    )

    print(
        name
    )

    print(
        "=" * 80
    )


    print()
    print(
        "Total rows:",
        len(
            df
        )
    )


    print()
    print(
        "Label distribution:"
    )

    print(
        df[
            "label"
        ].value_counts()
        .sort_index()
    )


    print()
    print(
        "Label percentages:"
    )

    print(
        (
            df[
                "label"
            ]
            .value_counts(
                normalize=True
            )
            .sort_index()
            * 100
        ).round(
            2
        )
    )


    print()
    print(
        "Language distribution:"
    )

    print(
        df[
            "language"
        ].value_counts()
    )


    print()
    print(
        "Language + Label:"
    )

    print(
        pd.crosstab(
            df[
                "language"
            ],
            df[
                "label"
            ],
        )
    )


# ============================================================
# BUILD TOXICITY DATASET
# ============================================================

def build_toxicity_dataset():

    print()
    print(
        "#" * 80
    )

    print(
        "BUILDING TOXICITY DATASET"
    )

    print(
        "#" * 80
    )


    check_file(
        JIGSAW_FILE
    )

    check_file(
        ROMAN_URDU_TOXICITY_FILE
    )


    # --------------------------------------------------------
    # ENGLISH
    # --------------------------------------------------------

    english_df = pd.read_csv(
        JIGSAW_FILE,
        low_memory=False,
    )


    english_df = standardize_dataset(
        english_df,
        "toxicity",
    )


    # --------------------------------------------------------
    # ROMAN URDU
    # --------------------------------------------------------

    roman_urdu_df = pd.read_csv(
        ROMAN_URDU_TOXICITY_FILE,
        low_memory=False,
    )


    roman_urdu_df = standardize_dataset(
        roman_urdu_df,
        "toxicity",
    )


    print()
    print(
        "English toxicity rows:",
        len(
            english_df
        )
    )


    print(
        "Roman Urdu toxicity rows:",
        len(
            roman_urdu_df
        )
    )


    # --------------------------------------------------------
    # COMBINE
    # --------------------------------------------------------

    combined_df = pd.concat(
        [
            english_df,
            roman_urdu_df,
        ],
        ignore_index=True,
    )


    # --------------------------------------------------------
    # DEDUPLICATE
    # --------------------------------------------------------

    combined_df = remove_duplicates(
        combined_df
    )


    # --------------------------------------------------------
    # ADD IDS
    # --------------------------------------------------------

    combined_df = add_ids(
        combined_df
    )


    # --------------------------------------------------------
    # SAVE CLEAN DATASET
    # --------------------------------------------------------

    output_file = (
        PROCESSED_DIR
        / "toxicity_clean.csv"
    )


    combined_df.to_csv(
        output_file,
        index=False,
        encoding="utf-8-sig",
    )


    print_stats(
        combined_df,
        "FINAL TOXICITY DATASET",
    )


    print()
    print(
        "Saved:"
    )

    print(
        output_file
    )


    return combined_df


# ============================================================
# BUILD HATE SPEECH DATASET
# ============================================================

def build_hate_speech_dataset():

    print()
    print(
        "#" * 80
    )

    print(
        "BUILDING HATE SPEECH DATASET"
    )

    print(
        "#" * 80
    )


    check_file(
        JIGSAW_FILE
    )

    check_file(
        ROMAN_URDU_HATE_FILE
    )

    check_file(
        URDU_HATE_FILE
    )


    # --------------------------------------------------------
    # ENGLISH
    # --------------------------------------------------------

    english_df = pd.read_csv(
        JIGSAW_FILE,
        low_memory=False,
    )


    english_df = standardize_dataset(
        english_df,
        "hate_speech",
    )


    # --------------------------------------------------------
    # ROMAN URDU
    # --------------------------------------------------------

    roman_urdu_df = pd.read_csv(
        ROMAN_URDU_HATE_FILE,
        low_memory=False,
    )


    roman_urdu_df = standardize_dataset(
        roman_urdu_df,
        "hate_speech",
    )


    # --------------------------------------------------------
    # URDU
    # --------------------------------------------------------

    urdu_df = pd.read_csv(
        URDU_HATE_FILE,
        low_memory=False,
    )


    urdu_df = standardize_dataset(
        urdu_df,
        "hate_speech",
    )


    print()
    print(
        "English hate rows:",
        len(
            english_df
        )
    )


    print(
        "Roman Urdu hate rows:",
        len(
            roman_urdu_df
        )
    )


    print(
        "Urdu hate rows:",
        len(
            urdu_df
        )
    )


    # --------------------------------------------------------
    # COMBINE
    # --------------------------------------------------------

    combined_df = pd.concat(
        [
            english_df,
            roman_urdu_df,
            urdu_df,
        ],
        ignore_index=True,
    )


    # --------------------------------------------------------
    # DEDUPLICATE
    # --------------------------------------------------------

    combined_df = remove_duplicates(
        combined_df
    )


    # --------------------------------------------------------
    # ADD IDS
    # --------------------------------------------------------

    combined_df = add_ids(
        combined_df
    )


    # --------------------------------------------------------
    # SAVE CLEAN DATASET
    # --------------------------------------------------------

    output_file = (
        PROCESSED_DIR
        / "hate_speech_clean.csv"
    )


    combined_df.to_csv(
        output_file,
        index=False,
        encoding="utf-8-sig",
    )


    print_stats(
        combined_df,
        "FINAL HATE SPEECH DATASET",
    )


    print()
    print(
        "Saved:"
    )

    print(
        output_file
    )


    return combined_df


# ============================================================
# CREATE STRATIFICATION COLUMN
#
# We preserve both:
# - label distribution
# - language distribution
# ============================================================

def create_stratify_column(
    df
):

    return (
        df[
            "language"
        ].astype(str)
        +
        "__"
        +
        df[
            "label"
        ].astype(str)
    )


# ============================================================
# SPLIT DATASET
# ============================================================

def split_dataset(
    df,
    dataset_name,
):

    print()
    print(
        "#" * 80
    )

    print(
        f"SPLITTING {dataset_name.upper()}"
    )

    print(
        "#" * 80
    )


    df = df.copy()


    # --------------------------------------------------------
    # STRATIFICATION
    # --------------------------------------------------------

    df["_stratify"] = (
        create_stratify_column(
            df
        )
    )


    print()
    print(
        "Stratification groups:"
    )


    print(
        df[
            "_stratify"
        ].value_counts()
    )


    # ========================================================
    # 70% TRAIN
    # 30% TEMP
    # ========================================================

    train_df, temp_df = (
        train_test_split(

            df,

            test_size=0.30,

            random_state=
                RANDOM_STATE,

            stratify=
                df[
                    "_stratify"
                ],

        )
    )


    # ========================================================
    # 15% VALIDATION
    # 15% TEST
    # ========================================================

    validation_df, test_df = (
        train_test_split(

            temp_df,

            test_size=0.50,

            random_state=
                RANDOM_STATE,

            stratify=
                temp_df[
                    "_stratify"
                ],

        )
    )


    # --------------------------------------------------------
    # REMOVE INTERNAL COLUMN
    # --------------------------------------------------------

    train_df = train_df.drop(
        columns=[
            "_stratify"
        ]
    )


    validation_df = (
        validation_df.drop(
            columns=[
                "_stratify"
            ]
        )
    )


    test_df = test_df.drop(
        columns=[
            "_stratify"
        ]
    )


    # --------------------------------------------------------
    # RESET INDEX
    # --------------------------------------------------------

    train_df = (
        train_df
        .reset_index(
            drop=True
        )
    )


    validation_df = (
        validation_df
        .reset_index(
            drop=True
        )
    )


    test_df = (
        test_df
        .reset_index(
            drop=True
        )
    )


    # ========================================================
    # OUTPUT FILES
    # ========================================================

    train_file = (
        SPLITS_DIR
        / f"{dataset_name}_train.csv"
    )


    validation_file = (
        SPLITS_DIR
        / f"{dataset_name}_validation.csv"
    )


    test_file = (
        SPLITS_DIR
        / f"{dataset_name}_test.csv"
    )


    # --------------------------------------------------------
    # SAVE
    # --------------------------------------------------------

    train_df.to_csv(
        train_file,
        index=False,
        encoding="utf-8-sig",
    )


    validation_df.to_csv(
        validation_file,
        index=False,
        encoding="utf-8-sig",
    )


    test_df.to_csv(
        test_file,
        index=False,
        encoding="utf-8-sig",
    )


    # ========================================================
    # SPLIT STATISTICS
    # ========================================================

    total = len(
        df
    )


    print()
    print(
        "=" * 80
    )

    print(
        f"{dataset_name.upper()} SPLIT RESULTS"
    )

    print(
        "=" * 80
    )


    print()
    print(
        "TOTAL:",
        total
    )


    print(
        "TRAIN:",
        len(
            train_df
        ),
        f"({len(train_df) / total * 100:.2f}%)"
    )


    print(
        "VALIDATION:",
        len(
            validation_df
        ),
        f"({len(validation_df) / total * 100:.2f}%)"
    )


    print(
        "TEST:",
        len(
            test_df
        ),
        f"({len(test_df) / total * 100:.2f}%)"
    )


    # ========================================================
    # LABEL DISTRIBUTION
    # ========================================================

    print()
    print(
        "TRAIN LABELS:"
    )

    print(
        train_df[
            "label"
        ].value_counts()
        .sort_index()
    )


    print()
    print(
        "VALIDATION LABELS:"
    )

    print(
        validation_df[
            "label"
        ].value_counts()
        .sort_index()
    )


    print()
    print(
        "TEST LABELS:"
    )

    print(
        test_df[
            "label"
        ].value_counts()
        .sort_index()
    )


    # ========================================================
    # LANGUAGE DISTRIBUTION
    # ========================================================

    print()
    print(
        "TRAIN LANGUAGES:"
    )

    print(
        train_df[
            "language"
        ].value_counts()
    )


    print()
    print(
        "VALIDATION LANGUAGES:"
    )

    print(
        validation_df[
            "language"
        ].value_counts()
    )


    print()
    print(
        "TEST LANGUAGES:"
    )

    print(
        test_df[
            "language"
        ].value_counts()
    )


    # ========================================================
    # LANGUAGE + LABEL DISTRIBUTION
    # ========================================================

    print()
    print(
        "TRAIN LANGUAGE + LABEL:"
    )

    print(
        pd.crosstab(
            train_df[
                "language"
            ],
            train_df[
                "label"
            ],
        )
    )


    # ========================================================
    # DATA LEAKAGE CHECK
    # ========================================================

    train_texts = set(
        train_df[
            "text"
        ]
        .astype(str)
        .str.strip()
        .str.lower()
    )


    validation_texts = set(
        validation_df[
            "text"
        ]
        .astype(str)
        .str.strip()
        .str.lower()
    )


    test_texts = set(
        test_df[
            "text"
        ]
        .astype(str)
        .str.strip()
        .str.lower()
    )


    train_val_overlap = (
        train_texts
        &
        validation_texts
    )


    train_test_overlap = (
        train_texts
        &
        test_texts
    )


    val_test_overlap = (
        validation_texts
        &
        test_texts
    )


    print()
    print(
        "DATA LEAKAGE CHECK"
    )


    print(
        "Train / Validation overlap:",
        len(
            train_val_overlap
        )
    )


    print(
        "Train / Test overlap:",
        len(
            train_test_overlap
        )
    )


    print(
        "Validation / Test overlap:",
        len(
            val_test_overlap
        )
    )


    if (
        len(
            train_val_overlap
        ) == 0
        and
        len(
            train_test_overlap
        ) == 0
        and
        len(
            val_test_overlap
        ) == 0
    ):

        print()
        print(
            "✅ NO DATA LEAKAGE"
        )

    else:

        print()
        print(
            "❌ DATA LEAKAGE DETECTED"
        )


    print()
    print(
        "Saved:"
    )

    print(
        train_file
    )

    print(
        validation_file
    )

    print(
        test_file
    )


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    print()
    print(
        "=" * 80
    )

    print(
        "SAFETALK AI"
    )

    print(
        "TOXICITY + HATE SPEECH DATASET BUILDER"
    )

    print(
        "=" * 80
    )


    # ========================================================
    # TOXICITY
    # ========================================================

    toxicity_df = (
        build_toxicity_dataset()
    )


    split_dataset(
        toxicity_df,
        "toxicity",
    )


    # ========================================================
    # HATE SPEECH
    # ========================================================

    hate_speech_df = (
        build_hate_speech_dataset()
    )


    split_dataset(
        hate_speech_df,
        "hate_speech",
    )


    # ========================================================
    # DONE
    # ========================================================

    print()
    print(
        "=" * 80
    )

    print(
        "✅ ALL DATASETS CREATED AND SPLIT SUCCESSFULLY"
    )

    print(
        "=" * 80
    )