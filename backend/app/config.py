import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://hk_textbook_db_user:gAl4NGCTieZBLe7forketrHRAaVX0w4t@dpg-d986hinavr4c73907u0g-a.oregon-postgres.render.com/hk_textbook_db?sslmode=require")
SECRET_KEY = "hk-textbook-jwt-secret-2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
UPLOAD_DIR = "uploads"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "https://frontend-nine-ochre-13.vercel.app")
