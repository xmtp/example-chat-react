import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

const Home: NextPage = () => {
  const { query } = useRouter()
  const recipient = Array.isArray(query.recipient)
    ? query.recipient[0]
    : query.recipient

  return <Layout recipient={recipient} />
}

export default Home
