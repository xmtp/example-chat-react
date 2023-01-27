import { Conversation, ContentTypeId } from '@xmtp/xmtp-js'
import { useCallback } from 'react'

const useSendMessage = (selectedConversation?: Conversation) => {
  const sendMessage = useCallback(
    async (message: object) => {
      const ContentTypeVoiceKey = new ContentTypeId({
        authorityId: 'xmtp.test',
        typeId: 'voice-key',
        versionMajor: 1,
        versionMinor: 0,
      })

      const messageText = message.content
      const isVoiceMemo = message.contentType === 'voiceMemo'

      if (isVoiceMemo) {
        await selectedConversation?.send(messageText, {
          contentType: ContentTypeVoiceKey,
          contentFallback: 'This is a voice memo',
        })
      } else {
        await selectedConversation?.send(messageText)
      }
    },
    [selectedConversation]
  )

  return {
    sendMessage,
  }
}

export default useSendMessage
