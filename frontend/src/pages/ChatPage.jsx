import { useState } from "react"
import { ChatComponent } from "../chat/ChatComponent"
import { SearchBar } from "../components/SearchBar"
import { useAuthContext } from "../hooks/useAuthContext"
import { AUTH_ACTION } from "../context/actions"
import { useNavigate } from "react-router-dom"
import {
  connectUserToStream,
  createDirectChannel,
  docExists,
} from "../utils/utils"
import { useStreamChatContext } from "../hooks/useStreamChatContext"

export function ChatPage() {
  const [searchResult, setSearchResult] = useState(null)
  const navigate = useNavigate()
  const { userId, username, token, dispatch } = useAuthContext()
  const { streamChatClient } = useStreamChatContext()
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
  function handleLogout() {
    dispatch({ type: AUTH_ACTION.LOGOUT })
    navigate("/login")
  }
  return (
    <div>
      {username && (
        <div style={{ marginBottom: 20 }}>
          <p>Current username: {username}</p>
          <button onClick={handleLogout}>Logout</button>
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
