import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { collection, getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDWIlwqq7Pt8_UWTa1zZ7vQE6_MGYshMcA",
  authDomain: "react-projects-fe292.firebaseapp.com",
  projectId: "react-projects-fe292",
  storageBucket: "react-projects-fe292.appspot.com",
  messagingSenderId: "1000517600283",
  appId: "1:1000517600283:web:48b03824333700b66a64be",
}

const app = initializeApp(firebaseConfig)

// Google Authentication
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export function startGoogleLogin() {
  let userData = signInWithPopup(auth, provider)
    .then((res) => res)
    .catch((err) => console.error(err))
  return userData
}

// FireStore
const firestoreDB = getFirestore(app)
export function getFirestoreTable(tableName) {
  return collection(firestoreDB, tableName)
}
