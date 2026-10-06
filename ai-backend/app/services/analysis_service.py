# ============================================================
# SAFETALK AI
# ANALYSIS SERVICE
# ============================================================


# ============================================================
# TEMPORARY ANALYSIS FUNCTION
#
# IMPORTANT:
# Later real trained AI models will replace this.
# ============================================================

def analyze_text(
    text: str,
    language: str = "auto",
):


    # ========================================================
    # LANGUAGE
    # ========================================================

    selected_language = (
        "English"
        if language == "auto"
        else language
    )


    # ========================================================
    # TEMPORARY RESULT
    # ========================================================

    return {

        "language":
            selected_language,


        # ====================================================
        # SENTIMENT
        # ====================================================

        "sentiment": {

            "label":
                "Negative",

            "confidence":
                98.0,

        },


        # ====================================================
        # THREAT STATUS
        # ====================================================

        "threatStatus":
            "Threat Detected",


        # ====================================================
        # PRIMARY THREAT
        # ====================================================

        "primaryThreat": {

            "label":
                "Death Threat",

            "confidence":
                96.0,

        },


        # ====================================================
        # MULTI-LABEL THREAT CATEGORIES
        # ====================================================

        "threatCategories": [

            {

                "label":
                    "Death Threat",

                "confidence":
                    96.0,

            },

            {

                "label":
                    "Abusive Language",

                "confidence":
                    88.0,

            },

            {

                "label":
                    "Harassment",

                "confidence":
                    63.0,

            },

            {

                "label":
                    "Physical Threat",

                "confidence":
                    42.0,

            },

            {

                "label":
                    "Cyber Threat",

                "confidence":
                    12.0,

            },

            {

                "label":
                    "Hate Speech",

                "confidence":
                    8.0,

            },

            {

                "label":
                    "Sexual Threat",

                "confidence":
                    3.0,

            },

            {

                "label":
                    "Self-Harm Related",

                "confidence":
                    2.0,

            },

        ],


        # ====================================================
        # TOXICITY
        # ====================================================

        "toxicity": {

            "label":
                "Toxic",

            "confidence":
                91.0,

        },


        # ====================================================
        # HATE SPEECH
        # ====================================================

        "hateSpeech": {

            "label":
                "Not Detected",

            "confidence":
                8.0,

        },


        # ====================================================
        # RISK
        # ====================================================

        "riskScore":
            95,

        "riskLevel":
            "Critical",


        # ====================================================
        # EXPLAINABLE AI
        # ====================================================

        "importantWords": [

            "kill you",

            "idiot",

        ],


        "explanation": (

            "Temporary AI response. "

            "Real trained models will replace "

            "this result later."

        ),

    }