// import { firebaseMessaging } from '../helpers/firebase'
import { Notifications } from '../gen/service_connectweb'
import {
  createConnectTransport,
  createPromiseClient,
} from '@bufbuild/connect-web'
import { getInstallationId, getFirebaseToken } from '../helpers/firebase'
import { useCallback } from 'react'
import { useAppStore } from '../store/app'
import { Client } from '@xmtp/xmtp-js'
import {
  buildUserIntroTopic,
  buildUserInviteTopic,
} from '@xmtp/xmtp-js/dist/cjs/src/utils'
import { doRegistration, pushClient } from '../helpers/pushNotifications'

// const transport = createConnectTransport({
//   baseUrl: process.env.API_URL || 'https://notifications.dev.xmtp.network',
// })

// // Here we make the client itself, combining the service
// // definition with the transport.
// const pushClient = createPromiseClient(Notifications, transport)

const updateSubscriptions = async (xmtp: Client) => {
  const conversations = await xmtp.conversations.list()
  const installationId = await getInstallationId()
  const convoTopics = conversations.map((convo) => convo.topic)
  const topics = [
    ...convoTopics,
    buildUserIntroTopic(xmtp.address), // Used to receive V1 introductions
    buildUserInviteTopic(xmtp.address), // Used to receive V2 invites
  ]

  console.log('subscribing to topics', topics)

  await pushClient.subscribe(
    {
      installationId,
      topics,
    },
    {}
  )
}

const useNotificationSubscription = () => {
  const xmtpClient = useAppStore((state) => state.client)
  // Should be called on app boot

  const register = useCallback(async () => {
    if (!xmtpClient) {
      return
    }

    doRegistration()

    updateSubscriptions(xmtpClient)
  }, [xmtpClient])

  const revoke = async () => {
    await pushClient.deleteInstallation({
      installationId: await getInstallationId(),
    })
  }

  return {
    register,
    revoke,
  }
}

export default useNotificationSubscription
