from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
import uuid

class ResponseUserDTO(BaseModel):
    id: uuid.UUID
    email: EmailStr
    role: str
    username: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class UserUpdateDTO(BaseModel):
    email: EmailStr
    username: str