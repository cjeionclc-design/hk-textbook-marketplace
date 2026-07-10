import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
SECRET_KEY = "hk-textbook-jwt-secret-2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
UPLOAD_DIR = "uploads"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "https://frontend-nine-ochre-13.vercel.app")
