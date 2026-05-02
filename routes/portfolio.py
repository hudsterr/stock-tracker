# route for portfolio management (add/remove stocks, view portfolio)
from fastapi import APIRouter, Depends, HTTPException
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

#add stock function here (takes in ticker, quantity, buy price and adds it to portfolio)

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

#delete stock function here (takes in holding id and deletes it from portfolio)


@router.delete("/portfolio/remove/{holding_id}")
def remove_stock(holding_id:int, db:Session=Depends(get_db)):
    holding = db.query(models.Portfolio).filter(models.Portfolio.id == holding_id).first()
    if holding:
        db.delete(holding)
        db.commit()
        db.refresh(holding)
        return {"Alert": f"{holding.ticker.upper()} has been removed from your portfolio."}
    else:
        raise HTTPException(status_code=404, detail="Holding not found")    
    

#view portfolio function here (returns list of all holdings in portfolio)

@router.get("/portfolio")
def get_portfolio(db: Session = Depends(get_db)):
    holdings = db.query(models.Portfolio).all()
    return holdings