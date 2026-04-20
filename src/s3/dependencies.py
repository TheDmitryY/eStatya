from src.s3.services import MinioStorageService

def get_storage_service() -> MinioStorageService:
    return MinioStorageService()