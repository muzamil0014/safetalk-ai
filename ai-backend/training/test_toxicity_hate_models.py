# ============================================================
# SAFETALK AI
# TOXICITY + HATE SPEECH LOCAL TEST
# ============================================================

from pathlib import Path
import sys


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


from app.services.toxicity_service import (
    predict_toxicity,
)

from app.services.hate_speech_service import (
    predict_hate_speech,
)


# ============================================================
# TESTS
# ============================================================

TESTS = [

    "You are a wonderful person",

    "you piece of shit",

    "fuck you",

    "I hate all people from that group",

    "tum bohat achay insan ho",

    "tum bohat ghatiya insan ho",

    "harami",

    "kamina",

    "مجھے یہ لوگ پسند نہیں ہیں",

]


# ============================================================
# RUN
# ============================================================

print()
print("=" * 80)
print("SAFETALK AI - TOXICITY + HATE SPEECH TEST")
print("=" * 80)


for text in TESTS:

    toxicity = (
        predict_toxicity(
            text
        )
    )


    hate = (
        predict_hate_speech(
            text
        )
    )


    print()
    print(
        "TEXT:",
        text
    )


    print(
        "TOXICITY:",
        toxicity
    )


    print(
        "HATE SPEECH:",
        hate
    )


    print(
        "-" * 80
    )


print()
print(
    "✅ TOXICITY + HATE SPEECH LOCAL TEST COMPLETE"
)