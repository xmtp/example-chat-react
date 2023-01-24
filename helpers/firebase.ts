// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { getInstallations, getId } from 'firebase/installations'
import { getValue, setValue } from './extension/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export function getInstallationId() {
  return getId(getInstallations(firebaseApp))
}

export const getFirebaseToken = async () => {
  // If we already have a firebase token saved, fetch it from local storage and return
  const { firebaseToken } = await getValue('firebaseToken')
  console.log('existing push token', firebaseToken)
  // if (firebaseToken) {
  //   return firebaseToken
  // }

  // TODO: Clean up firebase vapid key
  // Get a token from firebase
  try {
    const token = await getToken(firebaseMessaging, {
      vapidKey:
        'BH7mROLLzR7anHj7NpJWIGJmhbkw0acllSyR0YOHb_RkCSE31zYle9AiY8hM0JEIuI5ug1gS5d8wczg6G2dAvo8',
    })

    // save the token in local storage
    await setValue('firebaseToken', token)

    return token
  } catch (e) {
    console.log('error getting token', e)
  }
}

export const receiveMessage = onMessage(firebaseMessaging, (payload) => {
  console.log('Message received. ', payload)
})
