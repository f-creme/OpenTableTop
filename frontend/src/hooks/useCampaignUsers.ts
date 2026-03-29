import { useState } from "react";
import { getInvitedUsers, removeUserFromCampaign } from "../api/services/campaignServices";
import { useCampaign } from "../context/CampaignContext";
import { toast } from "react-hot-toast";

import type { CampaignUsers } from "../types/campaign";

export const useCampaignUsers = () => {
    const { campaignId } = useCampaign();
    
    const [usersList, setUsersList] = useState<CampaignUsers[]>([])

    const loadUsers = async () => {
        if (!campaignId || campaignId < 0) return;
        await toast.promise(
            getInvitedUsers(campaignId)
                .then((res) => {setUsersList(res); console.log(res)})
                .catch((err) => {console.log(err); throw err}),
            {
                loading: "Récupération des participants...",
                success: "Liste des participants mise à jour",
                error: "Echec de la mise à jour des participants"
            }
        )
    };

    const removeUser = async (idCampaignUser: number) => {
        await toast.promise(
            removeUserFromCampaign(idCampaignUser)
                .then((res) => {console.log(res); loadUsers})
                .catch((err) => {console.log(err); throw err}),
            {
                loading: "Suppression du participant...",
                success: "Participant retiré",
                error: "Echec de la suppression du participant"
            }
        )
        return;
    }

    return {
        loadUsers, 
        usersList,
        setUsersList,
        removeUser
    }
}