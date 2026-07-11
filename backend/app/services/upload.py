import os
import uuid
from io import BytesIO
from fastapi import UploadFile
from PIL import Image

from app.config import UPLOAD_DIR

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_SIZE = (1200, 1200)
QUALITY = 75


def save_upload(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename or ".jpg")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        ext = ".jpg"

    filename = f"{uuid.uuid4().hex}.jpg"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(UPLOAD_DIR, filename)

    data = file.file.read()
    try:
        img = Image.open(BytesIO(data))
        img.thumbnail(MAX_SIZE, Image.LANCZOS)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        img.save(filepath, "JPEG", quality=QUALITY, optimize=True)
    except Exception:
        with open(filepath, "wb") as f:
            f.write(data)

    return f"/uploads/{filename}"
