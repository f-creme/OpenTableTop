// pages/mj/Players.tsx

import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function Players() {
    const { role } = useAuth()

    if ( role !== "mj" ) {
        return <Navigate to="/" />
    }
    
    return (
        <div>Joueurs</div>
    )
}