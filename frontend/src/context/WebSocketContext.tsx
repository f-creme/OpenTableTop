import { createContext, useContext, useEffect, useRef, useState } from "react";

type WebSocketContextType = {
  send: (payload: any) => void;
  ws: WebSocket | null; // Ajout de l'instance WebSocket
  isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

type Props = {
  children: React.ReactNode;
  campaignId: string | null;
  apiURL: string;
};

export const WebSocketProvider = ({ children, campaignId, apiURL }: Props) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const send = (payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  };

  useEffect(() => {
    if (!campaignId) return;

    const ws = new WebSocket(`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}${apiURL}/table_ws/ws/${campaignId}`);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    return () => {
      ws.close();
    };
  }, [campaignId, apiURL]);

  return (
    <WebSocketContext.Provider value={{ send, ws: wsRef.current, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};