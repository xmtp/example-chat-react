import { useCallback, useEffect, useState } from 'react'
import useWalletProvider from '../../../hooks/useWalletProvider'
import { useAppStore } from '../../../store/app'
import { Conversation } from '../../Conversation'

interface IConversationScreen {
  recipientWalletAddr: string
}

// This is the extension version of pages/dm/[recipientWalletAddr].tsx
const ConversationScreen: React.FC<IConversationScreen> = ({
  recipientWalletAddr,
}) => {
  const client = useAppStore((state) => state.client)
  const setExtensionAppViewState = useAppStore(
    (state) => state.setExtensionAppViewState
  )
  const appViewState = useAppStore((state) => state.extensionAppViewState)
  const setActiveRecipient = useAppStore((state) => state.setActiveRecipient)
  // const activeConversation = useAppStore((state) => state.activeConversation)
  const { resolveName } = useWalletProvider()
  const [canMessageAddr, setCanMessageAddr] = useState<boolean | undefined>(
    false
  )

  const redirectToHome = useCallback(async () => {
    if (appViewState === 'conversation') {
      let queryAddress = recipientWalletAddr
      if (queryAddress.includes('.eth')) {
        queryAddress = (await resolveName(queryAddress)) ?? ''
      }
      if (!queryAddress) {
        setCanMessageAddr(false)
        setExtensionAppViewState('home')
      } else {
        const canMessage = await client?.canMessage(queryAddress)

        if (!canMessage) {
          setCanMessageAddr(false)
          setExtensionAppViewState('home')
        } else {
          setCanMessageAddr(true)
          setExtensionAppViewState('conversation')
          setActiveRecipient(queryAddress)
          // router.push(`/dm/${queryAddress}`)
        }
      }
    }
  }, [
    appViewState,
    resolveName,
    client,
    setExtensionAppViewState,
    setActiveRecipient,
    recipientWalletAddr,
  ])

  useEffect(() => {
    redirectToHome()
  }, [recipientWalletAddr, redirectToHome])

  if (!canMessageAddr || !client) return <div />

  return <Conversation recipientWalletAddr={recipientWalletAddr} />
}

export default ConversationScreen
