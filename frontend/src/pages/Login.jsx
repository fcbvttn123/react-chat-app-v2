import { AUTH_ACTION } from "../context/actions"
import { startGoogleLogin } from "../config/firebase"
import {
  createDoc,
  docExists,
  getUsernameFromEmail,
  postAPICall,
} from "../utils/utils"

export function Login() {
  return (
    <div>
      <button onClick={handleLogin}>Google Login</button>
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
