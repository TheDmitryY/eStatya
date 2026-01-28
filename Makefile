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
