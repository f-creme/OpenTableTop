import type { Dispatch, SetStateAction, FC } from "react"; 
import type { CampaignUsers } from "../types/campaign";

import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
    usersList: CampaignUsers[];
    setUsersList: Dispatch<SetStateAction<CampaignUsers[]>>;
    onLoad: () => void;
    onRemove: (idCampaignUser: number) => void;
    newParticipant: string;
    setNewParticipant: (name: string) => void;
    onAddParticipant: (userName: string) => void;
};

const CampaignUsersForm: FC<Props> = ({
    usersList,
    onLoad,
    onRemove,
    newParticipant,
    setNewParticipant,
    onAddParticipant
}) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col">
            <p className="text-2xl md:text-4xl text-center font-semibold p-4 md:p-5 mb-3 md:mb-5">
                {t("component.campaign-users-form.title")}
            </p>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-5 p-4">
                <div className="text-lg md:text-xl font-medium">
                    {t("component.campaign-users-form.section.list.title")}
                </div>
                <button className="btn btn-primary w-full md:w-auto" onClick={onLoad}>
                    {t("component.campaign-users-form.section.list.button")}
                </button>
            </div>

            <div className="hidden md:block bg-base-200 rounded-2xl px-4 divide-y divide-primary/30 w-full">
                <div className="flex p-3 gap-4 justify-between items-center font-semibold text-sm border-b">
                    <div className="flex gap-2">
                        <span className="w-40">{t("component.campaign-users-form.section.list.table.participant")}</span>
                        <span className="w-40">{t("component.campaign-users-form.section.list.table.character")}</span>
                        <span className="w-24">{t("component.campaign-users-form.section.list.table.role")}</span>
                    </div>
                    <div className="w-10 mr-2">{t("component.campaign-users-form.section.list.table.remove")}</div>
                </div>

                {usersList.map((user) => (
                    <div
                        key={user.idCampaignUser}
                        className="flex p-3 gap-4 justify-between items-center"
                    >
                        <div className="flex gap-2">
                            <span className="w-40 truncate">{user.publicName}</span>
                            <span className="w-40 truncate">{user.characterName}</span>
                            <span className="w-24">
                                {user.userRole === "gm" ? t("component.campaign-users-form.section.list.roles.gm") : t("component.campaign-users-form.section.list.roles.player")}
                            </span>
                        </div>

                        <button
                            className="btn btn-primary btn-soft"
                            disabled={user.userRole === "gm"}
                            onClick={() => {
                                if (confirm(t("component.campaign-users-form.section.list.confirm-remove"))) {
                                    onRemove(user.idCampaignUser);
                                }
                            }}
                        >
                            <Trash className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col p-4 gap-3 md:hidden">
                {usersList.map((user) => (
                    <div
                        key={user.idCampaignUser}
                        className="bg-base-200 rounded-xl p-4 shadow-sm"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1 text-sm">
                                <span>
                                    <strong>{t("component.campaign-users-form.section.list.table.participant")} :</strong> {user.publicName}
                                </span>
                                <span>
                                    <strong>{t("component.campaign-users-form.section.list.table.character")} :</strong> {user.characterName}
                                </span>
                                <span>
                                    <strong>{t("component.campaign-users-form.section.list.table.role")} :</strong>{" "}
                                    {user.userRole === "gm"
                                        ? t("component.campaign-users-form.section.list.roles.gm")
                                        : t("component.campaign-users-form.section.list.roles.player")}
                                </span>
                            </div>

                            <button
                                className="btn btn-primary btn-soft btn-sm"
                                disabled={user.userRole === "gm"}
                                onClick={() => {
                                    if (confirm(t("component.campaign-users-form.section.list.confirm-remove"))) {
                                        onRemove(user.idCampaignUser);
                                    }
                                }}
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col mt-5 mb-5 p-4 gap-3">
                <div className="text-lg md:text-xl font-medium">
                    {t("component.campaign-users-form.section.add.title")}
                </div>

                <p className="text-sm md:text-base">
                    {t("component.campaign-users-form.section.add.caption")}
                </p>

                <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-2 md:items-end">
                    <fieldset className="w-full md:w-2/3">
                        <legend className="fieldset-legend">{t("component.campaign-users-form.section.add.search")}</legend>
                        <input
                            type="text"
                            className="input w-full"
                            value={newParticipant}
                            onChange={(e) => setNewParticipant(e.target.value)}
                        />
                    </fieldset>

                    <button
                        className="btn btn-primary w-full md:w-1/3"
                        onClick={() => {
                            if (confirm(t("component.campaign-users-form.section.add.confirm"))) {
                                onAddParticipant(newParticipant);
                            }
                        }}
                    >
                        {t("component.campaign-users-form.section.add.button")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignUsersForm;