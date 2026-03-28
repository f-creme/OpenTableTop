// src/pages/gm/ManageCampaign.tsx
import { useState, useEffect } from "react";
import { useCampaign } from "../../context/CampaignContext";
import { useProfile } from "../../context/ProfileContext";
import { getCampaignGlobal, putCampaignTitle } from "../../api/services/campaignServices";

import type { CampaignGlobal } from "../../types/campaign";

import CampaignMenu from "../../components/CampaignMenu"
import { Pen } from "lucide-react";

export default function ManageCampaign() {
    const { campaignId } = useCampaign();
    const { publicName } = useProfile();
    const { setPublicName } = useProfile();
    const [campaignTitle, setCampaignTitle] = useState<string>("");
    const [campaignProfile, setCampaignProfile] = useState<string>("");

    const [disabledEditGlobal, setDisableEditGlobal] = useState<boolean>(true)

    // Load campaign general information
    useEffect(() => {
        // console.log(campaignId)
        if (campaignId === null) return;
        if (campaignId < 0) return;

        const fetchGlobal = async () => {
            try {
                const res: CampaignGlobal = await getCampaignGlobal(campaignId);
                setCampaignTitle(res.campaignTitle);
                if (res.userCampaignCharacterName) {
                    setPublicName(res.userCampaignCharacterName)
                } else if (res.userPublicName) {
                    setPublicName(res.userPublicName)
                };
            } catch (err) {
                console.error(err);
            }
        };
        fetchGlobal();
    }, [campaignId]);

    // Update campaign global
    const updateCampaignTitle = async () => {
        if (
            campaignId === null ||
            campaignId < 0 ||
            campaignTitle.length === 0 ||
            campaignTitle.length >= 35
        ) return;

        try {
            const res = await putCampaignTitle(campaignId, campaignTitle);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    };

    // Create campaign
    const createCampaign = async () => {
        if (
            campaignId === null ||
            campaignId !== -1 ||
            campaignTitle.length === 0 ||
            campaignTitle.length >= 35
        ) return;

        console.log("Cr")
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
                                {campaignId === -1 && (
                                    <>
                                        <p className="bg-info/10 rounded-md text-info p-4 mb-4">
                                            Donnez un titre à votre campagne pour finaliser sa création.
                                        </p>
                                    </>
                                )}
                                <fieldset className="fieldset w-full mb-4">
                                    <legend className="fieldset-legend text-2xl">Titre de la campagne</legend>
                                    <input 
                                        type="text" className="input input-xl w-full"
                                        value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} 
                                        disabled={disabledEditGlobal}
                                    />
                                </fieldset>

                                <fieldset>
                                    <legend className="fieldset-legend">Votre nom pour la campagne</legend>
                                    <input 
                                        type="text" className="input input-md w-full"
                                        value={campaignProfile} onChange={(e) => setCampaignProfile(e.target.value)} 
                                        disabled={disabledEditGlobal}
                                    />
                                </fieldset>
                                <div className="flex flex-row-reverse mt-5 gap-5">
                                    <button 
                                        className="btn btn-success text-success-content p-3"
                                        disabled={disabledEditGlobal}
                                        onClick={() => {
                                            if (campaignId === -1) {
                                                createCampaign()
                                            } else {
                                                updateCampaignTitle()
                                            }
                                        }}
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        className={`btn btn-circle ${
                                            disabledEditGlobal === false ? "btn-primary btn-soft" : ""
                                        }`}  
                                        onClick={() => setDisableEditGlobal(!disabledEditGlobal)}
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