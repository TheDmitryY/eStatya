from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

class ResponseUserDTO(BaseModel):
    id: uuid.UUID
    email: EmailStr
    role: str
    username: Optional[str] = None
    

    class Config:
        from_attributes = True