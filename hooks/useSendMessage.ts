import { Conversation } from '@xmtp/xmtp-js'

const useSendMessage = (selectedConversation?: Conversation) => {
  const sendMessage = async (message: string) => {
    await selectedConversation?.send(message)
  }

  return {
    sendMessage,
  }
}

export default useSendMessage
