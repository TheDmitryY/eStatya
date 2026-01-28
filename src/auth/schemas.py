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

class ForgotUserSchema(BaseModel):
    email: EmailStr

class VerifyForgotUserSchemas(BaseModel):
    token: str
    password: str