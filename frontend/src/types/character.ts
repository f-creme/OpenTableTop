export interface Character {
    uuid: string;
    name: string;
    classOrRole: string;
    appearance: string;
    personality: string;
    bio: string;
}

export interface Player {
    characterUuid: string;
    characterName: string;
    characterRole: string;
    characterPortrait: boolean;
    userPublicName: string;
    color: string
}