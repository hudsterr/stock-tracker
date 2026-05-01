#declaring tables for model
from database import Base
from sqlalchemy import Column, Integer, String, Float

class Portfolio(Base):
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True, nullable=False)
    quantity = Column(Float)
    buy_price = Column(Float)


#wired to main.py for api endpoints
