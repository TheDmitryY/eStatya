from pydantic import BaseModel, ConfigDict
import datetime
import uuid
from typing import Any


class PostsEntity(BaseModel):
    id: int
    title: str | None
    body: str | None


class CommentDTO(BaseModel):
    id: int
    text: str
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)


class PostsResponseDTO(PostsEntity):
    id: int
    title: str
    body: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    user_id: uuid.UUID
    comments: list[CommentDTO]
    model_config = ConfigDict(from_attributes=True, extra="forbid")


class PostsUpdateDTO(PostsEntity):
    pass
