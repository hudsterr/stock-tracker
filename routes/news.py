from fastapi import APIRouter
import requests
import os

router = APIRouter()

NEWS_API_KEY = "2f6b8dbc7efd4349b6fa3bf24be3e6c0"

@router.get("/news/{ticker}")
def get_stock_news(ticker:str):
    """Fetches the latest news articles related to the specified stock ticker using the NewsAPI."""
    url = f"https://newsapi.org/v2/everything?q={ticker}&language=en&sortBy=publishedAt&pageSize=5&apiKey={NEWS_API_KEY}"

    response = requests.get(url)
    data = response.json()
    
    articles = []
    for article in data.get("articles", []):
        articles.append({
            "title": article.get("title"),
            "description": article.get("description"),
            "source": article.get("source", {}).get("name"),
            "url": article.get("url"),
            "published": article.get("publishedAt")
        })
    #dictionary of news articles related to ticker
    return {"ticker": ticker.upper(), "news": articles}