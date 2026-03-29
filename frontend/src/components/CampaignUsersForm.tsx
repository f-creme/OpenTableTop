import type { Dispatch, SetStateAction, FC } from "react"; 
import type { CampaignUsers } from "../types/campaign";

import { Trash } from "lucide-react";

type Props = {
    usersList: CampaignUsers[];
    setUsersList: Dispatch<SetStateAction<CampaignUsers[]>>;
    onLoad: () => void;
    onRemove: (idCampaignUser: number) => void;
    newParticipant: string;
    setNewParticipant: (name: string) => void;
    onAddParticipant: (userName: string) => void
}

const CampaignUsersForm: FC<Props> = ({
    usersList,
    onLoad,
    onRemove,
    newParticipant, 
    setNewParticipant,
    onAddParticipant
}) => {
    return (
        <div className="flex flex-col">
            <p className="text-4xl text-center font-semibold p-5 mb-5">Participants</p>
            <div className="flex flex-row justify-between items-center mb-5 p-4">
                <div className="text-xl font-medium">Liste des participants</div>
                <button className="btn btn-primary" onClick={onLoad}>Actualiser la liste</button>
            </div>
            <div className="bg-base-200 rounded-2xl px-4 divide-y divide-primary/30 w-full">
                <div className="flex p-3 gap-4 justify-between items-center font-semibold text-sm border-b">
                    <div className="flex gap-2">
                        <span className="w-40">Participant</span>
                        <span className="w-40">Personnage</span>
                        <span className="w-24">Rôle</span> 
                    </div>
                    <div className="w-10 mr-2">Retirer</div>
                </div>
                
                {usersList.length > 0 && (
                    usersList.map((user) => (
                        <div key={user.idCampaignUser} className="flex p-3 gap-4 justify-between items-center">
                            <div className="flex gap-2">
                                <span className="w-40">{user.publicName}</span>
                                <span className="w-40">{user.characterName}</span>
                                <span className="w-24">{user.userRole === 'gm' ? "Maître du jeu" : "Joueur"}</span>
                            </div>
                            <div>
                                <button 
                                        className="btn btn-primary btn-soft" 
                                        disabled={user.userRole === 'gm'}
                                        onClick={() => {
                                            if (confirm("Retirer ce participant ?")) {
                                                onRemove(user.idCampaignUser)
                                            }
                                        }}
                                >
                                    <Trash className="h-4 w-4"/>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="flex flex-col mt-5 mb-5 p-4">
                <div className="text-xl font-medium">Ajouter un participant</div>
                <p>Recherchez un utilisateur et ajoutez le comme participant à votre campagne</p>
                <div className="flex flex-row gap-4 mt-4 items-baseline-last">
                    <fieldset className="w-2/3">
                        <legend className="fieldset-legend">Nom du joueur</legend>
                        <input 
                            type="text" className="input w-full"
                            value={newParticipant}
                            onChange={(e) => setNewParticipant(e.target.value)}
                        ></input>
                    </fieldset>
                    <button 
                        className="btn btn-primary w-1/3" 
                        onClick={() => {
                            if(confirm("Ajouter ce participant ?")) {
                                onAddParticipant(newParticipant)
                            }
                        }}
                    >Ajouter aux participants</button>
                </div>
            </div>
        </div>
    )
}

export default CampaignUsersForm;