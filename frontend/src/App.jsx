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
import { StreamChat } from "stream-chat"

const STREAM_CHAT_CLIENT = new StreamChat(import.meta.env.VITE_STREAM_API_KEY)

function App() {
  const { userId, username, token, dispatch } = useAuthContext()
  const [searchResult, setSearchResult] = useState(null)
  searchResult &&
    searchUsernameForChannel(searchResult, setSearchResult, username, token)
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
    <div>
      <button onClick={handleLogin}>Google Login</button>
      <button onClick={handleLogout}>Logout</button>
      {username && (
        <div style={{ marginBottom: 20 }}>
          <p>Current username: {username}</p>
          <SearchBar
            placeholder="Username..."
            setSearchResult={setSearchResult}
          />
        </div>
      )}
      {token && (
        <ChatComponent
          clientData={{
            apiKey: import.meta.env.VITE_STREAM_API_KEY,
            tokenOrProvider: token,
            userData: { id: userId },
          }}
        />
      )}
    </div>
  )
}

async function handleGoogleLogin() {
  try {
    // Start google login
    let { user } = await startGoogleLogin()
    // Get data after google login
    let { email, displayName, photoURL } = user
    let username = getUsernameFromEmail(email)
    // Check if username already exists in the firestore db
    let usernameExists = await docExists(
      import.meta.env.VITE_USER_TABLE,
      username
    )
    // If username is already in the firestore db,
    let json
    if (usernameExists) {
      json = await postAPICall("/api/auth/login", {
        username,
        firstTimeLogIn: false,
      })
    }
    // else, add username to firestore and upsert it to Stream in backend
    else {
      await createDoc(import.meta.env.VITE_USER_TABLE, username, { username })
      json = await postAPICall("/api/auth/login", {
        username,
        firstTimeLogIn: true,
      })
    }
    return {
      token: json.token,
      userId: json.id,
      username: json.username,
    }
  } catch (err) {
    console.log(err)
  }
}

async function searchUsernameForChannel(
  searchedUsername,
  setSearchResult,
  ownerUsername,
  ownerToken
) {
  // Check if username in the db
  let usernameExists = await docExists(
    import.meta.env.VITE_USER_TABLE,
    searchedUsername
  )
  console.log(usernameExists)
  // If true, create new channel
  if (usernameExists) {
    let connectCurrentUser = await connectUserToStream(
      ownerToken,
      {
        id: ownerUsername,
      },
      STREAM_CHAT_CLIENT
    )
    console.log(connectCurrentUser)
    let channel = await createDirectChannel(
      ownerUsername,
      searchedUsername,
      STREAM_CHAT_CLIENT
    )
    console.log(channel)
  }
  // Reset Search Bar
  setSearchResult(null)
}

export default App
