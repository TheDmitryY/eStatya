ruff:
	ruff check

tests:
	pytest -v

run:
	docker compose up -d

stop:
	docker compose down -v

logs:
	docker compose logs

migrations:
	alembic upgrade head

migrations restore:
	alembic downgrade -1

build:
	docker build -t estatya-api:latest docker/