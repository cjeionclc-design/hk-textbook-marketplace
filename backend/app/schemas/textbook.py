from decimal import Decimal
from pydantic import BaseModel


class TextbookCreate(BaseModel):
    title: str
    isbn: str = ""
    publisher: str = ""
    language: str = "en"
    original_price: Decimal
    category_id: int


class TextbookOut(BaseModel):
    id: int
    title: str
    isbn: str
    publisher: str
    language: str
    original_price: Decimal
    category_id: int
    listing_count: int = 0

    model_config = {"from_attributes": True}


class TextbookDetail(TextbookOut):
    category_name: str = ""
    category_name_zh: str = ""
