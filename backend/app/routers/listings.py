import json
import math
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.listing import Listing
from app.models.textbook import Textbook
from app.models.user import User
from app.schemas.listing import ListingCreate, ListingOut, ListingDetail
from app.services.auth import get_current_user
from app.services.upload import save_upload

router = APIRouter(prefix="/api/listings", tags=["listings"])


def _enrich(listing: Listing) -> ListingOut:
    out = ListingOut.model_validate(listing)
    out.textbook_title = listing.textbook.title
    out.textbook_language = listing.textbook.language
    out.textbook_original_price = listing.textbook.original_price
    out.textbook_category_id = listing.textbook.category_id
    out.textbook_category_name = listing.textbook.category.name
    out.textbook_category_name_zh = listing.textbook.category.name_zh
    out.seller_nickname = listing.seller.nickname
    return out


@router.get("")
def search_listings(
    search: str = Query(default="", max_length=200),
    category_id: int = Query(default=None),
    language: str = Query(default=None),
    condition: int = Query(default=None, ge=1, le=5),
    min_price: Decimal = Query(default=None),
    max_price: Decimal = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    q = db.query(Listing).join(Textbook).filter(Listing.status == "active")

    if search:
        q = q.filter(Textbook.title.ilike(f"%{search}%"))
    if category_id:
        q = q.filter(Textbook.category_id == category_id)
    if language:
        q = q.filter(Textbook.language == language)
    if condition is not None:
        q = q.filter(Listing.condition == condition)
    if min_price is not None:
        q = q.filter(Listing.price >= min_price)
    if max_price is not None:
        q = q.filter(Listing.price <= max_price)

    total = q.count()
    total_pages = max(1, math.ceil(total / page_size))
    listings = q.order_by(Listing.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": [_enrich(l) for l in listings],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.post("", response_model=ListingOut)
async def create_listing(
    textbook_id: int = Form(...),
    price: Decimal = Form(...),
    condition: int = Form(..., ge=1, le=5),
    notes: str = Form(""),
    photos: list[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    textbook = db.query(Textbook).filter(Textbook.id == textbook_id).first()
    if not textbook:
        raise HTTPException(404, "Textbook not found")

    photo_paths = []
    for p in photos[:5]:
        if p.filename:
            photo_paths.append(save_upload(p))

    listing = Listing(
        textbook_id=textbook_id,
        seller_id=current_user.id,
        price=price,
        condition=condition,
        notes=notes,
        photos=json.dumps(photo_paths),
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return _enrich(listing)


@router.get("/mine", response_model=list[ListingOut])
def my_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    listings = (
        db.query(Listing)
        .filter(Listing.seller_id == current_user.id)
        .order_by(Listing.created_at.desc())
        .all()
    )
    return [_enrich(l) for l in listings]


@router.get("/{listing_id}", response_model=ListingDetail)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(404, "Listing not found")
    detail = ListingDetail.model_validate(_enrich(listing))
    detail.textbook_isbn = listing.textbook.isbn
    detail.textbook_publisher = listing.textbook.publisher
    return detail


@router.patch("/{listing_id}/status")
def update_status(
    listing_id: int,
    status: str = Query(..., pattern="^(active|sold)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(404, "Listing not found")
    if listing.seller_id != current_user.id:
        raise HTTPException(403, "Not your listing")
    listing.status = status
    db.commit()
    return {"status": "ok"}
