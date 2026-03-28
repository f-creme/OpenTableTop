import { AuthProvider } from "./context/RoleContext"
import { LanguageProvider } from "./context/LanguageContext"

import ReactDOM from "react-dom/client"
import App from "./App"
import "./i18n"

import './index.css'
import { CampaignProvider } from "./context/CampaignContext"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
      <LanguageProvider>
          <CampaignProvider>
            <App />
          </CampaignProvider>
      </LanguageProvider>
  </AuthProvider>
)
