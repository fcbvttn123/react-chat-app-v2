import { startGoogleLogin } from "./config/firebase"
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
      console.log(json)
    }
    // else, add username to firestore and upsert it to Stream in backend
    else {
      await createDoc(import.meta.env.VITE_USER_TABLE, username, { username })
      let json = await postAPICall("/api/auth/login", {
        username,
        firstTimeLogIn: true,
      })
      console.log(json)
    }
  } catch (err) {
    console.log(err)
  }
}

export default App
