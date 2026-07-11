import datetime
from pydantic import BaseModel


class TransactionCreate(BaseModel):
    listing_id: int


class TransactionOut(BaseModel):
    id: int
    buyer_id: int
    seller_id: int
    listing_id: int
    completed_at: datetime.datetime
    buyer_nickname: str = ""
    seller_nickname: str = ""
    textbook_title: str = ""
    price: float = 0
    reviewed: bool = False

    model_config = {"from_attributes": True}
