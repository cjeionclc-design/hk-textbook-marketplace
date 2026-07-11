import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from sqlalchemy import text

from app.config import CORS_ORIGINS, UPLOAD_DIR
from app.database import engine, Base, SessionLocal
from app.models import User, Category, Textbook, Listing, Message, Transaction, Review, Wanted, Report, Favorite
from app.routers import auth, categories, textbooks, listings, messages, transactions, reviews, wanted, reports, favorites, stats

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
        allow_origins=[CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router)
    app.include_router(categories.router)
    app.include_router(textbooks.router)
    app.include_router(listings.router)
    app.include_router(messages.router)
    app.include_router(transactions.router)
    app.include_router(reviews.router)
    app.include_router(wanted.router)
    app.include_router(reports.router)
    app.include_router(favorites.router)
    app.include_router(stats.router)

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

    @app.on_event("startup")
    def on_startup():
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        migrations = [
            "ALTER TABLE listings ADD COLUMN IF NOT EXISTS cover_image VARCHAR(500) DEFAULT ''",
            "ALTER TABLE listings ADD COLUMN IF NOT EXISTS location VARCHAR(200) DEFAULT ''",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT ''",
        ]
        for m in migrations:
            try:
                db.execute(text(m))
                db.commit()
            except Exception:
                db.rollback()
        if db.query(Category).count() == 0:
            for name, name_zh in SEED_CATEGORIES:
                db.add(Category(name=name, name_zh=name_zh))
            db.commit()
        db.close()

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()
