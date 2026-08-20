from fastapi import APIRouter, HTTPException, Request
import os
from dotenv import load_dotenv
import httpx

load_dotenv()
router = APIRouter()
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

@router.get("/news/{ticker}")
async def get_stock_news(ticker: str, request: Request):
    """Fetches the latest news articles related to the specified stock ticker using the NewsAPI."""
    url = (
        f"https://newsapi.org/v2/everything"
        f"?q={ticker}&language=en&sortBy=publishedAt&pageSize=5&apiKey={NEWS_API_KEY}"
    )

    client = request.app.state.http_client  # 👈 reuse the shared client

    try:
        response = await client.get(url)
        response.raise_for_status()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="News API request timed out")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="News API error")

    data = response.json()
    articles = [
        {
            "title": article.get("title"),
            "description": article.get("description"),
            "source": article.get("source", {}).get("name"),
            "url": article.get("url"),
            "published": article.get("publishedAt"),
        }
        for article in data.get("articles", [])
    ]

    return {"ticker": ticker.upper(), "news": articles}