import { createContext, useReducer } from "react"

export const AuthContext = createContext()

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        username: action.payload.username,
        token: action.payload.token,
      }
    case "LOGOUT":
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
