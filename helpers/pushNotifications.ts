import {
  createConnectTransport,
  createPromiseClient,
} from '@bufbuild/connect-web'
import { Notifications } from '../gen/service_connectweb'
import { getFirebaseToken, getInstallationId } from './firebase'

const transport = createConnectTransport({
  baseUrl: process.env.API_URL || 'https://notifications.dev.xmtp.network',
})

// Here we make the client itself, combining the service
// definition with the transport.
export const pushClient = createPromiseClient(Notifications, transport)

export const doRegistration = async () => {
  // const deviceToken = await messaging().getToken()
  const deviceToken = await getFirebaseToken()
  if (!deviceToken) {
    throw new Error("Couldn't get device token")
  }
  const installationId = await getInstallationId()
  await pushClient.registerInstallation(
    {
      installationId,
      deliveryMechanism: {
        deliveryMechanismType: {
          value: deviceToken,
          case: 'firebaseDeviceToken',
        },
      },
    },
    {}
  )
}
