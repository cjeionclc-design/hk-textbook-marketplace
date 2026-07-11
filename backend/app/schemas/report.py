from pydantic import BaseModel


class ReportCreate(BaseModel):
    listing_id: int | None = None
    reported_user_id: int | None = None
    reason: str
    description: str = ""
