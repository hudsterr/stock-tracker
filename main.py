
#make simple app here



from fastapi import FastAPI
import uvicorn
import yfinance as yf

app = FastAPI()
@app.get("/")
def root():
    return {"message": "Welcome to the Stock Tracker API!"}

# stock price fetcher here

@app.get("/stock/{ticker}")
def get_stock_price(ticker:str):
    stock = yf.Ticker(ticker)
    info = stock.info
    return{
        "name":info.get("shortName"),
        "price":info.get("currentPrice"),
        "pe_ratio":info.get("trailingPE"),
     }
        
    
    
    

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)