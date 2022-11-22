import { Conversation } from '@xmtp/xmtp-js'
import { useAppStore } from '../store/app'

const useSendMessage = (selectedConversation?: Conversation) => {
  const client = useAppStore((state) => state.client)
  const peerAddress = selectedConversation?.peerAddress
  const conversationId = selectedConversation?.context?.conversationId

  const sendMessage = async (message: string) => {
    if (!client || !peerAddress) {
      return
    }
    if (conversationId) {
      await selectedConversation?.send(message)
    } else {
      const conversation = await client.conversations.newConversation(
        peerAddress
      )
      if (!conversation) {
        return
      }
      await conversation.send(message)
    }
  }

  return {
    sendMessage,
  }
}

export default useSendMessage
