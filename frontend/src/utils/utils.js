import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { StreamChat } from "stream-chat"

export function getUsernameFromEmail(email) {
  if (email && typeof email === "string") {
    // Split the email by '@' and return the first part (username)
    return email.split("@")[0]
  }
  return null // Return null if the input is not a valid email
}

export async function docExists(tableName, docId) {
  try {
    const docRef = doc(db, tableName, docId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists) {
      return docSnap.data()
    } else {
      return null
    }
  } catch (err) {
    console.error(err)
  }
}

export async function createDoc(tableName, docId, dataObj) {
  await setDoc(doc(db, tableName, docId), dataObj)
}

export async function postAPICall(path, jsonData) {
  const res = await fetch(import.meta.env.VITE_BASE_URL + path, {
    method: "POST",
    body: JSON.stringify(jsonData),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const json = await res.json()
  return json
}

export async function connectUserToStream(token, userData) {
  try {
    const client = new StreamChat(import.meta.env.VITE_STREAM_API_KEY)
    await client.connectUser(userData, token)
    return true
  } catch (err) {
    console.error(err)
  }
}
