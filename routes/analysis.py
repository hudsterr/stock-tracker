from fastapi import APIRouter, HTTPException, Request
from groq import AsyncGroq
import asyncio
import os
from dotenv import load_dotenv
import httpx

load_dotenv()
router = APIRouter()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
NEWS_API_KEY = os.getenv('NEWS_API_KEY')

# AsyncGroq client — initialized once at module level
groq_client = AsyncGroq(api_key=GROQ_API_KEY)

@router.get("/analysis/{ticker}")
async def analyze_stock(ticker: str, request: Request):
    """Analyzes the specified stock ticker using the Groq API, providing insights on
    future price movements based on historical data and financial modeling techniques."""

    news_url = (
        f"https://newsapi.org/v2/everything"
        f"?q={ticker}&language=en&sortBy=publishedAt&pageSize=5&apiKey={NEWS_API_KEY}"
    )

    # Shared HTTP client from main.py lifespan
    client = request.app.state.http_client

    # fetch news asynchronously to include in the analysis prompt
    try:
        news_response = await client.get(news_url)
        news_response.raise_for_status()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="News API request timed out")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="News API error")

    articles = news_response.json().get("articles", [])
    headlines = "\n".join([article.get("title", "") for article in articles])

    prompt = (
        f"Imagine you are a financial analyst. Analyze the stock {ticker}, using "
        f"Black-Scholes pricer and Monte Carlo simulation to predict future price movements. "
        f"Use historical data from the 1990s all the way to 2026 and onwards in order to predict "
        f"future price movements. Only write 5 sentences MAX. Also at the end of the score, give it "
        f"a sentiment score of either Bullish, Bearish or Neutral. Lastly, give the user insights on "
        f"what decision would be optimal moving forward. Give your answer in bullet points and "
        f"highlight the important aspects:\n\nHeadlines:\n{headlines}"
    )

    # Step 2: Call Groq asynchronously
    try:
        groq_response = await groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(e)}")

    return {
        "ticker": ticker.upper(),
        "headlines_used": [article.get("title") for article in articles],
        "sentiment": groq_response.choices[0].message.content
    }