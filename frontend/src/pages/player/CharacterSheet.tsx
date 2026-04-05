// pages/player/CharacterSheet.tsx
import { Navigate } from "react-router-dom"
import { useRole } from "../../context/RoleContext"
import { useEffect, useState } from "react"
import { useCharacterSheet } from "../../hooks/useCharacterSheet"
import toast, { Toaster } from "react-hot-toast"
import type { Character, Player } from "../../types/character"
import { useWebSocket } from "../../context/WebSocketContext"
import { useNavigate } from "react-router-dom"
import { Pipette } from "lucide-react"
import { useCampaign } from "../../context/CampaignContext"
import { useTranslation } from "react-i18next"

export default function CharacterSheet() {
    const { t } = useTranslation();
    const { role } = useRole()
    if ( role !== "player" ) {
        return <Navigate to="/room" />
    }
    const {
        availCharacters,
        loadCharacterPortrait,
        loadCharacterToken,
        loadCharacters,
        createCharacter,
        updateCharacter, 
        joinCampaignWithToken
    } = useCharacterSheet()

    const { send } = useWebSocket();
    const { campaignId } = useCampaign();

    const [selectedCharacterId, setSelectedCharacterId] = useState<string>("__NULL__")
    const [characterName, setCharacterName] = useState<string>("")
    const [characterClass, setCharacterClass] = useState<string>("")
    const [characterAppearance, setCharacterAppearance] = useState<string>("")
    const [characterPersonality, setCharacterPersonality] = useState<string>("")  
    const [characterBio, setCharacterBio] = useState<string>("")
    const [fileToUpload, setFileToUpload] = useState<File | null>(null)
    const [characterPortrait, setCharacterPortrait] = useState<string | null>(null)
    const [characterToken, setCharacterToken] = useState<string | null>(null)
    const [disabledJoin, setDisabledJoin] = useState<boolean>(false)
    const [color, setColor] = useState<string>("#ffd3ac")

    const navigate = useNavigate() 

    const joinTable = () => {
        if (selectedCharacterId === "__NULL__") return;

        if (!characterPortrait) {
            const confirmNoPortrait = window.confirm(
                t("page.character-sheet.join.confirm-no-portrait")
            );
            if (!confirmNoPortrait) return;
        }

        setDisabledJoin(true);
        const player: Player = {
            characterUuid: selectedCharacterId,
            characterName: characterName,
            characterRole: characterClass,
            characterPortrait: (!characterPortrait) ? false : true,
            userPublicName: localStorage.getItem("publicName")!, 
            color: color           
        };

        if (characterPortrait) joinCampaignWithToken(
            selectedCharacterId, characterName, 
            player.characterPortrait, campaignId!
        );

        send({ type: "join_player", player: player});
        toast("Redirection vers la table de jeu...");
        setTimeout(() => {
            navigate("/room/table");
            setDisabledJoin(false);
        }, 2000);
    }

    useEffect(() => {
        if (selectedCharacterId === "__NULL__") {
            setCharacterName("");
            setCharacterClass("");
            setCharacterAppearance("");
            setCharacterPersonality("");
            setCharacterBio("");  
            setCharacterPortrait(null);
            setCharacterToken(null);     
        } else {
            const selectedCharacter: Character = availCharacters.filter((t) => t.uuid === selectedCharacterId)[0];
            setCharacterName(selectedCharacter.name);
            setCharacterClass(selectedCharacter.classOrRole);
            setCharacterAppearance(selectedCharacter.appearance);
            setCharacterPersonality(selectedCharacter.personality);
            setCharacterBio(selectedCharacter.bio);

            async function loadImages() {
                const portraitURL = await loadCharacterPortrait(selectedCharacterId);
                if (portraitURL) {
                    setCharacterPortrait(portraitURL);
                } else {
                    setCharacterPortrait(null);
                };

                const tokenURL = await loadCharacterToken(selectedCharacterId);
                if (tokenURL) {
                    setCharacterToken(tokenURL);
                } else {
                    setCharacterToken(null);
                };                
            }
            loadImages();
    }}, [selectedCharacterId]);

    useEffect(() => {
        loadCharacters();        
    }, []);

    return (
<div className="flex flex-col lg:flex-row mx-15 2xl:mx-auto mt-4 gap-10 max-w-screen-2xl sm:gap-4">
    <Toaster position="top-center" containerClassName="text-center" toastOptions={{ duration: 4000 }} />
    <div className="flex flex-col sm:flex-1 justify-between bg-base-200 min-h-[70vh] p-4 gap-1 rounded-2xl shadow-2xl">
        <span className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <p>{t("page.character-sheet.form.select")}</p>
            <select
                className="flex-1 select select-sm"
                onChange={(e) => setSelectedCharacterId(String(e.target.value))}
            >
                <option value={"__NULL__"} key={-1}>{t("page.character-sheet.form.create")}</option>
                {availCharacters.length > 0 && availCharacters.map((c, index) => (
                    <option value={c.uuid} key={index}>{c.name}</option>
                ))}
            </select>
        </span>

        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend text-">{t("page.character-sheet.form.name")}</legend>
                    <input
                        type="text"
                        className="input w-full"
                        value={characterName}
                        maxLength={30}
                        onChange={(e) => setCharacterName(e.target.value)}
                    />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend text-">{t("page.character-sheet.form.appearance")}</legend>
                    <input
                        type="text"
                        className="input w-full"
                        value={characterAppearance}
                        maxLength={33}
                        onChange={(e) => setCharacterAppearance(e.target.value)}
                    />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend text-">{t("page.character-sheet.form.bio")}</legend>
                    <textarea
                        wrap="soft"
                        className="textarea w-full"
                        value={characterBio}
                        maxLength={144}
                        onChange={(e) => setCharacterBio(e.target.value)}
                    />
                </fieldset>
            </div>
            <div className="flex-1 flex flex-col">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend text-">{t("page.character-sheet.form.role")}</legend>
                    <input
                        type="text"
                        className="input w-full"
                        value={characterClass}
                        maxLength={30}
                        onChange={(e) => setCharacterClass(e.target.value)}
                    />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend text-">{t("page.character-sheet.form.personality")}</legend>
                    <input
                        type="text"
                        className="input w-full"
                        value={characterPersonality}
                        maxLength={33}
                        onChange={(e) => setCharacterPersonality(e.target.value)}
                    />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">{t("page.character-sheet.form.portrait")}</legend>
                    <input
                        type="file"
                        className="file-input w-full"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setFileToUpload(e.target.files[0])
                            }
                        }}
                    />
                    <label className="label">{t("page.character-sheet.form.portrait-info.1")}<br/>{t("page.character-sheet.form.portrait-info.2")}</label>
                </fieldset>
            </div>
        </div>
        <button
            className="btn btn-secondary p-2 mt-2"
            onClick={() => {
                if (selectedCharacterId === "__NULL__") {
                    createCharacter(
                    {
                        uuid: selectedCharacterId, name: characterName, classOrRole: characterClass,
                        appearance: characterAppearance, personality: characterPersonality,
                        bio: characterBio
                    }, fileToUpload
                )} else if (confirm(t("page.character-sheet.form.confirm-update"))) {
                    updateCharacter(
                    {
                        uuid: selectedCharacterId, name: characterName, classOrRole: characterClass,
                        appearance: characterAppearance, personality: characterPersonality,
                        bio: characterBio
                    }, fileToUpload
                )}
            }}
        >
            {t("page.character-sheet.form.button")}
        </button>
        <div className="h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent mt-4 mb-4"></div>
        <p className="text-sm text-center">{t("page.character-sheet.join.caption")}</p>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 2xl:mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <label className="gap-2"><Pipette className="h-5 w-5"/></label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
            </div>
            <button
                className="btn btn-primary flex-1"
                onClick={() => joinTable()}
                disabled={
                    selectedCharacterId === "__NULL__"
                    ? true
                    : disabledJoin
                }
            >{t("page.character-sheet.join.button")}</button>
        </div>
    </div>
    <div className="flex flex-col xs:flex-1 min-h-100 items-center justify-center">
        <a href="#" className="hover-3d mx-2 cursor-pointer">
            <div className="card w-110 aspect-8/5 bg-black text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]">
                <div className="card-body">
                    <div className="flex flex-col">
                        <div className="flex justify-between mb-10 gap-4 flex-col sm:flex-row">
                            <div className="w-full sm:w-2/3">
                                <div className="font-bold">{characterName.toUpperCase()}</div>
                                <div className="font-bold opacity-30">{characterClass.toUpperCase()}</div>
                                <div className="font-bold opacity-30 text-xs mt-2">{t("component.character-card.bio")}</div>
                                <div className="font-bold opacity-50 text-xs text-justify">{characterBio}</div>
                            </div>
                            <div className="w-full sm:w-1/3 bg-amber-50 aspect-square flex items-center ring-primary ring-2 ring-offset-2">
                                {characterPortrait ? (
                                    <img src={characterPortrait} alt="Portrait" className=""/>
                                ) : (
                                    <p className="text text-black text-center m-4">{t("component.character-card.portrait-warning")}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                                <div className="font-bold opacity-30 text-xs mt-2">{t("component.character-card.appearance")}</div>
                                <div className="font-bold opacity-50 text-xs text-justify">{characterAppearance}</div>
                            </div>
                            <div>
                                <div className="font-bold opacity-30 text-xs mt-2">{t("component.character-card.personality")}</div>
                                <div className="font-bold opacity-50 text-xs text-justify">{characterPersonality}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </a>
        <div>
            <a href="#" className="hover-3d my-2 mx-2 cursor-pointer">
                <div className="card w-50 text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)]">
                    <div className="card-body">
                        {characterToken ? (
                            <img src={characterToken} alt="Portrait" />
                        ) : (
                            <p className="text text-black text-center m-4">{t("component.character-card.portrait-warning")}</p>
                        )}
                    </div>
                </div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </a>
        </div>
    </div>
</div>
    );
}