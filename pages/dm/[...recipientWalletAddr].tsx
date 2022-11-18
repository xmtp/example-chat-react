import React from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Conversation } from '../../components/Conversation'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const recipientWalletAddr = Array.isArray(router.query.recipientWalletAddr)
    ? router.query.recipientWalletAddr.join('/')
    : router.query.recipientWalletAddr

  return <Conversation recipientWalletAddr={recipientWalletAddr ?? ''} />
}

export default React.memo(ConversationPage)
