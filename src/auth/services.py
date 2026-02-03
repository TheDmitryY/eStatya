from src.users.repository import UserRepository
from src.auth.exceptions import BusinessRuleException, EmailException
from src.auth.schemas import CreateUserDTO, TokenDTO, LoginUserDTO
from src.users.schemas import ResponseUserDTO
from src.auth.utils import SecurityUtils
from fastapi import HTTPException

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def authenticate_user(self, login_dto: LoginUserDTO) -> TokenDTO:
        user = await self.user_repo.get_by_email(login_dto.email)
        
        if not user or not SecurityUtils.verify_password(login_dto.password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        payload = {
            "sub": str(user.id),
            "role": user.role,
        }
        
        access_token = SecurityUtils.create_access_token(data=payload)
        
        return TokenDTO(access_token=access_token, token_type="bearer")