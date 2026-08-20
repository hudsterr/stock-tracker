from fastapi import FastAPI
import uvicorn
from database import engine
import models
from routes import portfolio, stock_ticker, news, analysis
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import httpx

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create one shared async HTTP client for all routes
    app.state.http_client = httpx.AsyncClient(timeout=10.0)
    models.Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: cleanly close the client
    await app.state.http_client.aclose()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio.router)
app.include_router(stock_ticker.router)
app.include_router(news.router)
app.include_router(analysis.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Stock Tracker API! - Made by Rdhster and Hudster"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)