// src/pages/gm/ManageCampaign.tsx
import { useState, useEffect } from "react";
import CampaignMenu from "../../components/CampaignMenu"

import { useCampaign } from "../../context/CampaignContext";
import { getCampaignTitle, putCampaignTitle } from "../../api/services/campaignServices";

import { Pen } from "lucide-react";

export default function ManageCampaign() {
    const { campaignId } = useCampaign();
    const [campaignTitle, setCampaignTitle] = useState<string>("");
    const [disabledEditCampaignTitle, setDisableEditCampaignTitle] = useState<boolean>(true)

    // Load campaign general information
    useEffect(() => {
        if (campaignId !== null) {
            getCampaignTitle({id: campaignId})
                .then((res) => setCampaignTitle(res))
                .catch((err) => console.log(err))
        };
    }, [campaignId]);

    // Update campaign general information
    const updateCampaignTitle = () => {
        if (campaignTitle.length < 35 && campaignTitle.length > 0 && campaignId !== null) {
            putCampaignTitle({
                id: campaignId,
                title: campaignTitle
            })
                .then((res) => console.log(res))
                .catch((err) => console.log(err))
        }
    }

    const [view, setView] = useState<"general" | "users" | "episodes">("general");

    return (
        <div className="min-h-screen flex justify-center mb-5">
            <div className="flex w-9/10">
                <div className="flex-4"><CampaignMenu view={view} setView={setView}/></div>
                <div className="flex-9 p-6">
                    {view === "general" && (
                        <>
                            <div className="flex flex-col">
                                <fieldset className="fieldset w-full">
                                    <legend className="fieldset-legend text-2xl" >Titre de la campagne</legend>
                                    <input 
                                        type="text" className="input input-xl w-full"
                                        value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} 
                                        disabled={disabledEditCampaignTitle}
                                    />
                                </fieldset>
                                <div className="flex flex-row-reverse mt-5 gap-5">
                                    <button 
                                        className="btn btn-success text-success-content p-3"
                                        disabled={disabledEditCampaignTitle}
                                        onClick={() => updateCampaignTitle()}
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        className={`btn btn-circle ${
                                            disabledEditCampaignTitle === false ? "btn-primary btn-soft" : ""
                                        }`}  
                                        onClick={() => setDisableEditCampaignTitle(!disabledEditCampaignTitle)}
                                    >
                                        <Pen />
                                    </button>
                                </div>    
                            </div>
                        </>
                    )}
                    {view === "users" && (
                        <div>Users</div>
                    )}
                    {view === "episodes" && (
                        <div>Episodes</div>
                    )}
                </div>
            </div>
        </div>
    )
}