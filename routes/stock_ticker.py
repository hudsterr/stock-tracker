from fastapi import APIRouter
import yfinance as yf

router = APIRouter()

@router.get("/stock/{ticker}")
def get_stock_price(ticker:str):
    stock = yf.Ticker(ticker)
    info = stock.info
    return {
        "name":info.get("shortName"),
        "price":info.get("currentPrice"),
        "pe_ratio":info.get("trailingPE"),
     }
        