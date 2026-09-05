import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { app, db } from './firebase'

const VAPID_KEY =
  'BN30x5VXN7KoQgDtPygDmLvU_UVS6eLVw03KVZJEu-ElizSkbQsfOwEEXhfnes2wGWrbfCuxAnkPDIOxf-GRZWc'

export type PushStatus = 'unsupported' | 'default' | 'granted' | 'denied'

export function getPushStatus(): PushStatus {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return 'unsupported'
  }
  return Notification.permission
}

/** Requests notification permission, registers the service worker, gets an FCM token and saves it. */
export async function enablePush(): Promise<PushStatus> {
  if (getPushStatus() === 'unsupported') return 'unsupported'

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return permission

  try {
    const [{ getMessaging, getToken }, registration] = await Promise.all([
      import('firebase/messaging'),
      navigator.serviceWorker.register('/zsebpenz-kaland/firebase-messaging-sw.js'),
    ])
    const messaging = getMessaging(app)
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration })
    if (token) {
      await setDoc(doc(db, 'pushTokens', token), { token, createdAt: serverTimestamp() })
    }
  } catch (err) {
    console.error('Push enable failed:', err)
  }
  return 'granted'
}
