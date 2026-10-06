# ============================================================
# SAFETALK AI
# TEST LOCAL THREAT MODEL
# ============================================================

from pathlib import Path
import sys


# ============================================================
# ADD AI-BACKEND ROOT TO PYTHON PATH
# ============================================================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

if str(BASE_DIR) not in sys.path:
    sys.path.insert(
        0,
        str(BASE_DIR),
    )


# ============================================================
# IMPORT THREAT SERVICE
# ============================================================

from app.services.threat_service import (
    predict_threat,
    get_threat_model_info,
)


# ============================================================
# MODEL INFO
# ============================================================

print()
print("=" * 70)
print("MODEL INFO")
print("=" * 70)

info = get_threat_model_info()

print("Device:", info["device"])
print("Labels:", info["labels"])
print("Thresholds:", info["thresholds"])


# ============================================================
# TEST EXAMPLES
# ============================================================

examples = [

    "I will kill you",

    "main tumhara account hack kar dunga",

    "میں تمہیں جان سے مار دوں گا",

    "you are stupid",

    "aaj mausam bohat acha hai",

]


# ============================================================
# RUN PREDICTIONS
# ============================================================

for text in examples:

    print()
    print("=" * 70)

    print("TEXT:")
    print(text)

    print("-" * 70)

    result = predict_threat(
        text
    )

    print(
        "Overall Threat:",
        result["is_threat"]
    )

    print(
        "Primary Threat:",
        result["primary_threat"]
    )

    print(
        "Active Labels:",
        result["active_labels"]
    )

    print()

    print("Scores:")

    for label, score in result["scores"].items():

        print(
            f"{label:20s}"
            f" probability={score['probability']}"
            f" threshold={score['threshold']}"
            f" prediction={score['prediction']}"
        )


print()
print("=" * 70)
print("✅ LOCAL THREAT MODEL TEST COMPLETE")
print("=" * 70)