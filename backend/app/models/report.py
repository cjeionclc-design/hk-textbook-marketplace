from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func

from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=True)
    reported_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reason = Column(String(100), nullable=False)
    description = Column(String(1000), default="")
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, server_default=func.now())
