export {}
// This get compiled into ./public/firebase-messaging-sw.js

/*
 * Note: This approach lifted from Metamask.
 * See: https://github.com/MetaMask/metamask-extension/blob/ff25d44d984362179f597ce839a2a97f37ded0d7/app/scripts/app-init.js#L125
 *
 * A keepalive message listener to prevent Service Worker getting shut down due to inactivity.
 * UI sends the message periodically, in a setInterval.
 * Chrome will revive the service worker if it was shut down, whenever a new message is sent, but only if a listener was defined here.
 *
 * chrome below needs to be replaced by cross-browser object,
 * but there is issue in importing webextension-polyfill into service worker.
 * chrome does seems to work in at-least all chromium based browsers
 */

import { initializeApp } from 'firebase/app'
import { onBackgroundMessage, getMessaging } from 'firebase/messaging/sw'

const firebaseConfig = {
  apiKey: 'AIzaSyAMzM0u8J60YOA-J8yvBw8nVg_w3qxwB-M',
  authDomain: 'example-notification-server.firebaseapp.com',
  projectId: 'example-notification-server',
  storageBucket: 'example-notification-server.appspot.com',
  messagingSenderId: '609788839593',
  appId: '1:609788839593:web:3492dabb17f5fc1a240bb8',
  measurementId: 'G-YRHBN861MQ',
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const firebaseMessaging = getMessaging(firebaseApp)

onBackgroundMessage(firebaseMessaging, async (payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )
  // Customize notification here
  const notificationTitle = 'Background Message Title 2'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/favicon.ico',
  }

  // await chrome.action.setBadgeText({ text: '1' })

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// chrome.runtime.onMessage.addListener(async (message, sender, callback) => {
//   console.log('[background] received message', message)
//   // await doRegistration()
//   console.log('[background] done registration')

//   callback('done')
// })
