from collections.abc import AsyncGenerator
import os
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy import ForeignKey, String, Integer, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from typing import List
from sqlalchemy import func, DateTime
from typing import Optional
from config import settings as main_settings
import datetime

class Base(DeclarativeBase):
    pass


# class Aids(Base):
#     __tablename__ = "aids"
    
#     id: Mapped[int] = mapped_column(primary_key=True)
#     name: Mapped[str] = mapped_column(String(50))
#     owner_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    
#     owner: Mapped["Users"] = relationship(back_populates="aids")

#     drugs: Mapped[List["Drugs"]] = relationship(back_populates="aid", cascade="all, delete-orphan",lazy="selectin")

# class Drugs(Base):
#     __tablename__ = "drugs"
    
#     id: Mapped[int] = mapped_column(primary_key=True)
#     name: Mapped[str] = mapped_column(String(50))
#     price: Mapped[int] = mapped_column(Integer())
#     amount: Mapped[int] = mapped_column(Integer())
#     comment: Mapped[str] = mapped_column(String(100), nullable=True)
#     aid_id: Mapped[int] = mapped_column(ForeignKey("aids.id"))

#     aid: Mapped["Aids"] = relationship(back_populates="drugs")

#     category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
#     category_drugs_id: Mapped[int] = mapped_column(ForeignKey("categories_drugs.id"))
#     category: Mapped[List["Categories"]] = relationship(back_populates="drugs",lazy="selectin")
#     category_drugs: Mapped[List["Categories_Drugs"]] = relationship(back_populates="drugs",lazy="selectin")

#     expired_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
#     created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
#     updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
#     registry_id: Mapped[int | None] = mapped_column(ForeignKey("drugs_registry.id"), nullable=True)
#     instruction_entry: Mapped["DrugsRegistry"] = relationship("DrugsRegistry", lazy="joined")

# class DrugsRegistry(Base):
#     __tablename__ = "drugs_registry"
#     id: Mapped[str] = mapped_column(Text(), primary_key=True)
#     trade_name: Mapped[str] = mapped_column(Text())
#     international_name: Mapped[str] = mapped_column(Text())
#     vacation_conditions: Mapped[str] = mapped_column(Text())
#     composition_current: Mapped[str] = mapped_column(Text())
#     pharmacotherapeutic_group: Mapped[str] = mapped_column(Text())
#     atc_code_1: Mapped[str] = mapped_column(Text())
#     atc_code_2: Mapped[str] = mapped_column(Text())
#     atc_code_3: Mapped[str] = mapped_column(Text())
#     applicant_name_ukrainian: Mapped[str] = mapped_column(Text())
#     applicant_country: Mapped[str] = mapped_column(Text())
#     applicant_address: Mapped[str] = mapped_column(Text())
#     producers_numbers: Mapped[int] = mapped_column(Integer())
#     manufacturer_name_ukrainian_1: Mapped[str] = mapped_column(Text())
#     manufacturer_country_1: Mapped[str] = mapped_column(Text())
#     manufacturer_address_1: Mapped[str] = mapped_column(Text())
#     manufacturer_name_ukrainian_2: Mapped[str] = mapped_column(Text())
#     manufacturer_country_2: Mapped[str] = mapped_column(Text())
#     manufacturer_address_2: Mapped[str] = mapped_column(Text())
#     manufacturer_name_ukrainian_3: Mapped[str] = mapped_column(Text())
#     manufacturer_country_3: Mapped[str] = mapped_column(Text())
#     manufacturer_address_3: Mapped[str] = mapped_column(Text())
#     manufacturer_name_ukrainian_4: Mapped[str] = mapped_column(Text())
#     manufacturer_country_4: Mapped[str] = mapped_column(Text())
#     manufacturer_address_4: Mapped[str] = mapped_column(Text())
#     manufacturer_name_ukrainian_5: Mapped[str] = mapped_column(Text())
#     manufacturer_country_5: Mapped[str] = mapped_column(Text())
#     manufacturer_address_5: Mapped[str] = mapped_column(Text())
#     registration_certificate_number: Mapped[str] = mapped_column(Text())
#     start_date: Mapped[str] = mapped_column(Text())
#     end_date: Mapped[str] = mapped_column(Text())
#     drug_type: Mapped[str] = mapped_column(Text())
#     drugs_biological_origin: Mapped[str] = mapped_column(Text())
#     drugs_herbal_origin: Mapped[str] = mapped_column(Text())
#     drugs_orphan: Mapped[str] = mapped_column(Text())
#     homeopathic: Mapped[str] = mapped_column(Text())
#     inn_type: Mapped[str] = mapped_column(Text())
#     is_early: Mapped[str] = mapped_column(Text())
#     early_termination_last_day: Mapped[str] = mapped_column(Text())
#     early_termination_reason: Mapped[str] = mapped_column(Text())
#     instruction_url: Mapped[str] = mapped_column(Text())
#     expiration_date: Mapped[str] = mapped_column(Text())
#     expiration_date_meaning: Mapped[str] = mapped_column(Text())
#     expiration_date_measurement_unit: Mapped[str] = mapped_column(Text())



# class Categories(Base):
#     __tablename__ = "categories"
#     id: Mapped[int] = mapped_column(primary_key=True)
#     name: Mapped[str] = mapped_column(String(50))
#     drugs: Mapped[List["Drugs"]] = relationship(back_populates="category",cascade="all, delete-orphan")

# class Categories_Drugs(Base):
#     __tablename__ = "categories_drugs"
#     id: Mapped[int] = mapped_column(primary_key=True)
#     type: Mapped[str] = mapped_column(String(50))
#     drugs: Mapped[List["Drugs"]] = relationship(back_populates="category_drugs",cascade="all, delete-orphan")


engine = create_async_engine(main_settings.DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, Users)