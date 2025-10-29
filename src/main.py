"""Main FastAPI Application Entry Point"""
from fastapi import FastAPI
from src.infrastructure.api.routes import countries, change

app = FastAPI(
    title="Cash Register API",
    description="Multi-country cash register system with extensible denomination support",
    version="1.0.0"
)

app.include_router(countries.router)
app.include_router(change.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to Cash Register API"}
