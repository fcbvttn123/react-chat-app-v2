import { createContext, useReducer } from "react"
import { AUTH_ACTION } from "./actions"

export const AuthContext = createContext()

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTION.LOGIN:
      return {
        username: action.payload.username,
        token: action.payload.token,
      }
    case AUTH_ACTION.LOGOUT:
      return {
        username: null,
        token: null,
      }
  }
}

export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    username: null,
    token: null,
  })
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
