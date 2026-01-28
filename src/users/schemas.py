from pydantic import BaseModel, EmailStr

class ResponseUserSchema(BaseModel):
    email: EmailStr
    username: str

    class Config:
        from_attributes = True