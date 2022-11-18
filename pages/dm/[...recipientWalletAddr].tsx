import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Conversation } from '../../components/Conversation'
import useWalletProvider from '../../hooks/useWalletProvider'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const { resolveName } = useWalletProvider()
  const recipientWalletAddr = Array.isArray(router.query.recipientWalletAddr)
    ? router.query.recipientWalletAddr.join('/')
    : router.query.recipientWalletAddr

  useEffect(() => {
    const checkIfEns = async () => {
      if (recipientWalletAddr?.includes('.eth')) {
        const address = await resolveName(recipientWalletAddr)
        router.push(`/dm/${address}`)
      }
    }
    checkIfEns()
  }, [recipientWalletAddr])

  return <Conversation recipientWalletAddr={recipientWalletAddr ?? ''} />
}

export default React.memo(ConversationPage)
