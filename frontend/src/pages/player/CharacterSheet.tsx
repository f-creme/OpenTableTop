// pages/player/CharacterSheet.tsx

import { Navigate } from "react-router-dom"
import { useRole } from "../../context/RoleContext"

import { useEffect, useState } from "react";

import { TrafficCone } from "lucide-react";

export default function CharacterSheet() {
    const { role } = useRole()

    if ( role !== "player" ) {
        return <Navigate to="/" />
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-150 bg-base-200">
            <TrafficCone className="h-50 w-50 text-error m-10"/>
            CharacterSheets.tsx
        </div>
    );
}