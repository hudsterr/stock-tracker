from fastapi import APIRouter
import yfinance as yf

router = APIRouter()

#individual stock price fetcher here (takes in ticker and returns current price, pe ratio, etc.)

@router.get("/stock/{ticker}")
def get_stock_price(ticker:str):
    """Fetches the current price, P/E ratio, and short name of the specified stock ticker using the yfinance library."""
    stock = yf.Ticker(ticker)
    info = stock.info
    return {
        "name":info.get("shortName"),
        "price":info.get("currentPrice"),
        "pe_ratio":info.get("trailingPE"),
     }


router.get("/stock/{ticker}/history")
def get_stock_history(ticker:str):
    """Fetches the historical price data for the specified stock ticker over the past month using the yfinance library."""
    stock = yf.Ticker(ticker)
    history = stock.history(period="1mo")
    data = []
    for date, row in history.iterrows():
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "price": row["Close"]
        })
    return {
        "ticker": ticker.upper(),
        "history": data
    }