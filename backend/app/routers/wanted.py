from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.wanted import Wanted
from app.models.user import User
from app.schemas.wanted import WantedCreate, WantedOut
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/wanted", tags=["wanted"])


@router.get("", response_model=list[WantedOut])
def list_wanted(
    category_id: int = Query(default=None),
    status: str = Query(default="open"),
    db: Session = Depends(get_db),
):
    q = db.query(Wanted)
    if category_id:
        q = q.filter(Wanted.category_id == category_id)
    if status:
        q = q.filter(Wanted.status == status)
    q = q.order_by(Wanted.created_at.desc()).limit(50)

    result = []
    for w in q.all():
        user = db.query(User).filter(User.id == w.user_id).first()
        from app.models.category import Category
        cat = db.query(Category).filter(Category.id == w.category_id).first()
        result.append(WantedOut(
            id=w.id, user_id=w.user_id, title=w.title, category_id=w.category_id,
            language=w.language, max_price=w.max_price, description=w.description,
            status=w.status, created_at=w.created_at,
            user_nickname=user.nickname if user else "",
            category_name_zh=cat.name_zh if cat else "",
        ))
    return result


@router.post("", response_model=WantedOut)
def create_wanted(
    data: WantedCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wanted = Wanted(user_id=current_user.id, **data.model_dump())
    db.add(wanted)
    db.commit()
    db.refresh(wanted)
    from app.models.category import Category
    cat = db.query(Category).filter(Category.id == wanted.category_id).first()
    return WantedOut(
        id=wanted.id, user_id=wanted.user_id, title=wanted.title, category_id=wanted.category_id,
        language=wanted.language, max_price=wanted.max_price, description=wanted.description,
        status=wanted.status, created_at=wanted.created_at,
        user_nickname=current_user.nickname,
        category_name_zh=cat.name_zh if cat else "",
    )


@router.patch("/{wanted_id}")
def close_wanted(
    wanted_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    w = db.query(Wanted).filter(Wanted.id == wanted_id).first()
    if not w:
        raise HTTPException(404, "Not found")
    if w.user_id != current_user.id:
        raise HTTPException(403, "Not yours")
    w.status = "closed"
    db.commit()
    return {"status": "ok"}


@router.get("/mine", response_model=list[WantedOut])
def my_wanted(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.category import Category
    result = []
    for w in db.query(Wanted).filter(Wanted.user_id == current_user.id).order_by(Wanted.created_at.desc()).all():
        cat = db.query(Category).filter(Category.id == w.category_id).first()
        result.append(WantedOut(
            id=w.id, user_id=w.user_id, title=w.title, category_id=w.category_id,
            language=w.language, max_price=w.max_price, description=w.description,
            status=w.status, created_at=w.created_at,
            user_nickname=current_user.nickname,
            category_name_zh=cat.name_zh if cat else "",
        ))
    return result
