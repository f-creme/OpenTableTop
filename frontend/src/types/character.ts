export interface Character {
    id: number;
    name: string;
    classOrRole: string;
    appearance: string;
    personality: string;
    bio: string;
}

export interface Player {
    characterId: number;
    characterName: string;
    characterRole: string;
    characterPortrait: string | null;
    userPublicName: string;
}