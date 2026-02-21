from database.config import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from src.posts.services import PostsService
from src.posts.repository import PostsRepository

async def get_post_repository(session: AsyncSession = Depends(get_async_session)) -> PostsRepository:
    return PostsRepository(session)

async def get_post_service(
    repo: PostsRepository = Depends(get_user_repository)
) -> PostsService:
    return PostsService(repo)