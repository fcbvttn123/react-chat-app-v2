import { createContext, useEffect, useReducer } from "react"
import { STREAM_CHAT_ACTION } from "./actions"
import { StreamChat } from "stream-chat"

export const StreamChatContext = createContext()

function streamChatReducer(state, action) {
  switch (action.type) {
    case STREAM_CHAT_ACTION.SET_UP_CLIENT:
      return {
        streamChatClient: new StreamChat(import.meta.env.VITE_STREAM_API_KEY),
      }
  }
}

export function StreamChatContextProvider({ children }) {
  const [state, dispatch] = useReducer(streamChatReducer, {
    streamChatClient: null,
  })
  useEffect(() => {
    dispatch({ type: STREAM_CHAT_ACTION.SET_UP_CLIENT })
  }, [])
  return (
    <StreamChatContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StreamChatContext.Provider>
  )
}
