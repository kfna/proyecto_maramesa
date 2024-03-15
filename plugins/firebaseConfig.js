import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// configuración de Firebase
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBJd-VO2-vbORWNVobcHQkZkpaOkOZ98mw',
  authDomain: 'login-maramesa.firebaseapp.com',
  projectId: 'login-maramesa',
  storageBucket: 'login-maramesa.appspot.com',
  messagingSenderId: '821608735262',
  appId: '1:821608735262:web:91f8594d36e05dc7bd440f',
  measurementId: 'G-HP276Y6JNR'
})

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.removeItem('user')
  }
})
export { auth, firebaseApp, db }
