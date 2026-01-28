from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from src.auth.config import settings as auth_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SecurityUtils:
    @staticmethod
    async def verify_password(
        plain_password,
        hashed_password
        ) -> bool:
        return pwd_context.verify(
            plain_password,
            hashed_password
            )

    @staticmethod
    async def get_password_hash(
        password
    ) -> str:
        return pwd_context.hash(password)

    @staticmethod
    async def create_access_token(
        data: dict
    ) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=auth_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode,auth_settings.SECRET_KEY,algorithm=auth_settings.ALGORITHM)
        return encoded_jwt