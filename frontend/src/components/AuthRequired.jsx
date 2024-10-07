import { Outlet, Navigate } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"
import { connectUserToStream } from "../utils/utils"
import { useStreamChatContext } from "../hooks/useStreamChatContext"
import { useEffect, useState } from "react"

export default function AuthRequired() {
  const { streamChatClient } = useStreamChatContext()
  const { token, username } = useAuthContext()
  const [authenticated, setAuthenticated] = useState(false)
  useEffect(() => {
    // Why is it printed null?
    console.log(token)
    token &&
      connectUserToStream(
        token,
        {
          id: username,
        },
        streamChatClient
      ).then((res) => {
        res && setAuthenticated(true)
      })
  }, [token])
  if (!authenticated) {
    return <Navigate to="/login" />
  }
  return <Outlet />
}
