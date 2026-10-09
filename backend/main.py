import os
from dotenv import load_dotenv

load_dotenv(override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import books, qa, auth, oauth

app=FastAPI(title='Context-IQ')

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://context-iq-nu.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router)
app.include_router(qa.router)
app.include_router(auth.router)
app.include_router(oauth.router)

@app.get("/api/hello")
def hello():
    return {"message":"Context-IQ is running"}



