import datetime
from decimal import Decimal
from pydantic import BaseModel


class WantedCreate(BaseModel):
    title: str
    category_id: int
    language: str = "en"
    max_price: Decimal = Decimal("0")
    description: str = ""


class WantedOut(BaseModel):
    id: int
    user_id: int
    title: str
    category_id: int
    language: str
    max_price: Decimal
    description: str
    status: str
    created_at: datetime.datetime
    user_nickname: str = ""
    category_name_zh: str = ""

    model_config = {"from_attributes": True}
