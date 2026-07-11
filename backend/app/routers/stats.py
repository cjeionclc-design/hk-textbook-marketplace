from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.message import Message
from app.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/stats", tags=["stats"])


class UserStats(BaseModel):
    user_id: int
    listing_count: int = 0
    avg_response_hours: float = 0
    response_rate: int = 0

    model_config = {"from_attributes": True}


@router.get("/user/{user_id}", response_model=UserStats)
def user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return UserStats(user_id=user_id)
    listing_count = len(user.listings) if hasattr(user, 'listings') else 0

    received = db.query(Message).filter(Message.receiver_id == user_id).order_by(Message.created_at).all()
    avg_hours = 0
    response_rate = 0
    if received:
        replied_count = 0
        total_time = 0
        count = 0
        for m in received:
            reply = db.query(Message).filter(
                Message.sender_id == user_id,
                Message.receiver_id == m.sender_id,
                Message.created_at > m.created_at
            ).order_by(Message.created_at).first()
            if reply:
                replied_count += 1
                diff = (reply.created_at - m.created_at).total_seconds() / 3600
                total_time += diff
                count += 1
        response_rate = round(replied_count / len(received) * 100) if received else 0
        avg_hours = round(total_time / count, 1) if count > 0 else 0

    return UserStats(user_id=user_id, listing_count=listing_count, avg_response_hours=avg_hours, response_rate=response_rate)
