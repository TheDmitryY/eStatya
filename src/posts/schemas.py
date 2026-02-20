from pydantic import BaseModel, ConfigDict
import datetime
import uuid

class PostsResponseDTO(PostsEntity):
    id: int
    title: str
    body: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    user_id: uuid.UUID
    comments: list()
    model_config = ConfigDict(from_attributes=True,extra='forbid')

class PostsUpdateDTO(PostsEntity):
    pass

class PostsEntity(BaseModel):
    id: int
    title: str | None
    body: str | None