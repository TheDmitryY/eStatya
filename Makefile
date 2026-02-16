ruff:
	ruff check

tests:
	pytest -v

tests unit:
	pytest src/tests/unit

tests integ:
	pytest src/tests/integration

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
	sudo rm -rf pgdata
	docker build -t estatya-api:latest -f docker/Dockerfile .
