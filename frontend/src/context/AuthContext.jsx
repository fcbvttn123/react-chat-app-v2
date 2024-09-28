import { createContext, useEffect, useReducer } from "react"
import { AUTH_ACTION } from "./actions"
import { connectUserToStream } from "../utils/utils"

export const AuthContext = createContext()

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTION.LOGIN:
      return {
        username: action.payload.username,
        token: action.payload.token,
        userId: action.payload.userId,
      }
    case AUTH_ACTION.LOGOUT:
      return {
        username: null,
        token: null,
        userId: null,
      }
  }
}

export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    username: null,
    token: null,
  })
  useEffect(() => {
    // async function verifyToken(token, userData) {
    //   let validToken = await connectUserToStream(token, userData)
    //   return validToken
    // }
    // let userData = JSON.parse(
    //   localStorage.getItem(import.meta.env.VITE_STREAM_LOCAL_STORAGE_KEY_AUTH)
    // )
    // if (userData) {
    //   verifyToken(userData.token, {userId: userData.userId, username: userData.username})
    // }
    async function test() {
      let userData = JSON.parse(
        localStorage.getItem(import.meta.env.VITE_STREAM_LOCAL_STORAGE_KEY_AUTH)
      )
      if (userData) {
        let tokenIsValid = await connectUserToStream(userData.token, {
          id: userData.userId,
          username: userData.username,
        })
        tokenIsValid && dispatch({ type: AUTH_ACTION.LOGIN, payload: userData })
      }
    }
    test()
  }, [])
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
