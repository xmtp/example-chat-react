import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Conversation } from '../../components/Conversation'
import useWalletProvider from '../../hooks/useWalletProvider'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const { resolveName } = useWalletProvider()
  const [recipientWalletAddr, setRecipientWalletAddr] = useState<string>('')

  useEffect(() => {
    const checkIfEns = async () => {
      const recipentAddress = Array.isArray(router.query.recipientWalletAddr)
        ? router.query.recipientWalletAddr.join('/')
        : router.query.recipientWalletAddr
      setRecipientWalletAddr(recipentAddress ?? '')
      if (recipentAddress?.includes('.eth')) {
        const address = await resolveName(recipentAddress)
        router.push(`/dm/${address}`)
      } else if (recipentAddress) {
        router.push(`/dm/${recipentAddress}`)
      } else if (
        !recipentAddress &&
        window.location.pathname &&
        window.location.pathname.includes('/dm')
      ) {
        router.push(window.location.pathname)
        setRecipientWalletAddr(window.location.pathname.replace('/dm/', ''))
      }
    }
    checkIfEns()
  }, [recipientWalletAddr, window.location.pathname])

  return <Conversation recipientWalletAddr={recipientWalletAddr ?? ''} />
}

export default React.memo(ConversationPage)
