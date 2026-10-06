# ============================================================
# SAFETALK AI
# FASTAPI MAIN APPLICATION
# ============================================================

import os

from dotenv import load_dotenv

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router

from app.routes.analyze import router as analyze_router

from app.routes.model_status import router as model_status_router

# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(

    title="SafeTalkAI AI Backend",

    description=(
        "AI backend for multilingual sentiment, "
        "threat, toxicity and hate speech analysis."
    ),

    version=os.getenv(
        "APP_VERSION",
        "1.0.0",
    ),

)


# ============================================================
# FRONTEND URL
# ============================================================

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        FRONTEND_URL,
    ],

    allow_credentials=True,

    allow_methods=[
        "*",
    ],

    allow_headers=[
        "*",
    ],

)


# ============================================================
# ROOT ROUTE
# ============================================================

@app.get("/")
async def root():

    return {

        "success": True,

        "name":
            "SafeTalkAI AI Backend",

        "version":
            os.getenv(
                "APP_VERSION",
                "1.0.0",
            ),

        "status":
            "running",

    }


# ============================================================
# ROUTES
# ============================================================

app.include_router(
    health_router
)

app.include_router(
    analyze_router
)

app.include_router(
    model_status_router
)