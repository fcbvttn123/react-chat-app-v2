import { useContext } from "react"
import { StreamChatContext } from "../context/StreamChatContext"

export function useStreamChatContext() {
  const context = useContext(StreamChatContext)
  if (!context) {
    throw Error(
      "useWorkoutsContext must be used inside an WorkoutsContextProvider"
    )
  }
  return context
}
