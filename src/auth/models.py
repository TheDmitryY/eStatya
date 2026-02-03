from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy import func, DateTime
import datetime

from database.config import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="quest")
    created_at: Column[datetime] = Column(DateTime(timezone=True), default=func.now())