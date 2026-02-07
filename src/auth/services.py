from src.users.repository import UserRepository
from src.auth.exceptions import BusinessRuleException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from src.auth.schemas import (
    CreateUserDTO,
    TokenDTO,
    LoginUserDTO,
    AuthResultDTO
    )
from src.users.schemas import ResponseUserDTO
from src.auth.utils import SecurityUtils
from fastapi import HTTPException

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def authenticate_user(self, login_dto: LoginUserDTO) -> AuthResultDTO:
        user = await self.user_repo.get_by_email(login_dto.email)
        
        if not user or not SecurityUtils.verify_password(login_dto.password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        payload = {
            "sub": str(user.id),
            "role": user.role
        }
        
        access_token = SecurityUtils.create_access_token(data=payload)
        refresh_token = SecurityUtils.create_refresh_token(data=payload)
        
        return AuthResultDTO(
            access_token=access_token,
            refresh_token=refresh_token
            )
    
    async def refresh_session(self, refresh_token: str) -> AuthResultDTO:
        payload = SecurityUtils.verify_refresh_token(refresh_token)
        user_id = payload.get("sub")

        new_access = create_access_token({"sub": user_id})
        new_refresh = create_refresh_token({"sub": user_id})

        return AuthResultDTO(
            access_token=new_access,
            refresh_token=new_refresh
        )