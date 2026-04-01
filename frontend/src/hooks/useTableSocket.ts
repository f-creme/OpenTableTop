import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Token } from "../types/token";
import type { Player } from "../types/character";

type Props = {
    campaignId: number | null;
    apiURL: string;
    onMapUpdate: (map: string) => void;
    onIllusUpdate: (illus: string) => void;
    onDiceResult: (data: any) => void;
    setActiveToken: Dispatch<SetStateAction<Token[]>>;
    setActivePlayers: Dispatch<SetStateAction<Player[]>>;
};

export const useTableSocket = ({
    campaignId,
    apiURL,
    onMapUpdate,
    onIllusUpdate, 
    onDiceResult,
    setActiveToken, 
    setActivePlayers
}: Props) => {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!campaignId) return;

        const ws = new WebSocket(`${apiURL.replace("http", "ws")}/table_ws/ws/${campaignId}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)

            if (data.type === "map_update") {
                onMapUpdate(data.selected_map);
            }

            if (data.type === "dice_result") {
                onDiceResult(data);
            }

            if (data.type === "illus_update") {
                onIllusUpdate(data.selected_illustration)
            }

            if (data.type === "init_tokens") {
                setActiveToken(data.tokens)
            }

            if (data.type === "token_update") {
                const token = data.token as Token;

                if (data.action === "add") {
                    setActiveToken((prev) => {
                        if (prev.some((t) => t.id === token.id)) return prev;
                        return [...prev, token]
                    });
                };
                if (data.action === "remove") {
                    setActiveToken((prev) => prev.filter((t) => t.id !== token.id));
                };
            };

            if (data.type === "token_move") {
                const token = data.token as Token;
                setActiveToken((prev) => 
                    prev.map((t) =>
                        t.id === token.id
                            ? { ...t, x: token.x, y: token.y }
                            : t
                    )
                );
            };

            if (data.type === "tokens_scale") {
                setActiveToken(data.tokens);
            }

            if (data.type === "new_player") {
                const newPlayer = data.player as Player;
    
                setActivePlayers((prev) => {
                    const exists = prev.some((p) => p.userPublicName === newPlayer.userPublicName);
                    
                    if (exists) {
                        return prev.map(p => 
                            p.userPublicName === newPlayer.userPublicName ? newPlayer : p
                        );
                    } else {
                        return [...prev, newPlayer];
                    }
                })
            }

        };

        return () => ws.close();
    }, [campaignId]);

    const send = (payload: any) => {
        wsRef.current?.send(JSON.stringify(payload));
    };

    return { send };
};