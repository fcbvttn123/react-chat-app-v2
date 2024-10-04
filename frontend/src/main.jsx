import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { AuthContextProvider } from "./context/AuthContext.jsx"
import { StreamChatContextProvider } from "./context/StreamChatContext.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StreamChatContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </StreamChatContextProvider>
  </StrictMode>
)
