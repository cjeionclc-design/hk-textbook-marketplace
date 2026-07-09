import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres.ueavldxndnzftbymwntn:HKbooks%21%402025@aws-0-ap-east-1.pooler.supabase.com:5432/postgres?sslmode=require")
SECRET_KEY = "hk-textbook-jwt-secret-2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
UPLOAD_DIR = "uploads"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")
