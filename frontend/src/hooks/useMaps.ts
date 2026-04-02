import { useEffect, useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import { getMaps } from "../api/services/mapServices";
import type { FileType, FileTypeAPI } from "../types/file";

export const useMaps = () => {
    const { campaignId } = useCampaign()
    const [maps, setMaps] = useState<FileType[]>([]);
    const [selectedMap, setSelectedMap] = useState<string | null>(null);

    const mapFileType = ({uuid, file_name}: FileTypeAPI): FileType => ({uuid: uuid, fileName: file_name}) 

    useEffect(() => {
        if (!campaignId || campaignId === "__NULL__") return;
        getMaps(campaignId)
            .then((res) => {

                const maps: FileType[] = res.map(mapFileType);
                setMaps(maps);
            })
            .catch(console.error);
    }, []);

    return {
        maps,
        selectedMap,
        setSelectedMap
    };
};