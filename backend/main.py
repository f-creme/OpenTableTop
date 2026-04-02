from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pathlib import Path
from dotenv import load_dotenv

from api.maps import routes as maps_route
from api.auth import routes as auth_route
from api.campaigns import routes as campaigns_routes
from api.illustrations import routes as illus_route
from api.tokens import routes as tokens_route
from api.upload import routes as upload_route
from api.characters import routes as characters_route

from api.table import websocket

dotenv_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path)

app = FastAPI(title="OpenTableTop API")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"]
)

app.include_router(maps_route.router)
app.include_router(auth_route.router)
app.include_router(campaigns_routes.router)
app.include_router(illus_route.router)
app.include_router(tokens_route.router)
app.include_router(upload_route.router)
app.include_router(characters_route.router)
app.include_router(websocket.router)