import { useState, useEffect } from "react";
import { getCampaignGlobal, postNewCampaign, putCampaignGlobal } from "../api/services/campaignServices";
import { useCampaign } from "../context/CampaignContext";
import { useProfile } from "../context/ProfileContext";
import type { CampaignGlobal } from "../types/campaign";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useTranslation } from "react-i18next";

export const useCampaignGlobal = () => {
    const { t } = useTranslation();
    const { campaignId, setCampaignId } = useCampaign();
    const { setPublicName } = useProfile();

    const [campaignTitle, setCampaignTitle] = useState<string>("");
    const [localPublicName, setLocalPublicName] = useState<string>("");

    const [disabledEditGlobal, setDisabledEditGlobal] = useState<boolean>(true);

    useEffect(() => {
        if (!campaignId || campaignId === "__NULL__") return;
        const fetchGlobal = async () => {
            try {
                const res: CampaignGlobal = await getCampaignGlobal(campaignId);
                setCampaignTitle(res.campaignTitle);
                setLocalPublicName(res.userCampaignCharacterName || res.userPublicName || "");
            } catch (err) {
                console.error(err);
            }
        };
        fetchGlobal();
    }, [campaignId]);

    const updateCampaign = async () => {
        if (!campaignId || campaignId === "__NULL__" || campaignTitle.length === 0 || campaignTitle.length >= 35 || !localPublicName) return;
        await toast.promise(
            putCampaignGlobal(campaignId, campaignTitle, localPublicName).then(() => {
                setPublicName(localPublicName);
            }),
            {
                loading: t("component.campaign-general-form.toast.update.loading"),
                success: t("component.campaign-general-form.toast.update.success"),
                error: t("component.campaign-general-form.toast.update.error")
            }
        );
    };

    const createCampaign = async () => {
        if (campaignId !== "__NULL__" || campaignTitle.length === 0 || campaignTitle.length >= 35 || !localPublicName) return;
        await toast.promise(
            postNewCampaign(campaignTitle, localPublicName)
                .then(res => {
                    setCampaignId(res.campaignId);
                    setPublicName(localPublicName);
                    return res;
                }),
            {
                loading: t("component.campaign-general-form.toast.create.loading"),
                success: t("component.campaign-general-form.toast.create.success"),
                error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || t("component.campaign-general-form.toast.create.error") : t("component.campaign-general-form.toast.create.error")
            }
        );
    };

    return {
        campaignTitle,
        setCampaignTitle,
        localPublicName,
        setLocalPublicName,
        disabledEditGlobal,
        setDisabledEditGlobal,
        updateCampaign,
        createCampaign,
    };
};