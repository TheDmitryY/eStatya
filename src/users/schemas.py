from pydantic import BaseModel, EmailStr

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

class LoginUserSchema(BaseModel):
    email: EmailStr
    password: str

class CreateUserSchema(BaseModel):
    email: EmailStr
    username: str
    password: str

class ResponseUserSchema(BaseModel):
    email: EmailStr
    username: str

    class Config:
        from_attributes = True