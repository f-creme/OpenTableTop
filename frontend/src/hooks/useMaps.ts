import { useEffect, useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import { getMaps } from "../api/services/mapServices";

export const useMaps = () => {
    const { campaignId } = useCampaign()
    const [maps, setMaps] = useState<string[]>([]);
    const [selectedMap, setSelectedMap] = useState<string | null>(null);

    useEffect(() => {
        if (!campaignId) return;
        getMaps(campaignId)
            .then((maps) => {
                setMaps(maps);

                const savedMap = localStorage.getItem("selectedMap");

                if (savedMap && maps.includes(savedMap)) {
                    setSelectedMap(savedMap);
                } else if (maps.length > 0) {
                    setSelectedMap(maps[0]);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedMap) {
            localStorage.setItem("selectedMap", selectedMap);
        }
    }, [selectedMap]);

    return {
        maps,
        selectedMap,
        setSelectedMap
    };
};