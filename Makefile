ruff:
	ruff check

tests:
	uv run pytest -v

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

build:
	sudo rm -rf pgdata
	docker build -t estatya-api:latest -f docker/Dockerfile .

rebuild:
	docker compose down -v
	docker build -t estatya-api:latest -f docker/Dockerfile .
	docker compose up -d

api:
	 ./stress_test.sh http://localhost 100 5000
