import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Conversation } from '../../components/Conversation'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const peerAddressOrName = router.query.peerAddressOrName as string
  return <Conversation peerAddressOrName={peerAddressOrName} />
}

export default ConversationPage
