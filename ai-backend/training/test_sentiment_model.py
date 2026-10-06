# ============================================================
# SAFETALK AI
# LOCAL SENTIMENT MODEL TEST
# ============================================================

from pathlib import Path
import sys


# ============================================================
# ADD PROJECT ROOT
# ============================================================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)


sys.path.insert(
    0,
    str(
        BASE_DIR
    )
)


# ============================================================
# IMPORT SENTIMENT SERVICE
# ============================================================

from app.services.sentiment_service import (
    predict_sentiment,
)


# ============================================================
# TEST SENTENCES
# ============================================================

TESTS = [

    "I am very happy today",

    "This is a terrible day",

    "Today is Monday",

    "mujhe ye bohat acha laga",

    "mera mood bohat kharab hai",

    "aaj monday hai",

    "مجھے یہ بہت اچھا لگا",

    "میں بہت پریشان ہوں",

]


# ============================================================
# RUN TESTS
# ============================================================

print()
print("=" * 80)
print("SAFETALK AI - LOCAL SENTIMENT MODEL TEST")
print("=" * 80)


for text in TESTS:

    result = predict_sentiment(
        text
    )


    print()
    print(
        "Text:",
        text
    )

    print(
        "Sentiment:",
        result[
            "label"
        ]
    )

    print(
        "Confidence:",
        result[
            "confidence"
        ],
        "%"
    )

    print(
        "Scores:",
        result[
            "scores"
        ]
    )

    print(
        "-" * 80
    )


print()
print(
    "✅ LOCAL SENTIMENT MODEL TEST COMPLETE"
)