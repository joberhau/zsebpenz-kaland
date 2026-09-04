import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA6zuhaUylueJUj2GU9J9GTdL41XhD6iro',
  authDomain: 'zsebpenz-kaland.firebaseapp.com',
  projectId: 'zsebpenz-kaland',
  storageBucket: 'zsebpenz-kaland.firebasestorage.app',
  messagingSenderId: '1098320510269',
  appId: '1:1098320510269:web:ce911c9cfa8b6f9adcd954',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
