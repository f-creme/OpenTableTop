from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.maps import routes as maps_route
from api.auth import routes as auth_route
from api.campaigns import routes as campaigns_routes
from api.illustrations import routes as illus_route

from api.table import websocket

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
app.include_router(websocket.router)