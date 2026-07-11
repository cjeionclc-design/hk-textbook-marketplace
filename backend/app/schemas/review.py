import datetime
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    transaction_id: int
    reviewee_id: int
    rating: int = Field(ge=1, le=5)
    comment: str = ""


class ReviewOut(BaseModel):
    id: int
    reviewer_id: int
    reviewee_id: int
    rating: int
    comment: str
    created_at: datetime.datetime
    reviewer_nickname: str = ""

    model_config = {"from_attributes": True}


class UserRating(BaseModel):
    average: float = 0
    count: int = 0
    reviews: list[ReviewOut] = []
