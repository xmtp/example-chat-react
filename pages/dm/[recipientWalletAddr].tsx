import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Conversation } from '../../components/Conversation'
import useXmtp from '../../hooks/useXmtp'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const { client } = useXmtp()
  const recipientWalletAddr = router.query.recipientWalletAddr as string
  const [canMessageAddr, setCanMessageAddr] = useState<boolean | undefined>(
    false
  )

  const redirectToHome = async () => {
    if (window.location.pathname) {
      const queryAddress = window.location.pathname.replace('/dm/', '')
      const canMessage = await client?.canMessage(queryAddress)
      if (!canMessage) {
        setCanMessageAddr(false)
        router.push('/')
      } else {
        setCanMessageAddr(true)
      }
    }
  }

  useEffect(() => {
    redirectToHome()
  }, [window.location.pathname])

  if (!canMessageAddr) return <div />
  else return <Conversation recipientWalletAddr={recipientWalletAddr} />
}

export default ConversationPage
