import { useEffect, useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import { getIllustrations } from "../api/services/mapServices";
import type { FileType, FileTypeAPI } from "../types/file";

export const useIllustrations = () => {
    const { campaignId } = useCampaign()
    const [illustrations, setIllustrations] = useState<FileType[]>([]);
    const [selectedIllustration, setSelectedIllustration] = useState<string | null>(null)

    const mapFileType = ({uuid, file_name}: FileTypeAPI): FileType => ({uuid: uuid, fileName: file_name}) 

    useEffect(() => {
        if (!campaignId || campaignId === "__NULL__") return;

        getIllustrations(campaignId)
            .then((res) => {
                const illus: FileType[] = res.map(mapFileType)
                setIllustrations(illus);
            })
            .catch(console.error)
    }, []);

    return {
        illustrations,
        selectedIllustration,
        setSelectedIllustration
    }
}