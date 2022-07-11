import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Conversation } from '../../components/Conversation'
import useWallet from '../../hooks/useWallet'

const ConversationPage: NextPage = () => {
  const { resolveName } = useWallet()
  const [recipient, setRecipient] = useState<string>()
  const router = useRouter()
  const recipientWalletAddr = router.query.recipientWalletAddr as string

  useEffect(() => {
    const getAddress = async () => {
      if (recipientWalletAddr.endsWith('eth')) {
        const addr = await resolveName(recipientWalletAddr)
        setRecipient(addr)
      } else {
        setRecipient(recipientWalletAddr)
      }
    }
    getAddress()
  }, [recipientWalletAddr, resolveName])

  return <>{recipient && <Conversation recipientWalletAddr={recipient} />}</>
}

export default ConversationPage
