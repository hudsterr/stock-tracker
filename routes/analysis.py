from fastapi import APIRouter
from groq import Groq
import os
from dotenv import load_dotenv
import requests


load_dotenv()
router = APIRouter()
#stock analysis function here (takes in ticker and returns analysis of stock using groq api)
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

client = Groq(api_key=GROQ_API_KEY)


@router.get("/analysis/{ticker}")
def analyze_stock(ticker:str):
    """Analyzes the specified stock ticker using the Groq API, providing insights on future price movements based on historical data and financial modeling techniques."""
    url = f"https://newsapi.org/v2/everything?q={ticker}&language=en&sortBy=publishedAt&pageSize=5&apiKey={os.getenv('NEWS_API_KEY')}"
    response = requests.get(url)
    articles = response.json().get("articles", [])

    #headline of news articles related to ticker
    headlines = "\n".join([article.get("title") for article in articles])

    prompt = f"Imagine you are a financial analyst. Analyze the stock {ticker}, using Black-Scholes pricer and Monte Carlo simulation to predict future price movements. Use historical data from the 1990s all the way to 2026 and onwards in order to predict future price movements. Only write 5 sentences MAX. Also at the end of the score, give it a sentiment score of either Bullish, Bearish or Neutral. Lastly, give the user insights on what decision would be optimal moving forward\n\nHeadlines:\n{headlines}"

    response = client.chat.completions.create(
        model = "llama-3.3-70b-versatile",
        messages = [
            {"role":"user", "content":prompt}
        ]
    )

    return {
        "ticker":ticker.upper(),
        "headlines_used": [article.get("title") for article in articles],
        "sentiment":response.choices[0].message.content
    }   

