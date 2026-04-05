import { useState } from "react";
import { useCampaign } from "../../context/CampaignContext";
import { useCampaignGlobal } from "../../hooks/useCampaignGlobal";
import CampaignMenu from "../../components/CampaignMenu";
import CampaignGeneralForm from "../../components/CampaignGeneralForm";
import CampaignUsersForm from "../../components/CampaignUsersForm";
import { Toaster } from "react-hot-toast";
import { useCampaignUsers } from "../../hooks/useCampaignUsers";
import CampaignResourcesForm from "../../components/CampaignResourcesForm";
import { useCampaignResources } from "../../hooks/useCampaignResources";
import { useTranslation } from "react-i18next";

export default function ManageCampaign() {
    const { t } = useTranslation();
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

    const {
        availMaps,
        availIllustrations,
        availTokens,
        loadMaps, 
        loadIllustrations,
        loadTokens,
        handleUpload,
        handleTrash,
        campaignQuota
    } = useCampaignResources()

    const [view, setView] = useState<"general" | "users" | "resources">("general");

    const handleSave = () => {
        if (campaignId === "__NULL__") {
            createCampaign();
        } else {
            updateCampaign();
        }
    };

    return (
        <div className="min-h-screen flex justify-center mb-5 px-2">
            <Toaster position="top-center" toastOptions={{ duration: 5000 }} />

            <div className="flex flex-col md:flex-row w-full md:w-9/10 gap-4 max-w-screen-2xl mt-4">

                <div className="md:hidden">
                    <select
                        value={view}
                        onChange={(e) =>
                            setView(e.target.value as "general" | "users" | "resources")
                        }
                        className="w-full p-2 border rounded-md shadow-sm "
                    >
                        <option value="general">{t("component.campaign-menu.options.general")}</option>
                        <option value="users">{t("component.campaign-menu.options.players")}</option>
                        <option value="resources">{t("component.campaign-menu.options.resources")}</option>
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
                            isNewCampaign={campaignId === "__NULL__"}
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

                    {view === "resources" && (
                        <CampaignResourcesForm 
                            campaignId={campaignId!}
                            availMaps={availMaps}
                            availIllustrations={availIllustrations}
                            availTokens={availTokens}
                            loadMaps={loadMaps}
                            loadIllustrations={loadIllustrations}
                            loadTokens={loadTokens}
                            uploadFile={handleUpload}
                            deleteFile={handleTrash}
                            campaignQuota={campaignQuota!}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}