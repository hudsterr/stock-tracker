# route for portfolio management (add/remove stocks, view portfolio)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:   
        db.close()




@router.post("/portfolio/add")
def add_to_portfolio(ticker:str, quantity:float, buy_price:float, db:Session=Depends(get_db)):
    holding = models.Portfolio(
        ticker=ticker.upper(),
        quantity=quantity,
        buy_price=buy_price
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return {"message": f"{quantity} shares of {ticker.upper()} have been added to your portifolio at a buy price of {buy_price}.", "id": holding.id}
    
    