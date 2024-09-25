import { startGoogleLogin } from "./config/firebase"
import { StreamChat } from "stream-chat"
import {
  createDoc,
  docExists,
  getUsernameFromEmail,
  postAPICall,
} from "./utils/utils"
import { useState } from "react"
import { ChatComponent } from "./chat/ChatComponent"

function App() {
  const [data, setData] = useState(null)
  async function handleCLick() {
    let json = await handleGoogleLogin()
    setData(json)
  }
  return (
    <div>
      <button onClick={handleCLick}>Google Login</button>
      {data && <ChatComponent clientData={data} />}
    </div>
  )
}

const chatClient = new StreamChat(import.meta.env.VITE_STREAM_API_KEY)

async function connectUserToStream(token, userData) {
  try {
    await chatClient.connectUser(userData, token)
    console.log("User connected to Stream")
    return true
  } catch (err) {
    console.error(err)
  }
}

async function queryChannels(username) {
  const filter = { type: "messaging", members: { $in: [username] } }
  const sort = [{ last_message_at: -1 }]
  const channels = await chatClient.queryChannels(filter, sort, {
    watch: true,
    state: true,
  })
  return channels
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
    // Connect user to Stream
    let userConnectedToStream = await connectUserToStream(json.token, {
      id: json.id,
      username: json.username,
    })
    // Query channels of the user
    let channels = userConnectedToStream && (await queryChannels(json.username))
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
