from fastapi import Depends
from src.users.repository import UserRepository
from src.users.dependencies import get_user_repository
from src.s3.dependencies import get_storage_service
from src.avatars.service import AvatarService

def get_avatar_service(
    user_repo: UserRepository = Depends(get_user_repository),
    storage: MinioStorageService = Depends(get_storage_service)
) -> AvatarService:
    return AvatarService(user_repo=user_repo, storage=storage)