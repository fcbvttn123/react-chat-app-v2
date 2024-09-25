import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw Error(
      "useWorkoutsContext must be used inside an WorkoutsContextProvider"
    )
  }
  return context
}
