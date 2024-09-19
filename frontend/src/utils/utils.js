import { doc, getDoc } from "firebase/firestore"
import { db } from "../config/firebase"

export function getUsernameFromEmail(email) {
  if (email && typeof email === "string") {
    // Split the email by '@' and return the first part (username)
    return email.split("@")[0]
  }
  return null // Return null if the input is not a valid email
}
