from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookBase(BaseModel):
    title:str
    price:float
    rating:int
    url:str
    description:str
    upc:str
    availability:str
    num_reviews:int

class BookResponse(BookBase):
    id:int
    summary:Optional[str]=None
    genre:Optional[str]=None

    class Config:
        from_attributes=True

class QuestionRequest(BaseModel):
    question:str

# ── Auth Schemas ──────────────────────────────────────

class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
