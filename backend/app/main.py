import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Category, Textbook, Listing, Message
from app.routers import auth, categories, textbooks, listings, messages

SEED_CATEGORIES = [
    ("chinese", "中文"),
    ("english", "英文"),
    ("math", "数学"),
    ("ls", "通识教育"),
    ("physics", "物理"),
    ("chemistry", "化学"),
    ("biology", "生物"),
    ("economics", "经济"),
    ("bafs", "企会财"),
    ("ict", "资讯科技"),
    ("history", "历史"),
    ("geography", "地理"),
    ("chinese_history", "中国历史"),
    ("chinese_literature", "中国文学"),
    ("music", "音乐"),
    ("visual_arts", "视觉艺术"),
    ("pe", "体育"),
]


def create_app() -> FastAPI:
    app = FastAPI(title="HK Textbook Marketplace")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.cors_origins],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router)
    app.include_router(categories.router)
    app.include_router(textbooks.router)
    app.include_router(listings.router)
    app.include_router(messages.router)

    os.makedirs(settings.upload_dir, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

    @app.on_event("startup")
    def on_startup():
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        if db.query(Category).count() == 0:
            for name, name_zh in SEED_CATEGORIES:
                db.add(Category(name=name, name_zh=name_zh))
            db.commit()
        db.close()

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    @app.get("/api/debug-key")
    def debug_key():
        return {"key_preview": settings.secret_key[:8] + "...", "cors": settings.cors_origins}

    return app


app = create_app()
