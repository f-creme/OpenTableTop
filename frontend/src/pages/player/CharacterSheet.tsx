// pages/player/CharacterSheet.tsx
import { Navigate } from "react-router-dom"
import { useRole } from "../../context/RoleContext"
import { useEffect, useState } from "react"
import { useCharacterSheet } from "../../hooks/useCharacterSheet"
import { Toaster } from "react-hot-toast"
import type { Character, Player } from "../../types/character"
import { useSendOnce } from "../../hooks/useSendOnce"
import { useCampaign } from "../../context/CampaignContext"

export default function CharacterSheet() {
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
        updateCharacter
    } = useCharacterSheet()

    const { campaignId } = useCampaign()

    const apiURL = import.meta.env.VITE_API_URL;
    const { sendOnce, enableSend } = useSendOnce(campaignId, apiURL)

    const [selectedCharacterId, setSelectedCharacterId] = useState<number>(-1)
    const [characterName, setCharacterName] = useState<string>("")
    const [characterClass, setCharacterClass] = useState<string>("")
    const [characterAppearance, setCharacterAppearance] = useState<string>("")
    const [characterPersonality, setCharacterPersonality] = useState<string>("")  
    const [characterBio, setCharacterBio] = useState<string>("")
    const [fileToUpload, setFileToUpload] = useState<File | null>(null)
    const [characterPortrait, setCharacterPortrait] = useState<string | null>(null)
    const [characterToken, setCharacterToken] = useState<string | null>(null)

    const joinTable = () => {
        const player: Player = {
            characterId: selectedCharacterId,
            characterName: characterName,
            characterRole: characterClass,
            characterPortrait: characterPortrait,
            userPublicName: localStorage.getItem("publicName")!            
        };

        sendOnce({ type: "join_player", player: player }, 10000)
    }

    useEffect(() => {
        if (selectedCharacterId < 0) {
            setCharacterName("");
            setCharacterClass("");
            setCharacterAppearance("");
            setCharacterPersonality("");
            setCharacterBio("");       
        } else {
            const selectedCharacter: Character = availCharacters.filter((t) => t.id === selectedCharacterId)[0];
            setCharacterName(selectedCharacter.name);
            setCharacterClass(selectedCharacter.classOrRole);
            setCharacterAppearance(selectedCharacter.appearance);
            setCharacterPersonality(selectedCharacter.personality);
            setCharacterBio(selectedCharacter.bio);

            async function loadImages() {
                const portraitURL = await loadCharacterPortrait(selectedCharacterId);
                if (portraitURL) {
                    setCharacterPortrait(portraitURL)
                } else {
                    setCharacterPortrait(null)
                };

                const tokenURL = await loadCharacterToken(selectedCharacterId);
                if (tokenURL) {
                    setCharacterToken(tokenURL)
                } else {
                    setCharacterToken(null)
                };                
            }
            loadImages();
    }}, [selectedCharacterId])

    useEffect(() => {
        loadCharacters();        
    }, [])

    return (
        <div className="flex flex-row mx-20 mt-10 gap-10">
            <Toaster position="top-center" containerClassName="text-center" toastOptions={{ duration: 4000 }} />
            <div className="flex flex-1 bg-base-200 min-h-100 flex-col p-4 gap-1 rounded-2xl shadow-2xl">
                <span className="flex flex-row gap-4 items-center mb-8">
                    <p>Sélectionner un de vos personnages :</p>
                    <select 
                        className="flex-1 select select-sm"
                        onChange={(e) => setSelectedCharacterId(Number(e.target.value))}
                    >
                        <option value={-1} key={-1}>Nouveau personnage</option>
                        {availCharacters.length > 0 && availCharacters.map((c) => (
                            <option value={c.id} key={c.id}>{c.name}</option>
                        ))}
                    </select>
                </span>


                <div className="flex flex-row gap-4">
                    <div className="flex-1 flex flex-col">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend text-">Nom du personnage</legend>
                            <input
                                type="text"
                                className="input w-full"
                                value={characterName}
                                maxLength={30}
                                onChange={(e) => setCharacterName(e.target.value)}
                            />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend text-">Apparence (en quelques mots)</legend>
                            <input 
                                type="text"
                                className="input w-full" 
                                value={characterAppearance}
                                maxLength={33}
                                onChange={(e) => setCharacterAppearance(e.target.value)}
                            />
                        </fieldset>    

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend text-">Bio</legend>
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
                            <legend className="fieldset-legend text-">Rôle ou classe</legend>
                            <input
                                type="text"
                                className="input w-full"
                                value={characterClass}
                                maxLength={30}
                                onChange={(e) => setCharacterClass(e.target.value)}
                            />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend text-">Personnalité (en quelques mots)</legend>
                            <input
                                type="text" 
                                className="input w-full" 
                                value={characterPersonality}
                                maxLength={33}
                                onChange={(e) => (setCharacterPersonality(e.target.value))}
                            />
                        </fieldset>      
                            <fieldset className="fieldset">
                            <legend className="fieldset-legend">Portrait</legend>
                            <input 
                                type="file" 
                                className="file-input" 
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setFileToUpload(e.target.files[0])
                                    }
                                }}
                            />
                            <label className="label">Taille maximale: 1MB (type WEBP, PNG ou JPG)<br/>Format recommandé: 1:1 (carré)</label>
                        </fieldset>   
               
                    </div>
                </div>
                <div className="flex flex-row justify-between gap-4 mt-10">
                    <button 
                        className="btn btn-secondary flex-1"
                        onClick={() => {
                            if (selectedCharacterId < 0) {
                                createCharacter(
                                {
                                    id: selectedCharacterId, name: characterName, classOrRole: characterClass,
                                    appearance: characterAppearance, personality: characterPersonality, 
                                    bio: characterBio
                                }, fileToUpload
                            )} else if (confirm("Mettre à jour le personnage ?")) {
                                updateCharacter(
                                {
                                    id: selectedCharacterId, name: characterName, classOrRole: characterClass,
                                    appearance: characterAppearance, personality: characterPersonality, 
                                    bio: characterBio
                                }, fileToUpload
                            )}
                        }}
                    >
                        Valider les informations
                    </button>
                    <button 
                        className="btn btn-primary flex-1"
                        disabled={
                            (selectedCharacterId < 0) 
                                ? true 
                                : (enableSend) 
                                    ? false
                                    : true
                        }
                        onClick={() => joinTable()}
                    >Rejoindre la table de jeu</button>
                </div>
            </div>
            <div className="flex flex-1 min-h-100 flex-col items-center justify-center">
                <a href="#" className="hover-3d mx-2 cursor-pointer">
                
                    <div className="card w-110 aspect-8/5 bg-black text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]">
                        <div className="card-body">
                            <div className="flex justify-between mb-10 gap-4">
                                <div className="w-2/3">
                                    <div className="font-bold">{characterName.toUpperCase()}</div>
                                    <div className="font-bold opacity-30">{characterClass.toUpperCase()}</div>
                                    <div className="font-bold opacity-30 text-xs mt-2">BIO</div>
                                    <div className="font-bold opacity-50 text-xs text-justify">{characterBio}</div>
                                </div>
                                <div className="w-1/3 bg-amber-50 aspect-square flex items-center">
                                    {characterPortrait ? (
                                        <img src={characterPortrait} alt="Portrait" />
                                    ) : (
                                        <p className="text text-black text-center m-4">Ajouter un portrait à votre personnage</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-row justify-between">
                                <div>
                                    <div className="font-bold opacity-30 text-xs mt-2">APPARENCE</div>
                                    <div className="font-bold opacity-50 text-xs text-justify">{characterAppearance}</div>
                                </div>
                                <div>
                                    <div className="font-bold opacity-30 text-xs mt-2">PERSONNALITE</div>
                                    <div className="font-bold opacity-50 text-xs text-justify">{characterPersonality}</div>
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
                                <p className="text text-black text-center m-4">Ajouter un portrait à votre personnage</p>
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