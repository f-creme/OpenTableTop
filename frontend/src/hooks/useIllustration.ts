import { useEffect, useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import { getIllustrations } from "../api/services/mapServices";

export const useIllustrations = () => {
    const { campaignId } = useCampaign()
    const [illustrations, setIllustrations] = useState<string[]>([]);
    const [selectedIllustration, setSelectedIllustration] = useState<string | null>(null)

    useEffect(() => {
        if (!campaignId) return;

        getIllustrations(campaignId)
            .then((illus) => {
                setIllustrations(illus);
            })
            .catch(console.error)
    }, []);

    useEffect(() => {
        if (selectedIllustration) {
            localStorage.setItem("selectedIllus", selectedIllustration);
        }
    }, [selectedIllustration]);

    return {
        illustrations,
        selectedIllustration,
        setSelectedIllustration
    }
}