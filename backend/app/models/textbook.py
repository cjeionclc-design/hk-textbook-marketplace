from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Textbook(Base):
    __tablename__ = "textbooks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    isbn = Column(String(20), default="")
    publisher = Column(String(200), default="")
    language = Column(String(10), nullable=False, default="en")
    original_price = Column(Numeric(10, 2), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    category = relationship("Category")
    listings = relationship("Listing", back_populates="textbook")
