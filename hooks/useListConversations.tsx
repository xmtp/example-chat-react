import { useEffect } from 'react'
import { useAppStore } from '../store/app'

export const useListConversations = () => {
  const walletAddress = useAppStore((state) => state.address)
  const client = useAppStore((state) => state.client)
  const convoMessages = useAppStore((state) => state.convoMessages)
  const setConvoMessages = useAppStore((state) => state.setConvoMessages)
  const conversations = useAppStore((state) => state.conversations)
  const setConversations = useAppStore((state) => state.setConversations)
  const setLoadingConversations = useAppStore(
    (state) => state.setLoadingConversations
  )

  useEffect(() => {
    if (!client) return

    const listConversations = async () => {
      console.log('Listing conversations')
      setLoadingConversations(true)
      const convos = await client.conversations.list()
      Promise.all(
        convos.map(async (convo) => {
          if (convo.peerAddress !== walletAddress) {
            const messages = await convo.messages()
            convoMessages.set(convo.peerAddress, messages)
            setConvoMessages(new Map(convoMessages))
            conversations.set(convo.peerAddress, convo)
            setConversations(new Map(conversations))
          }
        })
      ).then(() => {
        setLoadingConversations(false)
        if (Notification.permission === 'default') {
          Notification.requestPermission()
        }
      })
    }
    const streamConversations = async () => {
      const stream = await client.conversations.stream()
      for await (const convo of stream) {
        if (convo.peerAddress !== walletAddress) {
          const messages = await convo.messages()
          convoMessages.set(convo.peerAddress, messages)
          setConvoMessages(new Map(convoMessages))
          conversations.set(convo.peerAddress, convo)
          setConversations(new Map(conversations))
        }
      }
    }
    listConversations()
    streamConversations()
  }, [client, walletAddress])
}

export default useListConversations
