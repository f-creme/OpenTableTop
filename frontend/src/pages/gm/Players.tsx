// pages/mj/Players.tsx

import { Navigate } from "react-router-dom"
import { useRole } from "../../context/RoleContext"

export default function Players() {
    const { role } = useRole()

    if ( role !== "mj" ) {
        return <Navigate to="/room" />
    }
    
    return (
        <div>Joueurs</div>
    )
}