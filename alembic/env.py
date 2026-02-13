import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

from src.posts.models import Post
from src.auth.models import User
from src.comments.models import Comment

# !!! ВАЖЛИВО !!!
# Імпортуйте вашу Base та налаштування
# Перевірте, чи правильні шляхи імпорту для вашого проекту
from database.config import Base  # Ваша Base (ORM модель)
from src.config import settings  # Ваші налаштування (URL бази)

# Цей об'єкт config дає доступ до значень з .ini файлу
config = context.config

# Налаштування логування
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# !!! ВАЖЛИВО !!!
# Вказуємо метадані для autogenerate
target_metadata = Base.metadata

# Перезаписуємо URL в alembic.ini на той, що в settings (щоб не дублювати)
# Це гарантує, що Alembic використовує той самий URL, що й додаток
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
# Або settings.DATABASE_URL, якщо у вас інша назва змінної


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """Виконує синхронну частину міграцій всередині асинхронного потоку."""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Створює асинхронний двигун і запускає міграції."""

    # Створюємо асинхронний Engine
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        # Магічна функція run_sync дозволяє Alembic працювати з асинхронним драйвером
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""

    # Запускаємо асинхронну функцію через asyncio
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
