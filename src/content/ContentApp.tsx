import SignClient from '@walletconnect/sign-client'
import { useEffect, useState } from 'react'

const ContentApp: React.FC<{ sendResponse: () => void }> = ({
  sendResponse,
}) => {
  const [signClient, setSignClient] = useState<SignClient | undefined>(
    undefined
  )

  // 3. Initialize sign client
  async function onInitializeSignClient() {
    const client = await SignClient.init({ projectId: PROJECT_ID })
    console.log('sign cilent', client)

    setSignClient(client)
  }

  // 4. Initiate connection and pass pairing uri to the modal
  async function openModal() {
    console.log('opening modal', signClient)

    if (signClient) {
      const namespaces = {
        eip155: {
          methods: ['eth_sign'],
          chains: ['eip155:1'],
          events: ['accountsChanged'],
        },
      }
      const { uri, approval } = await signClient.connect({
        requiredNamespaces: namespaces,
      })
    }
  }

  useEffect(() => {
    ;(async () => {
      await onInitializeSignClient()
      await openModal()
    })()
  }, [])
  return <div>App App</div>
}

export default ContentApp
