import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Conversation } from '../components/Conversation'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const recipientWalletAddr = router.query.recipientWalletAddr as string
  const [walletAddr, setWalletAddr] = useState<string | undefined>()

  useEffect(() => {
    setWalletAddr(recipientWalletAddr)
  }, [recipientWalletAddr])

  if (!walletAddr) return <div />

  return <Conversation recipientWalletAddr={walletAddr} />
}

export default ConversationPage
