from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
import random

from pydantic import BaseModel

router = APIRouter(prefix="/table_ws", tags=["table_ws"])

class Token(BaseModel):
    id: str
    x: float
    y: float
    scale: float

class Player(BaseModel):
    characterId: int
    characterName: str
    characterRole: str | None
    characterPortrait: str | None
    userPublicName: str 

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.current_map: str | None = None
        self.current_illustration: str | None = None
        self.current_active_tokens: List[dict] = []
        self.current_active_players: List[dict] = []


    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

        # Sync map while connecting
        if self.current_map:
            await websocket.send_json({
                "type": "map_update",
                "selected_map": self.current_map
            })

        # Sync tokens while connecting
        if len(self.current_active_tokens) > 0:
            await websocket.send_json({
                "type": "init_tokens",
                "tokens": self.current_active_tokens
            })
        
        # Sync active players while connecting
        if len(self.current_active_players) > 0:
            await websocket.send_json({
                "type": "init_players",
                "active_players": self.current_active_players
            })

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)


    async def broadcast(self, message: dict):
        """General broadcast"""
        for connection in self.active_connections:
            await connection.send_json(message)

    async def request_reinit(self, websocket: WebSocket):
        await websocket.send_json({"type": "map_update", "selected_map": self.current_map})
        await websocket.send_json({"type": "init_tokens", "tokens": self.current_active_tokens})
        await websocket.send_json({"type": "illus_update", "selected_illustration": self.current_illustration})

    async def broadcast_map(self, map_name: str):
        """Map broadcast"""
        self.current_map = map_name

        await self.broadcast({
            "type": "map_update",
            "selected_map": map_name
        })

    async def broadcast_illustration(self, illus: str):
        """Illustration broadcast"""
        self.current_illustration = illus

        await self.broadcast({
            "type": "illus_update",
            "selected_illustration": illus
        })


    async def broadcast_dice(self, dice: int, count: int, player: str | None = None):
        results = [random.randint(1, dice) for _ in range(count)]

        message = {
            "type": "dice_result",
            "dice": dice, 
            "count": count,
            "results": results, 
            "player": player
        }

        await self.broadcast(message)
    
    async def broadcast_token_update(self, action: str, token: dict):
        if action == "add":
            if token not in self.current_active_tokens:
                self.current_active_tokens.append(token)

        if action == "remove":
            new_actives_tokens = [t for t in self.current_active_tokens if t != token]
            self.current_active_tokens = new_actives_tokens

        message = {"type": "token_update", "action": action, "token": token}
        await self.broadcast(message)

    async def broadcast_token_move(self, token: dict):
        self.current_active_tokens = [token if t["id"] == token["id"] else t for t in self.current_active_tokens]
        await self.broadcast({"type": "token_move", "token": token})
        
    async def broadcast_token_scale(self, tokens: list):
        self.current_active_tokens = tokens
        await self.broadcast({"type": "tokens_scale", "tokens": tokens})

    async def broadcast_new_player(self, player: dict):
        exists = any(p.get("userPublicName") == player["userPublicName"] for p in self.current_active_players)
        if not exists: 
            self.current_active_players.append(player)
        else: 
            self.current_active_players = [
                player if player["userPublicName"] == p["userPublicName"] 
                else p 
                for p in self.current_active_players
            ]
        await self.broadcast({"type": "new_player", "player": player})

# Dictionnary to store a connection manager per campaign 
campaign_managers: Dict[int, ConnectionManager] = {}

def get_manager(campaign_id: int) -> ConnectionManager:
    if campaign_id not in campaign_managers:
        campaign_managers[campaign_id] = ConnectionManager()
    return campaign_managers[campaign_id]

# Websocket endpoint per campaign
@router.websocket("/ws/{campaign_id}")
async def websocket_endpoint(websocket: WebSocket, campaign_id: int):
    manager = get_manager(campaign_id)
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")
            
            if msg_type == "map_change":
                await manager.broadcast_map(data["selected_map"])

            elif msg_type == "illustration_change":
                await manager.broadcast_illustration(data["selected_illustration"])
            
            elif msg_type == "dice_roll":
                await manager.broadcast_dice(
                    dice=data["dice"],
                    count=data["count"],
                    player=data.get("player")
                )

            elif msg_type == "token_update":
                token = Token(**(data["token"])).model_dump()
                await manager.broadcast_token_update(action=data["action"], token=token)

            elif msg_type == "token_move":
                token = Token(**(data["token"])).model_dump()
                await manager.broadcast_token_move(token=token)

            elif msg_type == "tokens_scale":
                await manager.broadcast_token_scale(data["tokens"])

            elif msg_type == "join_player":
                player = Player(**(data["player"])).model_dump()
                await manager.broadcast_new_player(player=player)

            elif msg_type =="request_init":
                await manager.request_reinit(websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)