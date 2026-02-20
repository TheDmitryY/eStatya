from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from dishka.integrations.fastapi import (
    FromDishka, inject, setup_dishka,
)

from src.posts.schemas import PostsResponseDTO, PostsUpdateDTO
from src.posts.services import PostsService

router = APIRouter()

@router.get("/", response_model=list(PostsResponseDTO))
@inject
async def get_all_posts(
    skip: int,
    limit: int,
    service: FromDishka[PostsService]
    ):
    return await service.get_all_posts(skip=skip,limit=limit)

@router.get("/{id}", response_model=PostsResponseDTO)
@inject
async def get_posts_by_id(
    id: int,
    service: FromDishka[PostsService]
    ):
    return await service.get_posts(id=id)


@router.post("/", response_model=PostsResponseDTO)
@inject
async def create_posts(
    title: str,
    body: str,
    owner_id: uuid.UUID,
    service: FromDishka[PostsService]

    ) -> PostsResponseDTO:
    return await service.create_post(title=title,body=body,owner_id=owner_id)

@router.patch("/", response_model=PostsResponseDTO)
@inject
async def update_posts(
    payload: PostsUpdateDTO,
    service: FromDishka[PostsService]
    ) -> PostsResponseDTO:
    return await service.update_posts(posts=payload)

@router.delete("/{id}")
@inject
async def delete_posts(
    id: int,
    service: FromDishka[PostsService]
    ):
    return await service.delete_posts(id=id)
