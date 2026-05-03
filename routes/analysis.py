from fastapi import APIRouter
from groq import Groq
import os
from dotenv import load_dotenv


load_dotenv()
router = APIRouter()
#stock analysis function here (takes in ticker and returns analysis of stock using groq api)
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

client = Groq(api_key=GROQ_API_KEY)


@router.get("/analysis/{ticker}")
def analyze_stock(ticker:str):
    '''Analyzes the specified stock ticker using the Groq API, providing insights based on historical data and predictive modeling. The analysis includes predictions of future price movements using the Black-Scholes pricer and Monte Carlo simulation, utilizing historical data from the 1990s to 2026 and beyond. The response is limited to a maximum of 5 sentences, offering concise insights and optimal decision-making recommendations for the user moving forward.'''
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

