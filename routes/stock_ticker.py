from fastapi import APIRouter, HTTPException
import yfinance as yf
import asyncio

router = APIRouter()

def _fetch_stock_info(ticker: str) -> dict:
    """Synchronous helper — runs in a thread pool."""
    stock = yf.Ticker(ticker)
    info = stock.info
    if not info or "currentPrice" not in info:
        raise ValueError(f"No data found for ticker: {ticker}")
    return info

def _fetch_stock_history(ticker: str, period: str) -> list:
    """Synchronous helper — runs in a thread pool."""
    stock = yf.Ticker(ticker)
    history = stock.history(period=period)
    return [
        {
            "date": date.strftime("%Y-%m-%d"),
            "price": round(row["Close"], 2),
        }
        for date, row in history.iterrows()
    ]

@router.get("/stock/{ticker}")
async def get_stock_price(ticker: str):
    """Fetches the current price, P/E ratio, and short name of the specified stock ticker."""
    loop = asyncio.get_event_loop()
    try:
        info = await loop.run_in_executor(None, _fetch_stock_info, ticker)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return {
        "name": info.get("shortName"),
        "price": info.get("currentPrice"),
        "pe_ratio": info.get("trailingPE"),
    }

@router.get("/stock/{ticker}/history")
async def get_stock_history(ticker: str, period: str = "1mo"):
    """Fetches the historical price data for the specified stock ticker."""
    loop = asyncio.get_event_loop()
    try:
        data = await loop.run_in_executor(None, _fetch_stock_history, ticker, period)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

    return {
        "ticker": ticker.upper(),
        "history": data,
    }