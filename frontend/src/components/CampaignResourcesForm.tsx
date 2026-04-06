import { useState, type FC } from "react"; 
import { Map, ImageIcon, ChessPawn } from "lucide-react";
import { Trash } from "lucide-react";
import type { FileType } from "../types/file"
import { useTranslation } from "react-i18next";

interface Quota {
    currentSize: number,
    maxSize: number
}

type Props = {
    campaignId: string;
    availMaps: FileType[];
    availIllustrations: FileType[];
    availTokens: FileType[];
    loadMaps: () => void;
    loadIllustrations: () => void;
    loadTokens: () => void;
    uploadFile: (file: File, category: "maps" | "illustrations" | "tokens", tokenSize?: "small" | "medium" | "big" | "giant") => Promise<void>;
    deleteFile: (filename: string, category: "maps" | "illustrations" | "tokens") => Promise<void>;
    campaignQuota: Quota
};

const UploadSection: FC<{
    files: FileType[];
    loadFiles: () => void;
    uploadFile: (file: File, tokenSize?: "small" | "medium" | "big" | "giant") => void;
    deleteFile: (filename: string) => void;
    label: string;
    activeTab: string;
    Icon: FC;
}> = ({ files, loadFiles, uploadFile, deleteFile, label, Icon, activeTab }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [tokenSize, setTokenSize] = useState<"small" | "medium" | "big" | "giant">("medium")
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-5 p-4">
            <div className="flex flex-col m-1 md:flex-row justify-between items-start md:items-center gap-3">
                <div className="text-lg flex gap-4 md:text-xl font-medium">
                    <Icon /> 
                    <div>{label}</div>
                </div>
                <button className="btn btn-primary w-full md:w-auto" onClick={loadFiles}>
                    {t("component.campaign-resources-form.upload-section.list")}
                </button>
            </div>

            <div className="hidden md:block bg-base-200 rounded-2xl px-4 divide-y divide-primary/30 w-full">
                <div className="flex p-3 gap-4 justify-between items-center font-semibold text-sm border-b">
                    <div className="flex gap-2">
                        <span>{t("component.campaign-resources-form.upload-section.table.name")}</span>
                    </div>
                    <div className="w-10 mr-6">{t("component.campaign-resources-form.upload-section.table.remove")}</div>
                </div>
                {files.map((file, index) => (
                    <div
                        className="flex p-3 gap-4 justify-between items-center"
                        key={index}
                    >
                        <div className="flex gap-2">
                            <span>{file.fileName}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-ghost"
                            onClick={() => deleteFile(file.uuid)}
                        >
                            <Trash className="h-4 w-4" />                            
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col justify-between items-center mt-5 gap-8">
                <fieldset className="flex-1 fieldset w-full">
                    <legend className="fieldset-legend">{t("component.campaign-resources-form.upload-section.send-box.fieldset")}</legend>
                    <input type="file" className="file-input w-full" onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setSelectedFile(e.target.files[0])
                        }
                    }}/>
                    <label className="label">{t("component.campaign-resources-form.upload-section.send-box.caption")}</label>
                </fieldset>
                {activeTab === "tokens" && (
                    <>
                        <div className="flex flex-row justify-between w-full items-center gap-4">
                            <div>{t("component.campaign-resources-form.upload-section.tokens.size.caption")}: </div>
                            <div className="flex-1 flex flex-row justify-between gap-2">
                                <button
                                    className={`flex-1 btn btn-primary ${(tokenSize !== "small") ? "btn-soft" : ""}`}
                                    onClick={() => setTokenSize("small")}
                                >
                                    {t("component.campaign-resources-form.upload-section.tokens.size.small")}
                                </button>
                                <button
                                    className={`flex-1 btn btn-primary ${(tokenSize !== "medium") ? "btn-soft" : ""}`}
                                    onClick={() => setTokenSize("medium")}
                                >
                                    {t("component.campaign-resources-form.upload-section.tokens.size.medium")}
                                </button>
                                <button
                                    className={`flex-1 btn btn-primary ${(tokenSize !== "big") ? "btn-soft" : ""}`}
                                    onClick={() => setTokenSize("big")}
                                >
                                    {t("component.campaign-resources-form.upload-section.tokens.size.big")}
                                </button>
                                <button
                                    className={`flex-1 btn btn-primary ${(tokenSize !== "giant") ? "btn-soft" : ""}`}
                                    onClick={() => setTokenSize("giant")}
                                >
                                    {t("component.campaign-resources-form.upload-section.tokens.size.giant")}
                                </button>
                            </div>
                        </div>
                        <div className="flex text-xs -mt-4"><i>{t("component.campaign-resources-form.upload-section.tokens.size.info")}</i></div>
                    </>
                )}
                <button
                    className="btn btn-primary w-full"
                    disabled={!selectedFile}
                    onClick={() => {
                        if (!selectedFile) return;
                        if (activeTab === "tokens") {
                            uploadFile(selectedFile, tokenSize);
                            setSelectedFile(null);
                        } else {
                            uploadFile(selectedFile);
                            setSelectedFile(null);
                        };
                        
                    }}
                >
                    {t("component.campaign-resources-form.upload-section.button")}
                </button>
            </div>
        </div>
    );
};

const CampaignResourcesForm: FC<Props> = ({
    availMaps,
    availIllustrations,
    availTokens,
    loadMaps,
    loadIllustrations,
    loadTokens,
    uploadFile,
    deleteFile,
    campaignQuota
}) => {
    const { t } = useTranslation(); 
    const [activeTab, setActiveTab] = useState<"maps" | "illustrations" | "tokens">("maps");

    function formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    return (
        <div className="flex flex-col">
            <p className="text-2xl md:text-4xl text-center font-semibold p-4 md:p-5 mb-3 md:mb-5">
                {t("component.campaign-resources-form.title")}
            </p>

            <div className="flex flex-col justify-between items-start md:items-center gap-3 mb-5 p-4">
                <progress 
                    className={`progress ${
                        campaignQuota.currentSize / campaignQuota.maxSize < 0.5 
                        ? "progress-info"
                        : campaignQuota.currentSize / campaignQuota.maxSize < 0.75 
                            ? "progress-warning" 
                            : campaignQuota.currentSize / campaignQuota.maxSize < 1 
                                ? "progress-error"
                                : "progress-neutral" 
                    }`} 
                    value={campaignQuota.currentSize} max={campaignQuota.maxSize}
                ></progress>
                <p className="text-sm">{t("component.campaign-resources-form.storage-info")}: {formatBytes(campaignQuota.maxSize - campaignQuota.currentSize)}</p>
            </div>
            <div className="flex justify-center">
                <div className="tabs tabs-lift tabs-lg mb-5">
                    <button 
                        className={`tab ${activeTab === "maps" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("maps")}
                    >
                        {t("component.campaign-resources-form.upload-section.maps.title")}
                    </button>
                    <button 
                        className={`tab ${activeTab === "illustrations" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("illustrations")}
                    >
                        {t("component.campaign-resources-form.upload-section.illustrations.title")}
                    </button>
                    <button 
                        className={`tab ${activeTab === "tokens" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("tokens")}
                    >
                        {t("component.campaign-resources-form.upload-section.tokens.title")}
                    </button>
                </div>
            </div>

            {activeTab === "maps" && (
                <UploadSection
                    files={availMaps}
                    loadFiles={loadMaps}
                    uploadFile={(file) => uploadFile(file, "maps")}
                    deleteFile={(fileUuid) => deleteFile(fileUuid, "maps")}
                    label={t("component.campaign-resources-form.upload-section.maps.label")}
                    Icon={Map}
                    activeTab={activeTab}
                />
            )}

            {activeTab === "illustrations" && (
                <UploadSection
                    files={availIllustrations}
                    loadFiles={loadIllustrations}
                    uploadFile={(file) => uploadFile(file, "illustrations")}
                    deleteFile={(fileUuid) => deleteFile(fileUuid, "illustrations")}
                    label={t("component.campaign-resources-form.upload-section.illustrations.title")}
                    Icon={ImageIcon}
                    activeTab={activeTab}
                />
            )}

            {activeTab === "tokens" && (
                <UploadSection
                    files={availTokens}
                    loadFiles={loadTokens}
                    uploadFile={(file, size) => uploadFile(file, "tokens", size)}
                    deleteFile={(fileUuid) => deleteFile(fileUuid, "tokens")}
                    label={t("component.campaign-resources-form.upload-section.tokens.title")}
                    Icon={ChessPawn}
                    activeTab={activeTab}
                />
            )}

            <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent mt-8 mb-5"></div>

            <div className="flex flex-col w-full p-4">
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="accordion-1" />
                    <div className="collapse-title font-semibold">{t("component.campaign-resources-form.info-section.1.title")}</div>
                    <div className="collapse-content text-sm">
                        <p className="mb-1">{t("component.campaign-resources-form.info-section.1.content.1")}</p>
                        <ul className="list-disc flex flex-col gap-1 mx-4 p-1">
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.1.content.2")}</p>
                            </li>
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.1.content.3")}</p>
                            </li>
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.1.content.4")}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="accordion-1" />
                    <div className="collapse-title font-semibold">{t("component.campaign-resources-form.info-section.2.title")}</div>
                    <div className="collapse-content text-sm">
                        <p className="mb-1">{t("component.campaign-resources-form.info-section.2.content.1")}</p>
                        <ul className="list-disc flex flex-col gap-1 mx-4 p-1">
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.2.content.2")}</p>
                            </li>
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.2.content.3")}</p>
                            </li>
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.2.content.4")}</p>
                            </li>
                        </ul>                        
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="accordion-1" />
                    <div className="collapse-title font-semibold">{t("component.campaign-resources-form.info-section.3.title")}</div>
                    <div className="collapse-content text-sm">
                        <p className="mb-1">{t("component.campaign-resources-form.info-section.3.content.1")}</p>
                        <p className="mb-1">{t("component.campaign-resources-form.info-section.3.content.2")}</p>
                        <ul className="list-disc flex flex-col gap-1 mx-4 p-1">
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.3.content.3")} <kbd className="kbd">/</kbd>, <kbd className="kbd">?</kbd>, <kbd className="kbd">#</kbd>, etc.</p>
                                <p>{t("component.campaign-resources-form.info-section.3.content.4")} <kbd className="kbd">_</kbd>,  <kbd className="kbd">-</kbd></p>
                            </li>
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.3.content.5")}</p>
                                <p><kbd className="kbd">01.city_night.webp</kbd>, <kbd className="kbd">02.donjeon_floor_01.webp</kbd>, etc.</p>
                            </li>
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.3.content.6")}<kbd className="kbd">PLAYER_*Character's name*</kbd></p>
                            </li>
                        </ul>                        
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="accordion-1" />
                    <div className="collapse-title font-semibold">{t("component.campaign-resources-form.info-section.4.title")}</div>
                    <div className="collapse-content text-sm">
                        <p className="mb-1">{t("component.campaign-resources-form.info-section.4.content.1")}</p>
                        <ul className="list-disc flex flex-col gap-1 mx-4 p-1">
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.4.content.2")}</p>
                            </li>
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.4.content.3")}</p>
                            </li>
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.4.content.4")}</p>
                            </li>
                        </ul>                        
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="accordion-1" />
                    <div className="collapse-title font-semibold">{t("component.campaign-resources-form.info-section.5.title")}</div>
                    <div className="collapse-content text-sm">
                        <ul className="list-disc flex flex-col gap-1 mx-4 p-1">
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.5.content.1")}</p>
                            </li>
                            <li>
                                <p>{t("component.campaign-resources-form.info-section.5.content.2")}</p>
                            </li>
                        </ul>                        
                    </div>
                </div>
            </div>
                        
        </div>
    );
};

export default CampaignResourcesForm;