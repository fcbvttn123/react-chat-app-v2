import { startGoogleLogin } from "./config/firebase"
import { StreamChat } from "stream-chat"
import {
  createDoc,
  docExists,
  getUsernameFromEmail,
  postAPICall,
} from "./utils/utils"

function App() {
  return (
    <div>
      <button onClick={handleGoogleLogin}>Google Login</button>
    </div>
  )
}

async function connectUserToStream(token, userData) {
  try {
    const client = new StreamChat(import.meta.env.VITE_STREAM_API_KEY)
    await client.connectUser(userData, token)
    console.log("User connected to Stream")
    return true
  } catch (err) {
    console.error(err)
  }
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
    if (usernameExists) {
      let json = await postAPICall("/api/auth/login", {
        username,
        firstTimeLogIn: false,
      })
    }
    // else, add username to firestore and upsert it to Stream in backend
    else {
      await createDoc(import.meta.env.VITE_USER_TABLE, username, { username })
      let json = await postAPICall("/api/auth/login", {
        username,
        firstTimeLogIn: true,
      })
    }
    // Connect user to Stream
    await connectUserToStream(json.token, {
      id: json.id,
      username: json.username,
    })
  } catch (err) {
    console.log(err)
  }
}

export default App
