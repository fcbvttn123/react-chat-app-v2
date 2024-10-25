import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import { ChatPage } from "./pages/ChatPage"
import AuthRequired from "./components/AuthRequired"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthRequired />}>
          <Route path="/" element={<ChatPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
