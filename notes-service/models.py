from typing import List, Optional
from pydantic import BaseModel

class Note(BaseModel):
    title: str
    content: str
    is_public: bool
    tags: Optional[List[str]] = []
    category: Optional[str] = "Low"
