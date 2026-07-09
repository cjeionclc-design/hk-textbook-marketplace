import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base
from app.models import User, Category, Textbook, Listing, Message
from app.routers import auth, categories, textbooks, listings, messages


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

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()
