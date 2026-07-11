import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class ListingCreate(BaseModel):
    textbook_id: int
    price: Decimal
    condition: int = Field(ge=1, le=5)
    notes: str = ""


class ListingOut(BaseModel):
    id: int
    textbook_id: int
    seller_id: int
    price: Decimal
    condition: int
    cover_image: str = ""
    photos: str = ""
    notes: str
    status: str
    created_at: datetime.datetime
    textbook_title: str = ""
    textbook_language: str = ""
    textbook_original_price: Decimal = Decimal("0")
    textbook_category_id: int = 0
    textbook_category_name: str = ""
    textbook_category_name_zh: str = ""
    seller_nickname: str = ""

    model_config = {"from_attributes": True}


class ListingDetail(ListingOut):
    textbook_isbn: str = ""
    textbook_publisher: str = ""
