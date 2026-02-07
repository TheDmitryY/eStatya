from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from src.auth.exceptions import (
    InvalidTokenException,
    InvalidRefreshTokenException
    )
import time
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
        to_encode.update(
            {
                "exp": expire,
                "type": "access"
                }
            )
        
        encoded_jwt = jwt.encode(
            to_encode, 
            auth_settings.SECRET_KEY, 
            algorithm=auth_settings.ALGORITHM
        )
        return encoded_jwt

    @staticmethod
    def create_refresh_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(minutes=auth_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update(
            {
                "exp": expire,
                "type": "refresh"
                }
            )
        
        encoded_jwt = jwt.encode(
            to_encode, 
            auth_settings.SECRET_KEY, 
            algorithm=auth_settings.ALGORITHM
        )
        return encoded_jwt

    @staticmethod
    def verify_refresh_token(token: str) -> str:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
            token_type = payload.get("type")
            user_id = payload.get("sub")
            
            if token_type != "refresh":
                raise InvalidTokenException("Invalid token type")
            
            if user_id is None:
                raise InvalidTokenSubjectException("Token has no subject")
            
            return user_id
        except Exception as error:
            raise InvalidRefreshTokenException(f"Invalid refresh token! Detail: {error}")
    
    @staticmethod
    def verify_access_token(token: str) -> str:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
            token_type = payload.get("type")
            user_id = payload.get("sub")
            user_role = payload.get("role")
            
            if token_type != "access":
                raise InvalidTokenException("Invalid token type")
            
            if user_id is None:
                raise InvalidTokenSubjectException("Token has no subject")

            if payload.get("exp") >= time.time():
                return payload
            else:
                return None
            
        except jwt.ExpiredSignatureError:
                raise HTTPException(
                    status_code=401,
                    detail="Token has expired"
                )
        except jwt.InvalidTokenError:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid token"
                )    
            
            # return user_id
        except Exception as error:
            raise InvalidTokenException(f"Invalid access token! Detail: {error}")