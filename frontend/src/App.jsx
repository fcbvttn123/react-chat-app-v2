import { startGoogleLogin } from "./config/firebase"
import { getUsernameFromEmail } from "./utils/utils"

function App() {
  async function handleGoogleLogin() {
    try {
      let { user } = await startGoogleLogin()
      let email = user.email
      let displayName = user.displayName
      let photoURL = user.photoURL
      let username = getUsernameFromEmail(email)
      console.log(user)
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
