// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";

import AppLayout from "./pages/AppLayout"
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection"
import Table from "./pages/Table"
import CharacterSheet from "./pages/player/CharacterSheet"
import Inventory from "./pages/player/Inventory"
import Players from "./pages/gm/Players"
import ProtectedRoute from "./components/ProtectedRoute"
import TableDev from "./pages/TableDev"
import ManageCampaign from "./pages/gm/ManageCampaign";

function App() {
  return (
    <AuthProvider>
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
              <Route path="player/inventory" element={<Inventory />} />
              <Route path="mj/players" element={<Players />} />
              <Route path="mj/campaign" element={<ManageCampaign />} />

              {/* DEV SECTION */}
              <Route path="dev" element={<TableDev />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )
}

export default App