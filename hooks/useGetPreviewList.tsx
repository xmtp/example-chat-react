import { Conversation, SortDirection } from '@xmtp/xmtp-js'
import { useEffect, useState } from 'react'
import { getConversationKey } from '../helpers'
import { useAppStore } from '../store/app'

const useGetPreviewList = (currentIndex: number) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const conversations = useAppStore((state) => state.conversations)
  const previewMessages = useAppStore((state) => state.previewMessages)
  const setPreviewMessages = useAppStore((state) => state.setPreviewMessages)

  useEffect(() => {
    const updatePreviewList = async () => {
      setLoading(true)
      const newPreviewMessages = new Map(previewMessages)

      const convos = Array.from(conversations.values()).slice(
        currentIndex,
        currentIndex + 20
      )

      await Promise.all(
        convos.map(async (convo: Conversation) => {
          const key = getConversationKey(convo)
          const newMessages = await convo.messages({
            limit: 1,
            direction: SortDirection.SORT_DIRECTION_DESCENDING,
          })
          if (newMessages.length <= 0) {
            return { key }
          }
          newPreviewMessages.set(key, newMessages[0])
        })
      )
      setLoading(false)
      setPreviewMessages(newPreviewMessages)
      if (previewMessages.size >= conversations.size) {
        setHasMore(false)
      }
    }
    updatePreviewList()
  }, [currentIndex])

  return {
    loading,
    hasMore,
  }
}

export default useGetPreviewList
