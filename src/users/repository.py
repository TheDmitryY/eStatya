from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,delete
from src.auth.schemas import CreateUserDTO
from src.auth.models import User
import uuid
from typing import Optional

class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_email(self, email: str) -> Optional[User]:
        query = (
            select(User)
            .where(User.email == email)
            )
        result = await self.session.execute(query)
        return result.scalars().first()

    async def get_by_id(self, id: str) -> Optional[User]:
        query = (
            select(User)
            .where(User.id == id)
        )
        result = await self.session.execute(query)
        return result.sclars().first()

    async def create(self, user_data: dict):
        new_user = User(**user_data)
        self.session.add(new_user)
        await self.session.commit()
        await self.session.refresh(new_user)
        return new_user
    
    async def delete(self, user_id: uuid.UUID) -> None:
        query = (
            delete(User)
            .where(User.id == user_id)
        )
        await self.session.execute(query)
        await self.session.commit()