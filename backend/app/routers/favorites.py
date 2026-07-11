from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.favorite import Favorite
from app.models.listing import Listing
from app.models.user import User
from app.schemas.listing import ListingOut
from app.services.auth import get_current_user
from app.routers.listings import _enrich

router = APIRouter(prefix="/api/favorites", tags=["favorites"])


@router.get("", response_model=list[ListingOut])
def my_favorites(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    favs = db.query(Favorite).filter(Favorite.user_id == current_user.id).order_by(Favorite.created_at.desc()).all()
    return [_enrich(f.listing) for f in favs if f.listing]


@router.post("/{listing_id}")
def add_favorite(listing_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not db.query(Listing).filter(Listing.id == listing_id).first():
        raise HTTPException(404, "Listing not found")
    existing = db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.listing_id == listing_id).first()
    if existing:
        raise HTTPException(400, "Already favorited")
    db.add(Favorite(user_id=current_user.id, listing_id=listing_id))
    db.commit()
    return {"status": "ok"}


@router.delete("/{listing_id}")
def remove_favorite(listing_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    fav = db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.listing_id == listing_id).first()
    if not fav:
        raise HTTPException(404, "Not found")
    db.delete(fav)
    db.commit()
    return {"status": "ok"}


@router.get("/check/{listing_id}")
def check_favorite(listing_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    fav = db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.listing_id == listing_id).first()
    return {"favorited": fav is not None}
