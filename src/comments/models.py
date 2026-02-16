from typing import TYPE_CHECKING
import datetime

from sqlalchemy import String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.config import Base

if TYPE_CHECKING:
    from src.posts.models import Post


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))
    
    post: Mapped["Post"] = relationship("Post", back_populates="comments")