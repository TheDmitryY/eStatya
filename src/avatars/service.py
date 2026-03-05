import io
import uuid
from PIL import Image
from loguru import logger
from src.users.repository import UserRepository
from fastapi.concurrency import run_in_threadpool
from src.avatars.exceptions import FileException

class AvatarService:
    def __init__(
        self,
        user_repo: UserRepository,
        storage: MinioStorageService
        ):
        self.user_repo = user_repo
        self.storage = storage

    async def update_user_avatar(self, user_id: int, file_bytes: bytes) -> str:
        try:
            processed_bytes = await run_in_threadpool(
                self._process_image,
                file_bytes
            )
        except Exception:
            logger.error("Error with image. File damaged")
            raise FileException("Error with image. File damaged")
        
        object_key = f"avatars/user_{user_id}_{uuid.uuid4().hex[:8]}.webp"
        await self.storage.upload_image(processed_bytes, object_key, "image/webp")
        await self.user_repo.update_avatar_key(user_id, object_key)
        return self.storage.generate_presigned_url(object_key)
    
    def _process_image(self, file_bytes: bytes) -> bytes:
        image = Image.open(io.BytesIO(file_bytes))
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        image.thumbnail((500, 500))
        
        output_buffer = io.BytesIO()
        image.save(output_buffer, format="WEBP", quality=85)
        return output_buffer.getvalue()
            