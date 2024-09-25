import { startGoogleLogin } from "./config/firebase"
import {
  createDoc,
  docExists,
  getUsernameFromEmail,
  postAPICall,
} from "./utils/utils"
import { useState } from "react"
import { ChatComponent } from "./chat/ChatComponent"

function App() {
  const [userData, setUserData] = useState(null)
  async function handleCLick() {
    let json = await handleGoogleLogin()
    setUserData(json)
  }
  return (
    <div>
      <button onClick={handleCLick}>Google Login</button>
      {userData && <ChatComponent clientData={userData} />}
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
      apiKey: import.meta.env.VITE_STREAM_API_KEY,
      tokenOrProvider: json.token,
      userData: { id: json.id, username: json.username },
    }
  } catch (err) {
    console.log(err)
  }
}

export default App
