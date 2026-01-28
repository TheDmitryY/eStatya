from typing import Protocol, Optional
from dataclasses import dataclass

@dataclass
class UserEntity:
    id: int
    username: str
    email: str
    hashed_password: str

class UserRepository(Protocol):
    async def get_by_email(self, email: str) -> Optional[UserEntity]:
        pass

    async def create(self, user: UserEntity) -> UserEntity:
        pass

    