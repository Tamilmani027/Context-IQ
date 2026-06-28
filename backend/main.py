from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI(title='Context-IQ')

app.add_middleware(CORSMiddleware,
allow_origins=["http://localhost:3000"],
allow_methods=["*"],
allow_credentials=True,
allow_headers=["*"]
)

@app.get("/api/hello")
def hello():
    return {"message":"Context-IQ is running"}


