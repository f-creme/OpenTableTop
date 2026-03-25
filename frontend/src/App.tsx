// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navigate } from "react-router-dom"

import Login from "./pages/Login"
import AppLayout from "./pages/AppLayout"

import Table from "./pages/Table"

import CharacterSheet from "./pages/player/CharacterSheet"
import Inventory from "./pages/player/Inventory"

import Players from "./pages/gm/Players"

import ProtectedRoute from "./components/ProtectedRoute"

import TableDev from "./pages/TableDev"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/room" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* default root */}
            <Route index element={<Navigate to="table"/>}/>

            {/* Pages */}
            <Route path="table" element={<Table />} />

            <Route path="player/character-sheet" element={<CharacterSheet />} />
            <Route path="player/inventory" element={<Inventory />} />
            <Route path="mj/players" element={<Players />} />

            {/* DEV SECTION*/}
            <Route path="dev" element={<TableDev />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App