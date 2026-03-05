import aioboto3
from loguru import logger
from src.config import settings
from src.s3.exceptions import StorageExceptions

class MinioStorageService:
    def __init__(self):
        self.session = aioboto3.Session()
        self.bucket_name = "avatars"

        self.minio_config = {
            "endpoint_url": settings.ENDPOINT_URL,
            "aws_access_key_id": settings.AWS_ACCESS_KEY_ID,
            "aws_secret_access_key": settings.AWS_SECRET_ACCESS_KEY,
            "region_name": settings.REGION_NAME
        }
    async def upload_image(self, file_bytes: bytes, object_key: str, content_type: str) -> str:
            async with self.session.client("s3", **self.minio_config) as s3:
                try:
                    await s3.put_object(
                        Bucket=self.bucket_name,
                        Key=object_key,
                        Body=file_bytes,
                        ContentType=content_type
                    )
                    return object_key
                except Exception as e:
                    logger.error("Error upload to s3 storage")
                    raise StorageExceptions("Error upload to s3 storage")

    async def generate_presigned_url(self, object_key: str, expires_in: int = 3600) -> str:
        async with self.session.client("s3", **self.minio_config) as s3:
            try:
                return await s3.generate_presigned_url(
                    ClientMethod='get_object',
                    Params={'Bucket': self.bucket_name, 'Key': object_key},
                    ExpiresIn=expires_in
                )
            except Exception:
                logger.error("Error with generate link")
                raise StorageExceptions("Error with generate link")