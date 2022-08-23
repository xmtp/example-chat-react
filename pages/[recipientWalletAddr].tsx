import { useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Conversation } from '../components/Conversation'
import useXmtp from '../hooks/useXmtp'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const { walletAddress, client } = useXmtp()

  useEffect(() => {
    if (!walletAddress || !client) {
      router.push('/')
    }
  }, [walletAddress, client])

  return <Conversation />
}

export default ConversationPage
