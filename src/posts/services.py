from fastapi import HTTPException
from src.posts.repository import PostsRepository
from src.posts.schemas import PostsResponseDTO, PostsUpdateDTO
from src.posts.exceptions import PostsException

class PostsService:
    def __init__(self, post_repo: PostsRepository):
        self.post_repo = post_repo

    async def get_all_posts(self, skip: int, limit: int) -> PostsResponseDTO:
        return await self.post_repo.get_all(skip=skip,limit=limit)

    async def get_posts(self, id: int) -> PostsResponseDTO:
        posts = await self.post_repo.get_by_id(id=id)
        if not posts:
            HTTPException(
                status_code=404,
                detail="Posts not found"
            )
        return posts

    async def create_post(
        self,
        title: str,
        body: str,
        owner_id: uuid.UUID
        ) -> PostsResponseDTO:
        return await self.post_repo.create(
            title=title,
            body=body,
            owner_id=owner_id
        )

    async def delete_posts(self, id: int):
        posts = await self.post_repo.get_by_id(id=id)
        if not posts:
            HTTPException(
                status_code=404,
                detail="Post not found"
            )
        await self.post_repo.delete(id=id)

    async def update_posts(self, posts: PostsUpdateDTO):
        return await self.post_repo.update(posts)