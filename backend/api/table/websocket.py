from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
import random

router = APIRouter(prefix="/table_ws", tags=["table_ws"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.current_map: str | None = None


    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

        # Sync map while connecting
        if self.current_map:
            await websocket.send_json({
                "type": "map_update",
                "selected_map": self.current_map
            })


    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)


    async def broadcast(self, message: dict):
        """General broadcast"""
        for connection in self.active_connections:
            await connection.send_json(message)


    async def broadcast_map(self, map_name: str):
        """Map broadcast"""
        self.current_map = map_name

        await self.broadcast({
            "type": "map_update",
            "selected_map": map_name
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
            
            elif msg_type == "dice_roll":
                await manager.broadcast_dice(
                    dice=data["dice"],
                    count=data["count"],
                    player=data.get("player")
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket)