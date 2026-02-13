from sqlalchemy import Column, Integer, String, Boolean
from typing import List, Optional
from sqlalchemy import String, Text, ForeignKey, DateTime, func, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.orm import Mapped
import uuid
from sqlalchemy import func, DateTime
import datetime

from database.config import Base


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))
    
    post: Mapped["Post"] = relationship(back_populates="comments")