from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import User, Category
from app.routers import auth


def create_app() -> FastAPI:
    app = FastAPI(title="HK Textbook Marketplace")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router)

    @app.on_event("startup")
    def on_startup():
        Base.metadata.create_all(bind=engine)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()
