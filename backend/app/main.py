from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.router import router as auth_router
from app.core.config import settings
from app.machining.router import process_router as machining_process_router
from app.machining.router import router as machining_router

app = FastAPI(title="加工管理システム + 工具管理システム API")

origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(machining_router)
app.include_router(machining_process_router)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}
