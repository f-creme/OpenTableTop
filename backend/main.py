from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import maps, table_ws

app = FastAPI(title="OpenTableTop API")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"]
)

app.include_router(maps.router)
app.include_router(table_ws.router)