from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from src.users.services import UserService
from src.users.dependencies import get_user_service
from src.users.schemas import ResponseUserDTO
from src.auth.dependencies import get_current_user_claims
from src.posts.schemas import PostsResponseDTO
from src.posts.services import PostsService
from src.posts.dependencies import get_post_service
from typing import List
import uuid

router = APIRouter()

@router.get("/me", response_model=ResponseUserDTO)
async def get_profile(
    claims: dict = Depends(get_current_user_claims),
    service: UserService = Depends(get_user_service),
):
    user_id = uuid.UUID(claims["user_id"])
    return await service.get_user_profile(user_id)

@router.get("/{user_id}/posts", response_model=List[PostsResponseDTO])
async def get_user_posts(
    user_id: uuid.UUID,
    skip: int = 0,
    limit: int = 20,
    service: PostsService = Depends(get_post_service),
):
    return await service.get_posts_by_user(user_id=user_id, skip=skip, limit=limit)