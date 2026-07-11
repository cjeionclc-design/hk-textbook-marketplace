from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, func, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    textbook_id = Column(Integer, ForeignKey("textbooks.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    condition = Column(Integer, nullable=False)
    cover_image = Column(String(500), default="")
    photos = Column(Text, default="")
    location = Column(String(200), default="")
    notes = Column(String(1000), default="")
    status = Column(String(20), default="active")
    created_at = Column(DateTime, server_default=func.now())

    textbook = relationship("Textbook", back_populates="listings")
    seller = relationship("User")
