import { useEffect, useRef } from "react";

type Props = {
    campaignId: number | null;
    apiURL: string;
    onMapUpdate: (map: string) => void;
    onDiceResult: (data: any) => void;
};

export const useTableSocket = ({
    campaignId,
    apiURL,
    onMapUpdate,
    onDiceResult
}: Props) => {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!campaignId) return;

        const ws = new WebSocket(`${apiURL.replace("http", "ws")}/table_ws/ws/${campaignId}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "map_update") {
                onMapUpdate(data.selected_map);
            }

            if (data.type === "dice_result") {
                onDiceResult(data);
            }
        };

        return () => ws.close();
    }, [campaignId]);

    const send = (payload: any) => {
        wsRef.current?.send(JSON.stringify(payload));
    };

    return { send };
};