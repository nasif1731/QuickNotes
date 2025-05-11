from fastapi import FastAPI
from routes.notes import router

app = FastAPI()

app.include_router(router)
