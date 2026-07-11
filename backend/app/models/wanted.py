from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, func

from app.database import Base


class Wanted(Base):
    __tablename__ = "wanted"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(500), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    language = Column(String(10), default="en")
    max_price = Column(Numeric(10, 2), default=0)
    description = Column(String(1000), default="")
    status = Column(String(20), default="open")
    created_at = Column(DateTime, server_default=func.now())
