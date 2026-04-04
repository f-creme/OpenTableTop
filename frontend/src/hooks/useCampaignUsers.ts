import { useState } from "react";
import { addParticipantToCampaign, getInvitedUsers, removeUserFromCampaign } from "../api/services/campaignServices";
import { useCampaign } from "../context/CampaignContext";
import { toast } from "react-hot-toast";

import type { CampaignUsers } from "../types/campaign";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

export const useCampaignUsers = () => {
    const { t } = useTranslation();
    const { campaignId } = useCampaign();
    
    const [usersList, setUsersList] = useState<CampaignUsers[]>([])
    const [newParticipant, setNewParticipant] = useState<string>("")

    const loadUsers = async () => {
        if (!campaignId || campaignId === "__NULL__") return;
        await toast.promise(
            getInvitedUsers(campaignId)
                .then((res) => {setUsersList(res); console.log(res)})
                .catch((err) => {console.log(err); throw err}),
            {
                loading: t("component.campaign-users-form.toast.list.loading"),
                success: t("component.campaign-users-form.toast.list.success"),
                error: t("component.campaign-users-form.toast.list.error")
            }
        )
    };

    const removeUser = async (idCampaignUser: number) => {
        await toast.promise(
            removeUserFromCampaign(idCampaignUser)
                .then((res) => console.log(res))
                .catch((err) => {console.log(err); throw err}),
            {
                loading: t("component.campaign-users-form.toast.remove.loading"),
                success: t("component.campaign-users-form.toast.remove.success"),
                error: t("component.campaign-users-form.toast.remove.error")
            }
        )
        return;
    }

    const addParticipant = async (newParticipant: string) => {
        if (!campaignId) return;
        await toast.promise(
            addParticipantToCampaign(campaignId, newParticipant)
                .then((res) => console.log(res))
                .catch((err) => {console.log(err); throw err}),
            {
                loading: t("component.campaign-users-form.toast.add.loading"),
                success: t("component.campaign-users-form.toast.add.success"),
                error: (err) => isAxiosError(err) ? err.response?.data?.detail : t("component.campaign-users-form.toast.add.error")
            }
        )
        return;
    }

    return {
        loadUsers, 
        usersList,
        setUsersList,
        removeUser,
        newParticipant,
        setNewParticipant,
        addParticipant
    }
}