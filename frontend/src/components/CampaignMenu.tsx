// src/components/CampaignMenu.tsx

import { useState, useEffect } from "react";
import { ScrollText, Settings, Users } from "lucide-react";
import { useCampaign } from "../context/CampaignContext";
import { DeleteCampaign } from "../api/services/campaignServices";
import { Toaster, toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CampaignMenuProps {
    view: "general" | "users" | "resources"
    setView: (value: "general" | "users" | "resources") => void;
}

const CampaignMenu = ({ view, setView }: CampaignMenuProps) => {
    const { t } = useTranslation();
    const { campaignId } = useCampaign();
    const { setCampaignId } = useCampaign();
    const [disabledMenu, setDisabledMenu] = useState<boolean>(true)
    const [redirect, setRedirect] = useState<boolean>(false)

    useEffect(() => {
        if (!campaignId || campaignId === "__NULL__") return;
        setDisabledMenu(false);
    }, [campaignId])

    const deleteCampaign = async () => {
        if (campaignId === null) return;

        await toast.promise(
            DeleteCampaign(campaignId),
            {
                loading: "Suppression en cours...",
                success: "Campagne supprimée. \nRetour à l'écran d'accueil.",
                error: "Impossible de supprimer la campagne.",
            });
        setCampaignId("__NULL__");
        setTimeout(() => setRedirect(true), 3000)
    };

    return (
        <div className="min-h-full min-w-full bg-base-200 p-4 rounded-2xl shadow-xl flex flex-col">
            <Toaster position="top-center" toastOptions={{ duration: 5000 }}/>
            <div className="flex-1 flex flex-col gap-2">
                <p className="font-semibold py-2">{t("component.campaign-menu.title")}</p>

                <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent"></div>
                <button 
                    className={`btn justify-start gap-2 ${
                        view ==="general" ? "btn-primary btn-soft" : "btn-ghost"
                    }`} 
                    onClick={() => setView("general")}
                >
                    <Settings className="h-5 w-5"/> {t("component.campaign-menu.options.general")}
                </button>

                <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent"></div>
                <button 
                    className={`btn justify-start gap-2 ${
                        view ==="users" ? "btn-primary btn-soft" : "btn-ghost"
                    }`}  
                    disabled={disabledMenu}
                    onClick={() => setView("users")}
                >
                    <Users className="h-5 w-5"/> {t("component.campaign-menu.options.players")}
                </button>

                <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent"></div>
                <button 
                    className={`btn justify-start gap-2 ${
                        view ==="resources" ? "btn-primary btn-soft" : "btn-ghost"
                    }`} 
                    disabled={disabledMenu}
                    onClick={() => setView("resources")}
                >
                    <ScrollText className="h-5 w-5"/> {t("component.campaign-menu.options.resources")} 
                </button>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent"></div>
            <div className="flex flex-col gap-4 justify-between m-4 mb-0">
                <button 
                    className="flex-1 btn btn-error text-error-content p-3" 
                    disabled={disabledMenu} 
                    onClick={() => {if (confirm("Supprimer définitivement la campagne et toutes les données ?")) deleteCampaign()}}
                >{t("component.campaign-menu.options.deletion")}</button>
                {redirect === true && (
                    <Navigate to="/room/role-selection"/>
                )}
            </div>
            
        </div>
    );
}

export default CampaignMenu;