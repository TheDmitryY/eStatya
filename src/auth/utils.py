from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt
from src.auth.config import settings as auth_settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class SecurityUtils:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(minutes=auth_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode, 
            auth_settings.SECRET_KEY, 
            algorithm=auth_settings.ALGORITHM
        )
        return encoded_jwt