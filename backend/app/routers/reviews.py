from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.review import Review
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewOut, UserRating
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.get("/user/{user_id}", response_model=UserRating)
def user_rating(user_id: int, db: Session = Depends(get_db)):
    reviews = (
        db.query(Review)
        .filter(Review.reviewee_id == user_id)
        .order_by(Review.created_at.desc())
        .all()
    )
    avg = db.query(func.avg(Review.rating)).filter(Review.reviewee_id == user_id).scalar() or 0
    return UserRating(
        average=round(float(avg), 1),
        count=len(reviews),
        reviews=[
            ReviewOut(
                id=r.id,
                reviewer_id=r.reviewer_id,
                reviewee_id=r.reviewee_id,
                rating=r.rating,
                comment=r.comment,
                created_at=r.created_at,
                reviewer_nickname=db.query(User).filter(User.id == r.reviewer_id).first().nickname,
            )
            for r in reviews
        ],
    )


@router.post("", response_model=ReviewOut)
def create_review(
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    txn = db.query(Transaction).filter(Transaction.id == data.transaction_id).first()
    if not txn:
        raise HTTPException(404, "Transaction not found")
    if txn.buyer_id != 0 and txn.buyer_id != current_user.id:
        raise HTTPException(403, "Not your transaction")

    existing = db.query(Review).filter(Review.transaction_id == data.transaction_id).first()
    if existing:
        raise HTTPException(400, "Already reviewed")

    review = Review(
        transaction_id=data.transaction_id,
        reviewer_id=current_user.id,
        reviewee_id=data.reviewee_id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    return ReviewOut(
        id=review.id,
        reviewer_id=review.reviewer_id,
        reviewee_id=review.reviewee_id,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
        reviewer_nickname=current_user.nickname,
    )
