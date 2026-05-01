



from database import SessionLocal, engine
from database import Base
import models
#database and models connected to main.py for api endpoints
from sqlalchemy.orm import Session

from fastapi import Depends
from fastapi import FastAPI
import uvicorn
import yfinance as yf

#table created

models.Base.metadata.create_all(bind=engine)



app = FastAPI()
@app.get("/")
def root():
    return {"message": "Welcome to the Stock Tracker API!"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:   
        db.close()

# stock price fetcher here

@app.get("/stock/{ticker}")
def get_stock_price(ticker:str):
    stock = yf.Ticker(ticker)
    info = stock.info
    return {
        "name":info.get("shortName"),
        "price":info.get("currentPrice"),
        "pe_ratio":info.get("trailingPE"),
     }
        
@app.post("/portfolio/add")
def add_to_portfolio(ticker:str, quantity:float, buy_price:float, db:Session=Depends(get_db)):
    holding = models.Portfolio(
        ticker=ticker.upper(),
        quantity=quantity,
        buy_price=buy_price
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return {"message": f"{quantity} shares of {ticker.upper()} have been added to your portifolio at a buy price of {buy_price}."}
    
    

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)