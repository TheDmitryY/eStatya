from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Cookie,
    Response
    )
from src.auth.schemas import (
    TokenDTO,
    CreateUserDTO,
    LoginUserDTO
    )
from src.users.schemas import ResponseUserDTO
from src.auth.services import AuthService
from src.users.services import UserService
from src.auth.dependencies import get_auth_service
from src.users.dependencies import get_user_service
from src.auth.exceptions import BusinessRuleException
from src.auth.constants import (
    COOKIE_KEY,
    COOKIE_MAX_AGE
)
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder


router = APIRouter()


@router.post("/register", response_model=ResponseUserDTO)
async def register(
    user_data: CreateUserDTO,
    service: UserService = Depends(get_user_service)
):
    return await service.create_user(user_data)


@router.post("/login")
async def login(
    login_data: LoginUserDTO,
    service: AuthService = Depends(get_auth_service)
):
    auth_result = await service.authenticate_user(login_data)
    token_dto = TokenDTO(access_token=auth_result.access_token)
    response_content = jsonable_encoder(token_dto)
    response = JSONResponse(content=response_content)
    response.set_cookie(
        key=COOKIE_KEY,
        value=auth_result.refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=COOKIE_MAX_AGE
    )
    return response


@router.post(
    "/refresh-token",
    response_model=TokenDTO
    )
async def refresh_token(
    response: Response,
    refresh_token: str | None = Cookie(default=None, alias=COOKIE_KEY),
    service: AuthService = Depends(get_auth_service)
):
    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail="Refresh token mising"
        )
    
    auth_result = await service.refresh_session(refresh_token)
    response.set_cookie(
        key=COOKIE_KEY,
        value=auth_result.refresh_token,
        httponly=True,
        secure=False, ## In prod should be True
        samesite="lax",
        max_age=COOKIE_MAX
    )
    return TokenDTO(access_token=auth_result.access_token)

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key=COOKIE_KEY,
        httponly=True,
        secure=True,
        samesite="lax"
    )
    return {"message": "Logged out"}