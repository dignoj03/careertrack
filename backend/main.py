from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routes import applications, dashboard, interviews


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CareerTrack API",
    description="Backend API for the CareerTrack Job Application Tracker",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(applications.router)
app.include_router(dashboard.router)
app.include_router(interviews.router)

@app.get("/")
def home():
    return {"message": "CareerTrack API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}