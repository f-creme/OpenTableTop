// pages/AppLayout.tsx
import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import BackgroundDice from "../components/BackgroundDice"

export default function AppLayout() {
  return (
    <div>
      <BackgroundDice />
      <Navbar />
      <Outlet />
    </div>
  )
}