import { useState, type FC } from "react"; 
import { Map, ImageIcon, ChessPawn } from "lucide-react";
import { Trash } from "lucide-react";

interface Quota {
    currentSize: number,
    maxSize: number
}

type Props = {
    campaignId: number;
    availMaps: string[];
    availIllustrations: string[];
    availTokens: string[];
    loadMaps: () => void;
    loadIllustrations: () => void;
    loadTokens: () => void;
    uploadFile: (file: File, category: "maps" | "illustrations" | "tokens") => Promise<void>;
    deleteFile: (filename: string, category: "maps" | "illustrations" | "tokens") => Promise<void>;
    campaignQuota: Quota
};

const UploadSection: FC<{
    files: string[];
    loadFiles: () => void;
    uploadFile: (file: File) => void;
    deleteFile: (filename: string) => void;
    label: string;
    Icon: FC;
}> = ({ files, loadFiles, uploadFile, deleteFile, label, Icon }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col m-5 md:flex-row justify-between items-start md:items-center gap-3">
                <div className="text-lg flex gap-4 md:text-xl font-medium">
                    <Icon /> 
                    <div>{label}</div>
                </div>
                <button className="btn btn-primary w-full md:w-auto" onClick={loadFiles}>
                    Actualiser la liste
                </button>
            </div>

            <div className="hidden md:block bg-base-200 rounded-2xl px-4 divide-y divide-primary/30 w-full">
                <div className="flex p-3 gap-4 justify-between items-center font-semibold text-sm border-b">
                    <div className="flex gap-2">
                        <span>Nom de la ressource</span>
                    </div>
                    <div className="w-10 mr-2">Retirer</div>
                </div>
                {files.map((file, index) => (
                    <div
                        className="flex p-3 gap-4 justify-between items-center"
                        key={index}
                    >
                        <div className="flex gap-2">
                            <span>{file}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-ghost"
                            onClick={() => deleteFile(file)}
                        >
                            <Trash className="h-4 w-4" />                            
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col justify-between items-center mt-5 px-4 gap-4">
                <fieldset className="flex-1 fieldset w-full">
                    <legend className="fieldset-legend">Choisir un fichier</legend>
                    <input type="file" className="file-input w-full" onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setSelectedFile(e.target.files[0])
                        }
                    }}/>
                    <label className="label">Taille maximale: 2MB</label>
                </fieldset>
                <button
                    className="btn btn-primary w-full"
                    disabled={!selectedFile}
                    onClick={() => {
                        if (!selectedFile) return;
                        uploadFile(selectedFile)
                        setSelectedFile(null)
                    }}
                >
                    Uploader
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
                Ressources
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
                <p className="text-sm">Stockage : {formatBytes(campaignQuota.maxSize - campaignQuota.currentSize)} restants</p>
            </div>
            <div className="flex justify-center">
                <div className="tabs tabs-lift tabs-lg mb-5">
                    <button 
                        className={`tab ${activeTab === "maps" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("maps")}
                    >
                        Cartes
                    </button>
                    <button 
                        className={`tab ${activeTab === "illustrations" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("illustrations")}
                    >
                        Illustrations
                    </button>
                    <button 
                        className={`tab ${activeTab === "tokens" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("tokens")}
                    >
                        Tokens
                    </button>
                </div>
            </div>

            {activeTab === "maps" && (
                <UploadSection
                    files={availMaps}
                    loadFiles={loadMaps}
                    uploadFile={(file) => uploadFile(file, "maps")}
                    deleteFile={(filename) => deleteFile(filename, "maps")}
                    label="Cartes et arrière-plans"
                    Icon={Map}
                />
            )}

            {activeTab === "illustrations" && (
                <UploadSection
                    files={availIllustrations}
                    loadFiles={loadIllustrations}
                    uploadFile={(file) => uploadFile(file, "illustrations")}
                    deleteFile={(filename) => deleteFile(filename, "illustrations")}
                    label="Illustrations"
                    Icon={ImageIcon}
                />
            )}

            {activeTab === "tokens" && (
                <UploadSection
                    files={availTokens}
                    loadFiles={loadTokens}
                    uploadFile={(file) => uploadFile(file, "tokens")}
                    deleteFile={(filename) => deleteFile(filename, "tokens")}
                    label="Tokens"
                    Icon={ChessPawn}
                />
            )}
        </div>
    );
};

export default CampaignResourcesForm;