from fastapi import FastAPI
from src.auth.router import router as auth_router
from src.users.router import router as user_router
from src.admin.router import router as admin_router
from database.config import create_db_and_tables
import uvicorn
from contextlib import asynccontextmanager


app = FastAPI(
    title="eStatya",
    summary="eStatyaAPI for fecth data from backend. LoL :3",
    version="0.0.1",
    root_path="/api/v1",
    openapi_url="/openapi.json",
    redirect_slashes=True,
    docs_url="/docs",
    license_info={
        "name": "MIT license",
        "url": "https://github.com/TheDmitryY/eStatya/blob/main/LICENSE",
    },
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    # redis = aioredis.Redis(
    #     decode_responses=True,
    #     host=PROD_REDIS_HOST,
    #     port=PROD_REDIS_PORT,
    #     username=PROD_REDIS_ACCOUNT_USERNAME,
    #     password=PROD_REDIS_ACCOUNT_PASSWORD,
    # )
    # FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
    # await FastAPILimiter.init(redis)
    yield
    # await FastAPILimiter.close()


app = FastAPI(lifespan=lifespan, title="eStatya")

### Routers Connect

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["auth"]
    )

app.include_router(
    user_router,
    prefix="/api/v1/users",
    tags=["users"]
)

app.include_router(
    admin_router,
    prefix="/api/v1/admins",
    tags=["admins"]
)

@app.get("/api/v1/")
async def root():
    return {
        "status": "ok",
    }


@app.get("/api/v1/health")
async def health_check():
    return {"health": "good"}


if __name__ == "__main__":
    uvicorn.run(
        app=app,
        host="127.0.0.1",
        port=8000
    )
