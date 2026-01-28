from fastapi import FastAPI
import uvicorn

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
    }   
)

@app.get("/")
async def root():
    return {
        "status": "ok",
        "api": "eStatya",
        "health": "Good!"
    }


if __name__ == "__main__":
    uvicorn.run(
        app=app,
        host = "127.0.0.1",
        port = 8000,
    )