from fastapi import APIRouter
from groq import Groq

router = APIRouter()

GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)

@router.get("/analysis/{ticker}")
def analyze_stock(ticker:str):
    prompt = f"Imagine you are a financial analyst. Analyze the stock {ticker}, using Black-Scholes pricer and Monte Carlo simulation to predict future price movements. Use historical data from the 1990s all the way to 2026 and onwards in order to predict future price movements. Only write 5 sentences MAX. Lastly, give the user insights on what decision would be optimal moving forward"

    response = client.chat.completions.create(
        model = "llama-3.3-70b-versatile",
        messages = [
            {"role":"user", "content":prompt}
        ]
    )

    return {
        "ticker":ticker.upper(),
        "analysis":response.choices[0].message.content
    }

