from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres.ueavldxndnzftbymwntn:HKbooks%21%402025@aws-0-ap-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
    secret_key: str = "hk-textbook-jwt-secret-2026"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7
    upload_dir: str = "uploads"
    cors_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()
