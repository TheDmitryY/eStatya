from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,delete, update
from src.auth.schemas import CreateUserDTO
from src.users.schemas import UserUpdateDTO 
from src.auth.models import User
import uuid
from typing import (
    Optional,List
    )

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

    async def get_by_id(self, id: uuid.UUID) -> Optional[User]:
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
    
    async def update(self, id: uuid.UUID, updated_data: UserUpdateDTO):
        data = updated_data.model_dump(exclude_unset=True)
        if not data:
            return await self.get_by_id(id)

        query = (
            update(User)
            .where(User.id == id)
            .values(**data)
            .returning(User)
        )
        result = await self.session.execute(stmt)
        updated_users = result.scalar_one_or_none()
        await session.commit()
        return updated_users

    async def delete(self, id: uuid.UUID) -> None:
        query = (
            delete(User)
            .where(User.id == id)
        )
        await self.session.execute(query)
        await self.session.commit()