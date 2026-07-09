import datetime
from pydantic import BaseModel


class MessageCreate(BaseModel):
    receiver_id: int
    listing_id: int | None = None
    content: str


class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    listing_id: int | None
    content: str
    created_at: datetime.datetime
    sender_nickname: str = ""

    model_config = {"from_attributes": True}


class ConversationOut(BaseModel):
    partner_id: int
    partner_nickname: str
    listing_id: int | None
    listing_title: str = ""
    last_message: str
    last_message_at: datetime.datetime
    unread_count: int = 0
