# ============================================================
# SAFETALK AI
# HEALTH ROUTE
# ============================================================

from fastapi import APIRouter


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(

    prefix="/health",

    tags=[
        "Health",
    ],

)


# ============================================================
# HEALTH CHECK
# ============================================================

@router.get("")
async def health_check():

    return {

        "success":
            True,

        "service":
            "SafeTalkAI AI Backend",

        "status":
            "running",

        "message":
            "AI backend is working correctly.",

    }