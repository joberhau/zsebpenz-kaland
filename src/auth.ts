import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from './firebase'

export function subscribeAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

export async function signUp(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(auth, email, password)
}

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function logOut(): Promise<void> {
  await signOut(auth)
}

export function friendlyAuthError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Ez az e-mail cím már regisztrálva van — inkább jelentkezz be vele.'
    case 'auth/invalid-email':
      return 'Érvénytelen e-mail cím.'
    case 'auth/weak-password':
      return 'Legalább 6 karakter legyen a jelszó.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Hibás e-mail cím vagy jelszó.'
    case 'auth/too-many-requests':
      return 'Túl sok próbálkozás, várj egy kicsit és próbáld újra.'
    default:
      return 'Hiba történt, próbáld újra.'
  }
}
