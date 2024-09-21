import { startGoogleLogin } from "./config/firebase"
import { createDoc, docExists, getUsernameFromEmail } from "./utils/utils"

function App() {
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
      // If username already exists,
      if (usernameExists) {
        console.log("Do stuff")
        // If username is not in the db, add username and upsert it to Stream in backend
      } else {
        await createDoc(import.meta.env.VITE_USER_TABLE, username, { username })
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              username,
              firstTimeLogIn: true,
            }),
          }
        )
        await res.json()
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <button onClick={handleGoogleLogin}>Google Login</button>
    </div>
  )
}

export default App
