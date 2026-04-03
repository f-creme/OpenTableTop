import { useEffect, useState, type FC } from "react"; 
import { Map, ImageIcon, ChessPawn } from "lucide-react";
import { Trash } from "lucide-react";
import type { FileType } from "../types/file"

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

    return (
        <div className="flex flex-col gap-5 p-4">
            <div className="flex flex-col m-1 md:flex-row justify-between items-start md:items-center gap-3">
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
                            <span>{file.fileName} - {file.uuid}</span>
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
                    <legend className="fieldset-legend">Choisir un fichier</legend>
                    <input type="file" className="file-input w-full" onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setSelectedFile(e.target.files[0])
                        }
                    }}/>
                    <label className="label">Taille maximale: 2MB. Formats autorisés: .webp, .png, .jpg</label>
                </fieldset>
                {activeTab === "tokens" && (
                    <>
                        <div className="flex flex-row justify-between w-full items-center gap-4">
                            <div>Taille du token : </div>
                            <div className="flex-1 flex flex-row justify-between gap-2">
                                <button
                                    className={`flex-1 btn btn-primary ${(tokenSize !== "small") ? "btn-soft" : ""}`}
                                    onClick={() => setTokenSize("small")}
                                >
                                    Petit
                                </button>
                                <button
                                    className={`flex-1 btn btn-primary ${(tokenSize !== "medium") ? "btn-soft" : ""}`}
                                    onClick={() => setTokenSize("medium")}
                                >
                                    Moyen
                                </button>
                                <button
                                    className={`flex-1 btn btn-primary ${(tokenSize !== "big") ? "btn-soft" : ""}`}
                                    onClick={() => setTokenSize("big")}
                                >
                                    Grand
                                </button>
                                <button
                                    className={`flex-1 btn btn-primary ${(tokenSize !== "giant") ? "btn-soft" : ""}`}
                                    onClick={() => setTokenSize("giant")}
                                >
                                    Géant
                                </button>
                            </div>
                        </div>
                        <div className="flex text-xs -mt-4"><i>Adaptez vos jetons par rapport à celles des jetons des joueurs, de taille moyenne</i></div>
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

    useEffect(() => {
        console.log(availMaps);
    }, [availMaps])

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
                    deleteFile={(fileUuid) => deleteFile(fileUuid, "maps")}
                    label="Cartes et arrière-plans"
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
                    label="Illustrations"
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
                    label="Tokens"
                    Icon={ChessPawn}
                    activeTab={activeTab}
                />
            )}

            <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent mt-8 mb-5"></div>

            <div className="flex flex-col w-full p-4">
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="accordion-1" />
                    <div className="collapse-title font-semibold">Types de ressources</div>
                    <div className="collapse-content text-sm">
                        <p className="mb-1">Les ressources sont réparties en trois catégories, chacune correspondant à un calque différent sur la table:</p>
                        <ul className="list-disc flex flex-col gap-1 mx-4 p-1">
                            <li>
                                <p><b>Cartes:</b> images de fond du canvas. Il peut s'agir de cartes, de décors ou de simples arrière-plans. Elles sont toujours affichées sur le calque inférieur.</p>
                            </li>
                            <li>
                                <p><b>Illustrations:</b> éléments visuels affichés au centre de la carte, sur un claque intermédiaire. Leur taille est automatiquement ajustée pour être visible.</p>
                            </li>
                            <li>
                                <p><b>Tokens:</b> éléments interactifs positionnés au-dessus des autres calques. Ils peuvent-être déplacés librement sur la carte et redimentsionnés manuellement.</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="accordion-1" />
                    <div className="collapse-title font-semibold">Performances et formats</div>
                    <div className="collapse-content text-sm">
                        <p className="mb-1">Pour garantir une expérience fluide:</p>
                        <ul className="list-disc flex flex-col gap-1 mx-4 p-1">
                            <li>
                                <p>Privilégiez des fichiers <b>légers</b>, surtout pour les tokens qui sont amenés à être déplacés en temps réel.</p>
                            </li>
                            <li>
                                <p>Le format <b>WEBPB</b> et recommandé pour un bon compromis qualité/poids.</p>
                            </li>
                            <li>
                                <p>Les formats <b>JPEG</b> et <b>PNG</b> sont également acceptés.</p>
                            </li>
                        </ul>                        
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="accordion-1" />
                    <div className="collapse-title font-semibold">Nommage des fichiers</div>
                    <div className="collapse-content text-sm">
                        <p className="mb-1">Pour éviter les problèmes techniques et faciliter l'organisation de vos parties:</p>
                        <ul className="list-disc flex flex-col gap-1 mx-4 p-1">
                            <li>
                                <p>N'utilisez pas d'espaces ni de caractères spéciaux comme <kbd className="kbd">/</kbd>, <kbd className="kbd">?</kbd>, <kbd className="kbd">#</kbd>, etc.</p>
                                <p>Remplacez les par <kbd className="kbd">_</kbd> ou <kbd className="kbd">-</kbd></p>
                            </li>
                            <li>
                                <p>Les ressources s'affichent des les sélecteurs <b>par ordre alphabétique</b>. Il est vivement conseillé d'utiliser un préfixe pour les organiser, par exemple :</p>
                                <p><kbd className="kbd">01.village_nuit.webp</kbd>, <kbd className="kbd">02.donjon_entree.webp</kbd>, etc.</p>
                            </li>
                        </ul>                        
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="accordion-1" />
                    <div className="collapse-title font-semibold">Dimensions et qualité</div>
                    <div className="collapse-content text-sm">
                        <p className="mb-1">Certains ajustements sont automatiques, mais pour un meilleur rendu: </p>
                        <ul className="list-disc flex flex-col gap-1 mx-4 p-1">
                            <li>
                                <p>Utilisez des images avec des dimensions adaptés dès le départ</p>
                            </li>
                            <li>
                                <p>Évitez les images trop petites par rapport à l'arrière-plan qui nécessiteraient un zoom, et également les images inutilement grandes qui alourdissent le chargement.</p>
                            </li>
                        </ul>                        
                    </div>
                </div>
            </div>
                        
        </div>
    );
};

export default CampaignResourcesForm;