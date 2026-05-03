from fastapi import FastAPI
import uvicorn
from database import engine
import models
from routes import portfolio, stock_ticker, news, analysis


#routing done for cleaner code structure

app = FastAPI()
app.include_router(portfolio.router)
app.include_router(stock_ticker.router)
app.include_router(news.router)
app.include_router(analysis.router)



models.Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Welcome to the Stock Tracker API! - Made by Rdhster and Hudster"}
    




if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)