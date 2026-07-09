from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.textbook import Textbook
from app.models.user import User
from app.schemas.textbook import TextbookCreate, TextbookOut, TextbookDetail
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/textbooks", tags=["textbooks"])


@router.get("", response_model=list[TextbookOut])
def list_textbooks(
    search: str = Query(default="", max_length=200),
    category_id: int = Query(default=None),
    language: str = Query(default=None),
    db: Session = Depends(get_db),
):
    q = db.query(Textbook)
    if search:
        q = q.filter(Textbook.title.ilike(f"%{search}%"))
    if category_id:
        q = q.filter(Textbook.category_id == category_id)
    if language:
        q = q.filter(Textbook.language == language)

    textbooks = q.order_by(Textbook.title).limit(50).all()
    result = []
    for t in textbooks:
        out = TextbookOut.model_validate(t)
        out.listing_count = 0
        result.append(out)
    return result


@router.post("", response_model=TextbookOut)
def create_textbook(
    data: TextbookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.language not in ("zh", "en"):
        raise HTTPException(400, "language must be 'zh' or 'en'")
    textbook = Textbook(**data.model_dump())
    db.add(textbook)
    db.commit()
    db.refresh(textbook)
    return textbook


@router.get("/{textbook_id}", response_model=TextbookDetail)
def get_textbook(textbook_id: int, db: Session = Depends(get_db)):
    textbook = db.query(Textbook).filter(Textbook.id == textbook_id).first()
    if not textbook:
        raise HTTPException(404, "Textbook not found")
    detail = TextbookDetail.model_validate(textbook)
    detail.category_name = textbook.category.name
    detail.category_name_zh = textbook.category.name_zh
    return detail
