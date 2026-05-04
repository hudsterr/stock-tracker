# route for portfolio management (add/remove stocks, view portfolio)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import yfinance as yf

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
    """Adds a stock holding to the portfolio with the provided ticker, quantity, and buy price."""

    holding = models.Portfolio(
        ticker=ticker.upper(),
        quantity=quantity,
        buy_price=buy_price
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return {"message": f"{quantity} shares of {ticker.upper()} have been added to your portifolio at a buy price of {buy_price}.", "id": holding.id}


@router.delete("/portfolio/remove/{holding_id}")
def remove_stock(holding_id:int, db:Session=Depends(get_db)):
    """Deletes a stock holding from the portfolio based on the provided holding ID."""
    holding = db.query(models.Portfolio).filter(models.Portfolio.id == holding_id).first()
    if holding:
        db.delete(holding)
        db.commit()
       
        return {"Alert": f"{holding.ticker.upper()} has been removed from your portfolio."}
    else:
        raise HTTPException(status_code=404, detail="Holding not found")    
    

#view portfolio function here (returns list of all holdings in portfolio)

@router.get("/portfolio")
def get_portfolio(db: Session = Depends(get_db)):
    """Returns a list of all stock holdings in the portfolio, including current price and gain/loss information."""
    holdings = db.query(models.Portfolio).all()
    
    result = []
    for holding in holdings:
        stock = yf.Ticker(holding.ticker)
        current_price = stock.info.get("currentPrice", 0)
        gain_loss = (current_price - holding.buy_price) * holding.quantity


        result.append({
            "id": holding.id,
            "ticker": holding.ticker,
            "quantity": holding.quantity,
            "buy_price": holding.buy_price,
            "current_price": current_price,
            "gain_loss": gain_loss,
        })
    return result