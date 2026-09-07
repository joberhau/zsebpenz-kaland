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

export interface EnablePushResult {
  status: PushStatus
  errorMessage?: string
}

let foregroundListenerRegistered = false

/** Requests notification permission, registers the service worker, gets an FCM token and saves it. */
export async function enablePush(): Promise<EnablePushResult> {
  if (getPushStatus() === 'unsupported') return { status: 'unsupported' }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return { status: permission }

  try {
    const [{ getMessaging, getToken, onMessage }, registration] = await withTimeout(
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

    // Push messages don't show as a system notification while this tab is
    // focused (only the background service worker does that) — show one
    // manually so a foreground reminder isn't silently missed.
    if (!foregroundListenerRegistered) {
      foregroundListenerRegistered = true
      onMessage(messaging, (payload) => {
        const title = payload.notification?.title ?? 'Zsebpénz Kaland'
        const body = payload.notification?.body ?? ''
        try {
          new Notification(title, { body, icon: '/zsebpenz-kaland/icon-192.png' })
        } catch {
          // ignore if the Notification constructor isn't usable here
        }
      })
    }

    return { status: 'granted' }
  } catch (err) {
    console.error('Push enable failed:', err)
    if (err instanceof Error && err.message === 'timeout') return { status: 'timeout' }
    const errorMessage =
      err instanceof Error ? `${err.name}: ${err.message}` : typeof err === 'string' ? err : 'Ismeretlen hiba'
    return { status: 'error', errorMessage }
  }
}
