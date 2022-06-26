import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Conversation } from '../../components/Conversation'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const recipientWalletAddr = router.query.recipientWalletAddr as string
  return <Conversation recipientWalletAddr={recipientWalletAddr} />
}

export default ConversationPage
