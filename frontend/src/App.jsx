import { startGoogleLogin } from "./config/firebase"
import { docExists, getUsernameFromEmail } from "./utils/utils"

function App() {
  async function handleGoogleLogin() {
    try {
      let { user } = await startGoogleLogin()
      let { email, displayName, photoURL } = user
      let username = getUsernameFromEmail(email)
      let usernameExists = await docExists(
        import.meta.env.VITE_USER_TABLE,
        username
      )
      if (usernameExists) {
        console.log("Do stuff")
      } else {
        console.log("Add username")
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
