import os
from dotenv import load_dotenv

load_dotenv(override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import books, qa, auth, oauth

app=FastAPI(title='Context-IQ')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(books.router)
app.include_router(qa.router)
app.include_router(auth.router)
app.include_router(oauth.router)

@app.get("/api/hello")
def hello():
    return {"message":"Context-IQ is running"}



