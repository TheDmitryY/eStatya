from fastapi import APIRouter, Depends, HTTPException, status
from src.auth.schemas import TokenDTO, CreateUserDTO, LoginUserDTO
from src.users.schemas import ResponseUserDTO
from src.auth.services import AuthService
from src.users.services import UserService
from src.auth.dependencies import get_auth_service
from src.users.dependencies import get_user_service
from src.auth.exceptions import BusinessRuleException

router = APIRouter()


@router.post("/register", response_model=ResponseUserDTO)
async def register(
    user_data: CreateUserDTO, service: UserService = Depends(get_user_service)
):
    return await service.create_user(user_data)


@router.post("/login", response_model=TokenDTO)
async def login(
    login_data: LoginUserDTO, service: AuthService = Depends(get_auth_service)
):
    return await service.authenticate_user(login_data)
