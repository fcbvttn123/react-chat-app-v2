import { Outlet, Navigate } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"
import { connectUserToStream } from "../utils/utils"
import { useStreamChatContext } from "../hooks/useStreamChatContext"
import { useEffect, useState } from "react"

export default function AuthRequired() {
  const { streamChatClient } = useStreamChatContext()
  const { token, username } = useAuthContext()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  setTimeout(() => {
    setLoading(false)
  }, 3000)
  useEffect(() => {
    if (token) {
      connectUserToStream(
        token,
        {
          id: username,
        },
        streamChatClient
      ).then((res) => {
        res && setAuthenticated(true)
        setLoading(false)
      })
    }
  }, [token])
  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }
  if (!authenticated) {
    return <Navigate to="/login" />
  }
  return <Outlet />
}
