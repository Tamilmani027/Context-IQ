from pydantic import BaseModel
from typing import Optional

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
