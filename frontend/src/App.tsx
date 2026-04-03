// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";

import AppLayout from "./pages/AppLayout"
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection"
import Table from "./pages/Table"
import CharacterSheet from "./pages/player/CharacterSheet"
import ProtectedRoute from "./components/ProtectedRoute"
import ManageCampaign from "./pages/gm/ManageCampaign";
import { WebSocketProvider } from "./context/WebSocketContext";
import { useCampaign } from "./context/CampaignContext";

function App() {
  const { campaignId } = useCampaign()
  const apiURL = import.meta.env.VITE_API_URL;

  return (
    <AuthProvider>
      <WebSocketProvider campaignId={campaignId} apiURL={apiURL}>
        <BrowserRouter>
          <Routes>
            {/* Public login page */}
            <Route path="/" element={<Login />} />
            {/* Protected routes */}
            <Route path="/room" element={<ProtectedRoute />}>
              <Route path="role-selection" element={<RoleSelection />} />
              <Route index element={<Navigate to="role-selection" />} />
              <Route element={<AppLayout />}>
                {/* Main pages */}
                <Route path="table" element={<Table />} />
                <Route path="player/character-sheet" element={<CharacterSheet />} />
                <Route path="mj/campaign" element={<ManageCampaign />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </AuthProvider>

  )
}

export default App