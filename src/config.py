from pydantic_setting import BaseSettings, SettingsConfigDict
from typing import Optional
import logging

class Settings(BaseSettings):
    app_name: str
    admin_email: str
    log_level: str = "INFO"
    PROD_REDIS_ACCOUNT_PASSWORD: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

    settings = Settings()


logging.info(f"Application name {Settings.app_name}")
logging.info(f"Application name {Settings.admin_email}")
logging.info(f"Application name {Settings.log_level}")
