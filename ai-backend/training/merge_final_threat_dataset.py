# ============================================================
# SAFETALK AI
# STEP 67.5
# FINAL MULTI-LABEL THREAT DATASET
# MERGE + BALANCE + REPORT
# ============================================================

from pathlib import Path

import pandas as pd


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(
    __file__
).resolve().parent.parent

PROCESSED_DIR = (
    BASE_DIR
    / "datasets"
    / "processed"
)


ENGLISH_FILE = (
    PROCESSED_DIR
    / "threat_multilabel_candidates.csv"
)

URDU_FILE = (
    PROCESSED_DIR
    / "urdu_threat_seed.csv"
)

ROMAN_URDU_FILE = (
    PROCESSED_DIR
    / "roman_urdu_threat_seed.csv"
)

OUTPUT_FILE = (
    PROCESSED_DIR
    / "final_multilabel_threat_dataset.csv"
)


# ============================================================
# FINAL LABEL COLUMNS
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
# FINAL COLUMN ORDER
# ============================================================

FINAL_COLUMNS = [

    "text",

    "language",

    "is_threat",

    "physical_threat",

    "death_threat",

    "harassment",

    "abusive_language",

    "cyber_threat",

    "hate_speech",

    "sexual_threat",

    "self_harm",

    "primary_threat",

    "label_source",

    "source",

]


# ============================================================
# STANDARDIZE DATAFRAME
# ============================================================

def standardize_dataframe(
    df,
    default_label_source,
):

    # --------------------------------------------------------
    # Add missing columns
    # --------------------------------------------------------

    for column in FINAL_COLUMNS:

        if column not in df.columns:

            df[column] = pd.NA


    # --------------------------------------------------------
    # Label source
    # --------------------------------------------------------

    df["label_source"] = (
        df["label_source"]
        .fillna(
            default_label_source
        )
    )


    # --------------------------------------------------------
    # Normalize text
    # --------------------------------------------------------

    df["text"] = (
        df["text"]
        .astype("string")
        .str.strip()
    )


    # --------------------------------------------------------
    # Remove empty
    # --------------------------------------------------------

    df = df[
        df["text"].notna()
    ].copy()

    df = df[
        df["text"].str.len() > 0
    ].copy()


    # --------------------------------------------------------
    # Normalize label columns
    # --------------------------------------------------------

    binary_columns = [

        "is_threat",

        *LABEL_COLUMNS,

    ]


    for column in binary_columns:

        df[column] = (

            pd.to_numeric(
                df[column],
                errors="coerce",
            )
            .fillna(0)
            .astype(int)

        )


    # --------------------------------------------------------
    # Keep only 0 / 1
    # --------------------------------------------------------

    for column in binary_columns:

        df[column] = (

            df[column]
            .clip(
                lower=0,
                upper=1,
            )

        )


    return df


# ============================================================
# LOAD ENGLISH DATA
# ============================================================

def load_english():

    print()
    print("=" * 70)
    print("Loading English threat candidates")
    print("=" * 70)

    df = pd.read_csv(
        ENGLISH_FILE
    )


    print(
        f"Original English rows: {len(df)}"
    )


    # ========================================================
    # REMOVE UNRESOLVED ROWS
    #
    # needs_review = 1 means broad threat exists,
    # but subtype is not yet manually confirmed.
    # ========================================================

    if (
        "needs_review"
        in df.columns
    ):

        unresolved = int(
            (
                df["needs_review"]
                == 1
            )
            .sum()
        )

        print(
            f"Unresolved manual-review rows excluded: {unresolved}"
        )


        df = df[
            df["needs_review"]
            != 1
        ].copy()


    df = standardize_dataframe(

        df,

        default_label_source=(
            "rule_assisted_english"
        ),

    )


    return df


# ============================================================
# LOAD URDU
# ============================================================

def load_urdu():

    print()
    print("=" * 70)
    print("Loading Urdu threat seed dataset")
    print("=" * 70)

    df = pd.read_csv(
        URDU_FILE
    )


    df = standardize_dataframe(

        df,

        default_label_source=(
            "custom_urdu_seed"
        ),

    )


    print(
        f"Urdu rows: {len(df)}"
    )


    return df


# ============================================================
# LOAD ROMAN URDU
# ============================================================

def load_roman_urdu():

    print()
    print("=" * 70)
    print("Loading Roman Urdu threat seed dataset")
    print("=" * 70)

    df = pd.read_csv(
        ROMAN_URDU_FILE
    )


    df = standardize_dataframe(

        df,

        default_label_source=(
            "custom_roman_urdu_seed"
        ),

    )


    print(
        f"Roman Urdu rows: {len(df)}"
    )


    return df


# ============================================================
# BALANCE ENGLISH DATA
# ============================================================

def balance_english(
    df,
):

    print()
    print("=" * 70)
    print("Balancing English dataset")
    print("=" * 70)


    # ========================================================
    # POSITIVE ROWS
    #
    # Keep every row containing at least one important label.
    # ========================================================

    label_sum = (

        df[
            LABEL_COLUMNS
        ]
        .sum(
            axis=1
        )

    )


    positive_mask = (

        (
            label_sum
            > 0
        )
        |
        (
            df["is_threat"]
            == 1
        )

    )


    positive_df = df[
        positive_mask
    ].copy()


    # ========================================================
    # CLEAN NEGATIVE ROWS
    # ========================================================

    negative_df = df[
        ~positive_mask
    ].copy()


    print(
        f"English positive / labeled rows: {len(positive_df)}"
    )

    print(
        f"English clean negative rows available: {len(negative_df)}"
    )


    # ========================================================
    # NEGATIVE SAMPLE SIZE
    #
    # Keep at most 2x positive examples.
    # This avoids 140k+ normal rows overwhelming threat labels.
    # ========================================================

    negative_limit = min(

        len(
            negative_df
        ),

        len(
            positive_df
        )
        * 2,

    )


    # ========================================================
    # REPRODUCIBLE SAMPLE
    # ========================================================

    if negative_limit > 0:

        negative_sample = (

            negative_df
            .sample(
                n=negative_limit,
                random_state=42,
            )

        )

    else:

        negative_sample = (
            negative_df
        )


    # ========================================================
    # COMBINE
    # ========================================================

    balanced = pd.concat(

        [
            positive_df,
            negative_sample,
        ],

        ignore_index=True,

    )


    # ========================================================
    # SHUFFLE
    # ========================================================

    balanced = (

        balanced
        .sample(
            frac=1,
            random_state=42,
        )
        .reset_index(
            drop=True
        )

    )


    print(
        f"Balanced English rows: {len(balanced)}"
    )


    return balanced


# ============================================================
# REMOVE DUPLICATES
# ============================================================

def remove_duplicates(
    df,
):

    before = len(
        df
    )


    df = df.drop_duplicates(
        subset=[
            "text",
            "language",
        ]
    )


    after = len(
        df
    )


    print(
        f"Duplicates removed: {before - after}"
    )


    return (
        df
        .reset_index(
            drop=True
        )
    )


# ============================================================
# REPORT
# ============================================================

def print_report(
    df,
):

    print()
    print("=" * 70)
    print("FINAL MULTI-LABEL DATASET REPORT")
    print("=" * 70)


    print(
        f"\nTotal Rows: {len(df)}"
    )


    # ========================================================
    # LANGUAGE COUNTS
    # ========================================================

    print()
    print(
        "Language Counts:"
    )

    print(
        df["language"]
        .value_counts()
    )


    # ========================================================
    # OVERALL THREAT
    # ========================================================

    print()
    print(
        "Overall Threat:"
    )

    print(
        df["is_threat"]
        .value_counts()
        .sort_index()
    )


    # ========================================================
    # LABEL COUNTS
    # ========================================================

    print()
    print(
        "Multi-label Counts:"
    )


    for column in LABEL_COLUMNS:

        count = int(
            df[column]
            .sum()
        )

        print(
            f"{column}: {count}"
        )


    # ========================================================
    # SOURCE COUNTS
    # ========================================================

    print()
    print(
        "Source Counts:"
    )

    print(
        df["label_source"]
        .value_counts()
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 70)
    print("SAFETALK AI")
    print("STEP 67.5 - FINAL MULTI-LABEL THREAT DATASET")
    print("=" * 70)


    # ========================================================
    # LOAD
    # ========================================================

    english_df = (
        load_english()
    )

    urdu_df = (
        load_urdu()
    )

    roman_urdu_df = (
        load_roman_urdu()
    )


    # ========================================================
    # BALANCE ENGLISH
    # ========================================================

    english_df = (
        balance_english(
            english_df
        )
    )


    # ========================================================
    # MERGE
    # ========================================================

    final_df = pd.concat(

        [
            english_df,
            urdu_df,
            roman_urdu_df,
        ],

        ignore_index=True,

    )


    print()

    print(
        f"Rows before duplicate removal: {len(final_df)}"
    )


    # ========================================================
    # REMOVE DUPLICATES
    # ========================================================

    final_df = (
        remove_duplicates(
            final_df
        )
    )


    # ========================================================
    # FINAL COLUMN ORDER
    # ========================================================

    final_df = final_df[
        FINAL_COLUMNS
    ]


    # ========================================================
    # ADD FINAL ID
    # ========================================================

    final_df.insert(

        0,

        "id",

        range(
            1,
            len(final_df) + 1
        ),

    )


    # ========================================================
    # SHUFFLE
    # ========================================================

    final_df = (

        final_df
        .sample(
            frac=1,
            random_state=42,
        )
        .reset_index(
            drop=True
        )

    )


    # ========================================================
    # RECREATE IDs AFTER SHUFFLE
    # ========================================================

    final_df["id"] = range(
        1,
        len(final_df) + 1
    )


    # ========================================================
    # SAVE
    # ========================================================

    final_df.to_csv(

        OUTPUT_FILE,

        index=False,

        encoding="utf-8-sig",

    )


    # ========================================================
    # REPORT
    # ========================================================

    print_report(
        final_df
    )


    print()

    print(
        f"Saved: {OUTPUT_FILE}"
    )


    print()

    print("=" * 70)

    print(
        "✅ STEP 67.5 FINAL DATASET CREATED"
    )

    print("=" * 70)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    main()