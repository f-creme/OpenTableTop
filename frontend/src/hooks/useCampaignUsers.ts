import { useState } from "react";
import { addParticipantToCampaign, getInvitedUsers, removeUserFromCampaign } from "../api/services/campaignServices";
import { useCampaign } from "../context/CampaignContext";
import { toast } from "react-hot-toast";

import type { CampaignUsers } from "../types/campaign";
import { isAxiosError } from "axios";

export const useCampaignUsers = () => {
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
                loading: "Récupération des participants...",
                success: "Liste des participants mise à jour",
                error: "Echec de la mise à jour des participants"
            }
        )
    };

    const removeUser = async (idCampaignUser: number) => {
        await toast.promise(
            removeUserFromCampaign(idCampaignUser)
                .then((res) => console.log(res))
                .catch((err) => {console.log(err); throw err}),
            {
                loading: "Suppression du participant...",
                success: "Participant retiré",
                error: "Echec de la suppression du participant"
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
                loading: "Recherhce de l'utilisateur...",
                success: "Participant ajouté à la campagne",
                error: (err) => isAxiosError(err) ? err.response?.data?.detail : "L'ajout du participant n'a pas abouti"
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