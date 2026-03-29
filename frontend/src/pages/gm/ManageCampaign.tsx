import { useState } from "react";
import { useCampaign } from "../../context/CampaignContext";
import { useCampaignGlobal } from "../../hooks/useCampaignGlobal";
import CampaignMenu from "../../components/CampaignMenu";
import CampaignGeneralForm from "../../components/CampaignGeneralForm";
import CampaignUsersForm from "../../components/CampaignUsersForm";
import { Toaster } from "react-hot-toast";
import { useCampaignUsers } from "../../hooks/useCampaignUsers";

export default function ManageCampaign() {
    const { campaignId } = useCampaign();

    const {
        campaignTitle,
        setCampaignTitle,
        localPublicName,
        setLocalPublicName,
        disabledEditGlobal,
        setDisabledEditGlobal,
        updateCampaign,
        createCampaign
    } = useCampaignGlobal();

    const {
        usersList,
        setUsersList,
        loadUsers,
        removeUser,
        newParticipant,
        setNewParticipant,
        addParticipant
    } = useCampaignUsers();

    const [view, setView] = useState<"general" | "users" | "episodes">("general");

    const handleSave = () => {
        if (campaignId === -1) {
            createCampaign();
        } else {
            updateCampaign();
        }
    };

    return (
        <div className="min-h-screen flex justify-center mb-5 px-2">
            <Toaster position="top-center" toastOptions={{ duration: 5000 }} />

            <div className="flex flex-col md:flex-row w-full md:w-9/10 gap-4">

                <div className="md:hidden">
                    <select
                        value={view}
                        onChange={(e) =>
                            setView(e.target.value as "general" | "users" | "episodes")
                        }
                        className="w-full p-2 border rounded-md shadow-sm "
                    >
                        <option value="general">Général</option>
                        <option value="users">Utilisateurs</option>
                        <option value="episodes">Épisodes</option>
                    </select>
                </div>

                <div className="hidden md:block md:w-1/3 lg:w-1/4">
                    <CampaignMenu view={view} setView={setView} />
                </div>

                <div className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-6 rounded-xl shadow-xl">

                    {view === "general" && (
                        <CampaignGeneralForm
                            campaignTitle={campaignTitle}
                            setCampaignTitle={setCampaignTitle}
                            localPublicName={localPublicName}
                            setLocalPublicName={setLocalPublicName}
                            disabledEditGlobal={disabledEditGlobal}
                            setDisabledEditGlobal={setDisabledEditGlobal}
                            onSave={handleSave}
                            isNewCampaign={campaignId === -1}
                        />
                    )}

                    {view === "users" && (
                        <CampaignUsersForm
                            usersList={usersList}
                            setUsersList={setUsersList}
                            onLoad={loadUsers}
                            onRemove={removeUser}
                            newParticipant={newParticipant}
                            setNewParticipant={setNewParticipant}
                            onAddParticipant={addParticipant}
                        />
                    )}

                    {view === "episodes" && (
                        <div>Episodes</div>
                    )}
                </div>
            </div>
        </div>
    );
}