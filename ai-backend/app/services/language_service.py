# ============================================================
# SAFETALK AI
# LANGUAGE DETECTION SERVICE
# ENGLISH + URDU + ROMAN URDU
# ============================================================

import re
from typing import Dict, Any


# ============================================================
# ROMAN URDU COMMON WORDS
# ============================================================

ROMAN_URDU_WORDS = {
    # Pronouns / people
    "main",
    "mein",
    "mujhe",
    "mujh",
    "mera",
    "meri",
    "mere",
    "hum",
    "ham",
    "humein",
    "hamain",
    "tum",
    "tumhe",
    "tumhain",
    "tumhara",
    "tumhari",
    "tumhare",
    "aap",
    "ap",
    "apko",
    "aapko",
    "apka",
    "aapka",
    "apki",
    "aapki",
    "apke",
    "aapke",
    "wo",
    "woh",
    "ye",
    "yeh",

    # Common verbs
    "hai",
    "hain",
    "ho",
    "hun",
    "hoon",
    "tha",
    "thi",
    "the",
    "kar",
    "karo",
    "karen",
    "karna",
    "karta",
    "karti",
    "karte",
    "karunga",
    "karungi",
    "karega",
    "karegi",
    "kiya",
    "kia",
    "kr",
    "kro",
    "krna",
    "krunga",
    "krongi",
    "krdo",
    "kardo",
    "de",
    "do",
    "dena",
    "dunga",
    "dungi",
    "dega",
    "degi",
    "diya",
    "dia",
    "ja",
    "jao",
    "jana",
    "jayega",
    "jaega",
    "jaungi",
    "jaunga",
    "aa",
    "ao",
    "aao",
    "ana",
    "aana",
    "aya",
    "aaya",
    "ayega",
    "aega",
    "maar",
    "mar",
    "marna",
    "maarunga",
    "marunga",
    "mardunga",
    "mardungi",
    "marunga",
    "nikal",
    "nikalo",
    "hata",
    "hatao",
    "bata",
    "batao",
    "bol",
    "bolo",
    "sun",
    "suno",
    "dekh",
    "dekho",

    # Helpers / grammar
    "ka",
    "ki",
    "ke",
    "ko",
    "se",
    "sy",
    "ne",
    "nay",
    "ny",
    "par",
    "per",
    "pe",
    "pay",
    "tak",
    "liye",
    "ley",
    "liye",
    "wala",
    "wali",
    "wale",
    "waly",
    "wala",
    "agar",
    "agr",
    "magar",
    "lekin",
    "likin",
    "kyun",
    "kyu",
    "q",
    "kya",
    "kia",
    "kesy",
    "kaise",
    "kese",
    "kab",
    "kahan",
    "kidhar",
    "kon",
    "kaun",
    "kis",
    "kisi",
    "sab",
    "saray",
    "sare",
    "bohat",
    "bahut",
    "buhat",
    "zyada",
    "ziada",
    "thora",
    "thora",
    "thori",
    "thora",
    "bilkul",
    "abhi",
    "ab",
    "phir",
    "fir",
    "sirf",
    "bs",
    "bas",

    # Negation
    "nahi",
    "nahin",
    "nai",
    "ni",
    "mat",

    # Time
    "aj",
    "aaj",
    "kal",
    "parso",
    "raat",
    "subah",
    "shaam",

    # Common objects / social media terms
    "dost",
    "bhai",
    "behen",
    "bhen",
    "ghar",
    "kam",
    "kaam",
    "paisa",
    "paise",
    "account",
    "mobile",
    "phone",
    "message",
    "post",
    "video",
    "game",
    "band",
    "acha",
    "accha",
    "achi",
    "achha",
    "bura",
    "ganda",
    "ghalat",
    "galat",
    "sahi",

    # Threat / abuse related Roman Urdu
    "jaan",
    "jan",
    "maar",
    "mar",
    "marenge",
    "marunga",
    "mardunga",
    "mardonga",
    "mardungi",
    "hack",
    "hackkar",
    "hackkaro",
    "hackkarunga",
    "barbad",
    "barbaad",
    "khatam",
    "chodunga",
    "chorunga",
    "choro",
    "bewakoof",
    "pagal",
    "kutta",
    "kutte",
    "kutiya",
    "harami",
    "kamina",
    "kameena",
    "ghatiya",
}


# ============================================================
# STRONG ROMAN URDU PHRASES
# ============================================================

ROMAN_URDU_PHRASES = [
    r"\bmain\s+\w+\s+(karunga|karungi|karta|karti|karun)\b",
    r"\bmein\s+\w+\s+(karunga|karungi|karta|karti|karun)\b",

    r"\btumhara\b",
    r"\btumhari\b",
    r"\btumhare\b",

    r"\bmujhe\b",
    r"\bmujhko\b",

    r"\baapko\b",
    r"\baapka\b",
    r"\baapki\b",

    r"\bkar\s+dunga\b",
    r"\bkar\s+dungi\b",
    r"\bkar\s+do\b",

    r"\bmaar\s+dunga\b",
    r"\bmar\s+dunga\b",
    r"\bmaar\s+donga\b",
    r"\bmar\s+donga\b",

    r"\bjaan\s+se\b",
    r"\bjan\s+se\b",

    r"\bnahi\s+hai\b",
    r"\bnahi\s+ho\b",
    r"\bnahi\s+kar\b",

    r"\bkya\s+kar\b",
    r"\bkia\s+kar\b",

    r"\bkaise\s+\w+\b",
    r"\bkesy\s+\w+\b",

    r"\bbohat\s+\w+\b",
    r"\bbuhat\s+\w+\b",
]


# ============================================================
# URDU UNICODE RANGE
# ============================================================

URDU_CHAR_PATTERN = re.compile(
    r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]"
)


# ============================================================
# CLEAN TEXT
# ============================================================

def clean_text(text: str) -> str:

    text = str(text or "").strip()

    text = re.sub(
        r"https?://\S+|www\.\S+",
        " ",
        text
    )

    text = re.sub(
        r"@\w+",
        " ",
        text
    )

    text = re.sub(
        r"#",
        "",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# ============================================================
# TOKENIZE LATIN TEXT
# ============================================================

def get_tokens(text: str):

    return re.findall(
        r"[a-zA-Z]+",
        text.lower()
    )


# ============================================================
# COUNT URDU CHARACTERS
# ============================================================

def count_urdu_characters(text: str) -> int:

    return len(
        URDU_CHAR_PATTERN.findall(text)
    )


# ============================================================
# COUNT LETTERS
# ============================================================

def count_letters(text: str) -> int:

    return sum(
        1
        for char in text
        if char.isalpha()
    )


# ============================================================
# DETECT URDU SCRIPT
# ============================================================

def detect_urdu_script(text: str):

    total_letters = count_letters(text)

    if total_letters == 0:
        return 0.0

    urdu_chars = count_urdu_characters(
        text
    )

    ratio = (
        urdu_chars /
        total_letters
    )

    return ratio


# ============================================================
# ROMAN URDU WORD SCORE
# ============================================================

def get_roman_urdu_word_score(
    tokens
):

    if not tokens:
        return {
            "matches": [],
            "match_count": 0,
            "ratio": 0.0,
        }

    matches = [
        token
        for token in tokens
        if token in ROMAN_URDU_WORDS
    ]

    unique_matches = sorted(
        set(matches)
    )

    ratio = (
        len(matches) /
        len(tokens)
    )

    return {
        "matches": unique_matches,
        "match_count": len(matches),
        "ratio": ratio,
    }


# ============================================================
# ROMAN URDU PHRASE SCORE
# ============================================================

def get_roman_urdu_phrase_matches(
    text: str
):

    lowered = text.lower()

    matches = []

    for pattern in ROMAN_URDU_PHRASES:

        if re.search(
            pattern,
            lowered
        ):
            matches.append(
                pattern
            )

    return matches


# ============================================================
# NORMALIZE REQUESTED LANGUAGE
# ============================================================

def normalize_language_option(
    language: str
):

    value = str(
        language or "auto"
    ).strip().lower()

    aliases = {
        "auto": "auto",
        "auto detect": "auto",
        "automatic": "auto",

        "english": "english",
        "en": "english",

        "urdu": "urdu",
        "ur": "urdu",

        "roman urdu": "roman-urdu",
        "roman_urdu": "roman-urdu",
        "roman-urdu": "roman-urdu",
        "romanurdu": "roman-urdu",
    }

    return aliases.get(
        value,
        "auto"
    )


# ============================================================
# MANUAL LANGUAGE RESULT
# ============================================================

def get_manual_language_result(
    language: str
):

    labels = {
        "english": "English",
        "urdu": "Urdu",
        "roman-urdu": "Roman Urdu",
    }

    return {
        "code": language,

        "label": labels.get(
            language,
            "English"
        ),

        "confidence": 100.0,

        "method": "manual",

        "is_auto_detected": False,

        "signals": {
            "urdu_script_ratio": 0.0,
            "roman_urdu_matches": [],
            "roman_urdu_match_count": 0,
            "roman_urdu_ratio": 0.0,
            "roman_urdu_phrase_matches": 0,
        },
    }


# ============================================================
# AUTO LANGUAGE DETECTION
# ============================================================

def detect_language(
    text: str,
    selected_language: str = "auto"
) -> Dict[str, Any]:

    text = clean_text(text)

    selected_language = (
        normalize_language_option(
            selected_language
        )
    )

    # ========================================================
    # MANUAL LANGUAGE SELECTED
    # ========================================================

    if selected_language != "auto":

        return (
            get_manual_language_result(
                selected_language
            )
        )

    # ========================================================
    # EMPTY INPUT
    # ========================================================

    if not text:

        return {
            "code": "unknown",
            "label": "Unknown",
            "confidence": 0.0,
            "method": "auto",
            "is_auto_detected": True,

            "signals": {
                "urdu_script_ratio": 0.0,
                "roman_urdu_matches": [],
                "roman_urdu_match_count": 0,
                "roman_urdu_ratio": 0.0,
                "roman_urdu_phrase_matches": 0,
            },
        }

    # ========================================================
    # URDU SCRIPT DETECTION
    # ========================================================

    urdu_ratio = detect_urdu_script(
        text
    )

    if urdu_ratio >= 0.20:

        confidence = (
            75 +
            min(
                24,
                urdu_ratio * 25
            )
        )

        confidence = round(
            min(
                confidence,
                99.0
            ),
            2
        )

        return {
            "code": "urdu",
            "label": "Urdu",
            "confidence": confidence,
            "method": "auto",
            "is_auto_detected": True,

            "signals": {
                "urdu_script_ratio":
                    round(
                        urdu_ratio,
                        4
                    ),

                "roman_urdu_matches":
                    [],

                "roman_urdu_match_count":
                    0,

                "roman_urdu_ratio":
                    0.0,

                "roman_urdu_phrase_matches":
                    0,
            },
        }

    # ========================================================
    # LATIN TOKEN ANALYSIS
    # ========================================================

    tokens = get_tokens(
        text
    )

    roman_data = (
        get_roman_urdu_word_score(
            tokens
        )
    )

    phrase_matches = (
        get_roman_urdu_phrase_matches(
            text
        )
    )

    roman_match_count = (
        roman_data[
            "match_count"
        ]
    )

    roman_ratio = (
        roman_data[
            "ratio"
        ]
    )

    phrase_count = len(
        phrase_matches
    )

    # ========================================================
    # ROMAN URDU DECISION
    # ========================================================
    #
    # Strong phrase = strong signal
    #
    # 2+ Roman Urdu words = useful signal
    #
    # 30%+ Roman Urdu token ratio
    # prevents normal English from being
    # incorrectly classified too easily.
    # ========================================================

    is_roman_urdu = False

    if phrase_count >= 1:
        is_roman_urdu = True

    elif (
        roman_match_count >= 2
        and
        roman_ratio >= 0.20
    ):
        is_roman_urdu = True

    elif (
        roman_match_count >= 3
    ):
        is_roman_urdu = True

    if is_roman_urdu:

        confidence = (
            62
            +
            min(
                roman_match_count * 5,
                20
            )
            +
            min(
                phrase_count * 8,
                16
            )
            +
            min(
                roman_ratio * 20,
                10
            )
        )

        confidence = round(
            min(
                confidence,
                98.0
            ),
            2
        )

        return {
            "code":
                "roman-urdu",

            "label":
                "Roman Urdu",

            "confidence":
                confidence,

            "method":
                "auto",

            "is_auto_detected":
                True,

            "signals": {
                "urdu_script_ratio":
                    round(
                        urdu_ratio,
                        4
                    ),

                "roman_urdu_matches":
                    roman_data[
                        "matches"
                    ],

                "roman_urdu_match_count":
                    roman_match_count,

                "roman_urdu_ratio":
                    round(
                        roman_ratio,
                        4
                    ),

                "roman_urdu_phrase_matches":
                    phrase_count,
            },
        }

    # ========================================================
    # DEFAULT ENGLISH
    # ========================================================

    english_confidence = 90.0

    if roman_match_count == 1:
        english_confidence = 80.0

    if (
        roman_match_count >= 2
        and
        roman_ratio < 0.20
    ):
        english_confidence = 72.0

    return {
        "code":
            "english",

        "label":
            "English",

        "confidence":
            english_confidence,

        "method":
            "auto",

        "is_auto_detected":
            True,

        "signals": {
            "urdu_script_ratio":
                round(
                    urdu_ratio,
                    4
                ),

            "roman_urdu_matches":
                roman_data[
                    "matches"
                ],

            "roman_urdu_match_count":
                roman_match_count,

            "roman_urdu_ratio":
                round(
                    roman_ratio,
                    4
                ),

            "roman_urdu_phrase_matches":
                phrase_count,
        },
    }


# ============================================================
# LOCAL TEST
# ============================================================

if __name__ == "__main__":

    test_texts = [
        "I will kill you",

        "you piece of shit",

        "main tumhara account hack kar dunga",

        "mera phone bohat slow hai",

        "tum kya kar rahe ho",

        "میں تمہیں جان سے مار دوں گا",

        "یہ بہت اچھی ویڈیو ہے",
    ]

    print(
        "\n"
        "========================================"
    )

    print(
        "SAFETALK AI LANGUAGE DETECTION TEST"
    )

    print(
        "========================================"
    )

    for sample in test_texts:

        result = detect_language(
            sample
        )

        print(
            "\nTEXT:",
            sample
        )

        print(
            "LANGUAGE:",
            result["label"]
        )

        print(
            "CONFIDENCE:",
            result["confidence"]
        )

        print(
            "METHOD:",
            result["method"]
        )