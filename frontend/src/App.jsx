import { startGoogleLogin } from "./config/firebase"
import {
  createDoc,
  docExists,
  getUsernameFromEmail,
  postAPICall,
  connectUserToStream,
  createDirectChannel,
} from "./utils/utils"
import { ChatComponent } from "./chat/ChatComponent"
import { useAuthContext } from "./hooks/useAuthContext"
import { AUTH_ACTION } from "./context/actions"
import { SearchBar } from "./components/SearchBar"
import { useState } from "react"
import { useStreamChatContext } from "./hooks/useStreamChatContext"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import { ChatPage } from "./pages/ChatPage"
import AuthRequired from "./components/AuthRequired"

function App() {
  const { streamChatClient } = useStreamChatContext()
  const { userId, username, token, dispatch } = useAuthContext()
  const [searchResult, setSearchResult] = useState(null)
  if (searchResult) {
    // Check if username is in the db
    let usernameExists = docExists(
      import.meta.env.VITE_USER_TABLE,
      searchResult
    ).then((res) => res)
    // If username is in the db, connect user to Stream and create/get chat channel
    usernameExists &&
      connectUserToStream(
        token,
        {
          id: username,
        },
        streamChatClient
      ).then(
        (res) =>
          res && createDirectChannel(username, searchResult, streamChatClient)
      )
    // Reset Search Bar
    setSearchResult(null)
  }
  async function handleLogin() {
    // Get json data from Google Login
    let json = await handleGoogleLogin()
    // Save json data into localStorage
    localStorage.setItem(
      import.meta.env.VITE_STREAM_LOCAL_STORAGE_KEY_AUTH,
      JSON.stringify({
        userId: json.userId,
        username: json.username,
        token: json.token,
      })
    )
    // Set user data to global state (auth)
    dispatch({
      type: AUTH_ACTION.LOGIN,
      payload: {
        username: json.username,
        token: json.token,
        userId: json.userId,
      },
    })
  }
  function handleLogout() {
    dispatch({ type: AUTH_ACTION.LOGOUT })
  }
  return (
    // <div>
    //   <button onClick={handleLogin}>Google Login</button>
    //   <button onClick={handleLogout}>Logout</button>
    //   {username && (
    //     <div style={{ marginBottom: 20 }}>
    //       <p>Current username: {username}</p>
    //       <SearchBar
    //         placeholder="Username..."
    //         setSearchResult={setSearchResult}
    //       />
    //     </div>
    //   )}
    //   {token && (
    //     <ChatComponent
    //       clientData={{
    //         apiKey: import.meta.env.VITE_STREAM_API_KEY,
    //         tokenOrProvider: token,
    //         userData: { id: userId },
    //       }}
    //     />
    //   )}
    // </div>
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

// async function handleGoogleLogin() {
//   try {
//     // Start google login
//     let { user } = await startGoogleLogin()
//     // Get data after google login
//     let { email, displayName, photoURL } = user
//     let username = getUsernameFromEmail(email)
//     // Check if username already exists in the firestore db
//     let usernameExists = await docExists(
//       import.meta.env.VITE_USER_TABLE,
//       username
//     )
//     // If username is already in the firestore db,
//     let json
//     if (usernameExists) {
//       json = await postAPICall("/api/auth/login", {
//         username,
//         firstTimeLogIn: false,
//       })
//     }
//     // else, add username to firestore and upsert it to Stream in backend
//     else {
//       await createDoc(import.meta.env.VITE_USER_TABLE, username, { username })
//       json = await postAPICall("/api/auth/login", {
//         username,
//         firstTimeLogIn: true,
//       })
//     }
//     return {
//       token: json.token,
//       userId: json.id,
//       username: json.username,
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

export default App
