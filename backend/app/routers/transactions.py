from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.transaction import Transaction
from app.models.listing import Listing
from app.models.review import Review
from app.models.user import User
from app.schemas.transaction import TransactionCreate, TransactionOut
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionOut])
def my_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    txns = (
        db.query(Transaction)
        .filter(or_(Transaction.buyer_id == current_user.id, Transaction.seller_id == current_user.id))
        .order_by(Transaction.completed_at.desc())
        .all()
    )
    result = []
    for t in txns:
        out = TransactionOut(
            id=t.id,
            buyer_id=t.buyer_id,
            seller_id=t.seller_id,
            listing_id=t.listing_id,
            completed_at=t.completed_at,
            buyer_nickname=t.buyer.nickname,
            seller_nickname=t.seller.nickname,
            textbook_title=t.listing.textbook.title,
            price=float(t.listing.price),
            reviewed=db.query(Review).filter(Review.transaction_id == t.id).first() is not None,
        )
        result.append(out)
    return result


@router.post("", response_model=TransactionOut)
def complete_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    listing = db.query(Listing).filter(Listing.id == data.listing_id).first()
    if not listing:
        raise HTTPException(404, "Listing not found")
    if listing.seller_id != current_user.id:
        raise HTTPException(403, "Not your listing")

    existing = db.query(Transaction).filter(Transaction.listing_id == data.listing_id).first()
    if existing:
        raise HTTPException(400, "Transaction already exists")

    listing.status = "sold"
    txn = Transaction(buyer_id=0, seller_id=current_user.id, listing_id=data.listing_id)
    db.add(txn)
    db.commit()
    db.refresh(txn)

    return TransactionOut(
        id=txn.id,
        buyer_id=txn.buyer_id,
        seller_id=txn.seller_id,
        listing_id=txn.listing_id,
        completed_at=txn.completed_at,
        buyer_nickname="",
        seller_nickname=current_user.nickname,
        textbook_title=listing.textbook.title,
        price=float(listing.price),
        reviewed=False,
    )
