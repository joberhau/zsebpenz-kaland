importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyA6zuhaUylueJUj2GU9J9GTdL41XhD6iro',
  authDomain: 'zsebpenz-kaland.firebaseapp.com',
  projectId: 'zsebpenz-kaland',
  storageBucket: 'zsebpenz-kaland.firebasestorage.app',
  messagingSenderId: '1098320510269',
  appId: '1:1098320510269:web:ce911c9cfa8b6f9adcd954',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'Zsebpénz Kaland'
  const body = payload.notification?.body ?? ''
  self.registration.showNotification(title, {
    body,
    icon: '/zsebpenz-kaland/icon-192.png',
    badge: '/zsebpenz-kaland/icon-192.png',
  })
})
