import {
  Conversation,
  DecodedMessage,
  SortDirection,
  Stream,
} from '@xmtp/xmtp-js'
import { useEffect } from 'react'
import { getConversationKey } from '../helpers'
import { useAppStore } from '../store/app'

export const useListConversations = () => {
  const walletAddress = useAppStore((state) => state.address)
  const client = useAppStore((state) => state.client)
  const conversations = useAppStore((state) => state.conversations)
  const setConversations = useAppStore((state) => state.setConversations)
  const previewMessages = useAppStore((state) => state.previewMessages)
  const setPreviewMessages = useAppStore((state) => state.setPreviewMessages)
  const setPreviewMessage = useAppStore((state) => state.setPreviewMessage)
  const setLoadingConversations = useAppStore(
    (state) => state.setLoadingConversations
  )

  const fetchMostRecentMessage = async (
    convo: Conversation
  ): Promise<{ key: string; message?: DecodedMessage }> => {
    const key = getConversationKey(convo)
    const newMessages = await convo.messages({
      limit: 1,
      direction: SortDirection.SORT_DIRECTION_DESCENDING,
    })
    if (newMessages.length <= 0) {
      return { key }
    }
    return { key, message: newMessages[0] }
  }

  useEffect(() => {
    if (!client) {
      return
    }

    let messageStream: AsyncGenerator<DecodedMessage>
    let conversationStream: Stream<Conversation>

    const streamAllMessages = async () => {
      messageStream = await client.conversations.streamAllMessages()

      for await (const message of messageStream) {
        const key = getConversationKey(message.conversation)
        setPreviewMessage(key, message)
      }
    }

    const listConversations = async () => {
      console.log('Listing conversations')
      setLoadingConversations(true)
      const newPreviewMessages = new Map(previewMessages)
      const convos = await client.conversations.list()

      const previews = await Promise.all(convos.map(fetchMostRecentMessage))

      for (const preview of previews) {
        if (preview.message) {
          newPreviewMessages.set(preview.key, preview.message)
        }
      }
      setPreviewMessages(newPreviewMessages)

      Promise.all(
        convos.map(async (convo) => {
          if (convo.peerAddress !== walletAddress) {
            conversations.set(getConversationKey(convo), convo)
            console.log(Array.from(conversations.keys()))
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
      conversationStream = await client.conversations.stream()
      for await (const convo of conversationStream) {
        if (convo.peerAddress !== walletAddress) {
          conversations.set(getConversationKey(convo), convo)
          setConversations(new Map(conversations))
        }
      }
    }

    const closeConversationStream = async () => {
      if (!conversationStream) {
        return
      }
      await conversationStream.return()
    }

    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined)
      }
    }

    listConversations()
    streamConversations()
    streamAllMessages()

    return () => {
      closeConversationStream()
      closeMessageStream()
    }
  }, [client, walletAddress])
}

export default useListConversations
