import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Chat } from '@nft/chat'

const Home: NextPage = () => {
  const { query } = useRouter()
  const recipient = Array.isArray(query.recipient)
    ? query.recipient[0]
    : query.recipient

  return <Chat recipient={recipient} />
}

export default Home
