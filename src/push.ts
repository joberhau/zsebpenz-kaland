import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { app, db } from './firebase'

const VAPID_KEY =
  'BN30x5VXN7KoQgDtPygDmLvU_UVS6eLVw03KVZJEu-ElizSkbQsfOwEEXhfnes2wGWrbfCuxAnkPDIOxf-GRZWc'

export type PushStatus = 'unsupported' | 'default' | 'granted' | 'denied' | 'timeout' | 'error'

export function getPushStatus(): PushStatus {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return 'unsupported'
  }
  return Notification.permission
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (err) => {
        clearTimeout(timer)
        reject(err)
      },
    )
  })
}

/** Requests notification permission, registers the service worker, gets an FCM token and saves it. */
export async function enablePush(): Promise<PushStatus> {
  if (getPushStatus() === 'unsupported') return 'unsupported'

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return permission

  try {
    const [{ getMessaging, getToken }, registration] = await withTimeout(
      Promise.all([import('firebase/messaging'), navigator.serviceWorker.register('/zsebpenz-kaland/firebase-messaging-sw.js')]),
      10000,
    )
    const messaging = getMessaging(app)
    const token = await withTimeout(
      getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration }),
      15000,
    )
    if (token) {
      await withTimeout(setDoc(doc(db, 'pushTokens', token), { token, createdAt: serverTimestamp() }), 10000)
    }
    return 'granted'
  } catch (err) {
    console.error('Push enable failed:', err)
    if (err instanceof Error && err.message === 'timeout') return 'timeout'
    return 'error'
  }
}
