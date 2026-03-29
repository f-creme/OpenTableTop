import { useEffect, useRef } from "react";

type Props = {
    campaignId: number | null;
    apiURL: string;
    onMapUpdate: (map: string) => void;
    onIllusUpdate: (illus: string) => void;
    onDiceResult: (data: any) => void;
};

export const useTableSocket = ({
    campaignId,
    apiURL,
    onMapUpdate,
    onIllusUpdate, 
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

            if (data.type === "illus_update") {
                console.log(data.selected_illustration)
                onIllusUpdate(data.selected_illustration)
            }
        };

        return () => ws.close();
    }, [campaignId]);

    const send = (payload: any) => {
        wsRef.current?.send(JSON.stringify(payload));
    };

    return { send };
};