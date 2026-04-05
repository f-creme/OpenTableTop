import { useState } from "react";

export const useSendOnce = (campaignId: number | null, apiURL: string) => {
    const [enableSend, setEnableSend] = useState(true);

    const sendOnce = (payload: any, disableDuration = 10000) => {
        if (!campaignId) return;
        if (!enableSend) return;

        setEnableSend(false);
        const ws = new WebSocket(`${apiURL.replace("http", "ws")}/table_ws/ws/${campaignId}`);

        ws.onopen = () => {
            ws.send(JSON.stringify(payload));
            ws.close();
        };
        ws.onerror = () => {
            console.error("Erreur WebSocket (sendOne)");
        };

        setTimeout(() => setEnableSend(true), disableDuration)
    };

    return { sendOnce, enableSend }
}