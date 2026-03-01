from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from src.posts.schemas import PostsEntity, PostsResponseDTO
from src.posts.models import Post
from sqlalchemy import select, delete, update
from sqlalchemy.orm import selectinload
import uuid

import datetime


class PostsRepository(ABC):
    @abstractmethod
    async def create(title: str, body: str, owner_id: uuid.UUID) -> PostsResponseDTO:
        pass

    @abstractmethod
    async def delete(id: int):
        pass

    @abstractmethod
    async def update(posts: PostsEntity):
        pass

    @abstractmethod
    async def get_by_id(id: int) -> PostsResponseDTO:
        pass

    @abstractmethod
    async def get_all(skip: int, limit: int) -> list[PostsResponseDTO]:
        pass


class PosgresPostsRepository(PostsRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id: int) -> PostsResponseDTO:
        query = select(Post).options(selectinload(Post.comments)).where(Post.id == id)
        result = await self.session.execute(query)
        post_schemas = result.scalar_one_or_none()
        if post_schemas:
            return self._map_to_domain(model=post_schemas)
        return None

    async def get_all(self, skip: int, limit: int) -> list[PostsResponseDTO]:
        query = select(Post).options(selectinload(Post.comments)).limit(limit).offset(skip)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def create(
        self, title: str, body: str, owner_id: uuid.UUID
    ) -> PostsResponseDTO:
        post_model = Post(title=title, body=body, user_id=owner_id)
        self.session.add(post_model)
        await self.session.flush()
        await self.session.refresh(post_model, attribute_names=["comments"])
        await self.session.commit()
        return self._map_to_domain(post_model)

    async def delete(self, id: int):
        query = delete(Post).where(Post.id == id)
        await self.session.execute(query)
        await self.session.commit()

    async def update(self, posts: PostsEntity):
        stmt = update(Post).where(Post.id == posts.id).values(
            **posts.model_dump(exclude={"id"}, exclude_unset=True)
        ).returning(Post)
        result = await self.session.execute(stmt)
        updated_model = result.scalar_one()
        await self.session.commit()
        return self._map_to_domain(updated_model)

    def _map_to_domain(self, model: Post) -> PostsResponseDTO:
        return PostsResponseDTO(
            id=model.id,
            title=model.title,
            body=model.body,
            created_at=model.created_at,
            updated_at=model.updated_at,
            user_id=model.user_id,
            comments=model.comments,
        )

