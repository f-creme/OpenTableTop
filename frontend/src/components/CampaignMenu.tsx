// src/components/CampaignMenu.tsx

import { ScrollText, Settings, Users } from "lucide-react";

interface CampaignMenuProps {
    view: "general" | "users" | "episodes"
    setView: (value: "general" | "users" | "episodes") => void;
}

const CampaignMenu = ({ view, setView }: CampaignMenuProps) => {

    return (
        <div className="min-h-full min-w-full bg-base-200 p-4 rounded-2xl shadow-xl flex flex-col">
            <div className="flex-1 flex flex-col gap-2">
                <p className="font-semibold py-2">Gestion de la campagne</p>

                <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent"></div>
                <button 
                    className={`btn justify-start gap-2 ${
                        view ==="general" ? "btn-primary btn-soft" : "btn-ghost"
                    }`} 
                    onClick={() => setView("general")}
                >
                    <Settings className="h-5 w-5"/> Général
                </button>

                <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent"></div>
                <button 
                    className={`btn justify-start gap-2 ${
                        view ==="users" ? "btn-primary btn-soft" : "btn-ghost"
                    }`}  
                    onClick={() => setView("users")}
                >
                    <Users className="h-5 w-5"/> Joueurs invités
                </button>

                <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent"></div>
                <button 
                    className={`btn justify-start gap-2 ${
                        view ==="episodes" ? "btn-primary btn-soft" : "btn-ghost"
                    }`} 
                    onClick={() => setView("episodes")}
                >
                    <ScrollText className="h-5 w-5"/> Épisodes 
                </button>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent"></div>
            <div className="flex flex-col gap-4 justify-between m-4 mb-0">
                <button className="flex-1 btn btn-success text-success-content p-3">Enregistrer</button>
                <button className="flex-1 btn btn-error text-error-content p-3">Supprimer</button>
            </div>
        </div>
    );
}

export default CampaignMenu;