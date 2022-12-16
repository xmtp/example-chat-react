import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Conversation } from '../../components/Conversation'
import useEnsHooks from '../../hooks/useEnsHooks'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const { resolveName } = useEnsHooks()
  const [recipientWalletAddr, setRecipientWalletAddr] = useState<string>()

  useEffect(() => {
    const routeAddress =
      (Array.isArray(router.query.recipientWalletAddr)
        ? router.query.recipientWalletAddr.join('/')
        : router.query.recipientWalletAddr) ?? ''
    setRecipientWalletAddr(routeAddress)
  }, [router.query.recipientWalletAddr])

  useEffect(() => {
    if (!recipientWalletAddr && window.location.pathname.includes('/dm')) {
      router.push(window.location.pathname)
      setRecipientWalletAddr(window.location.pathname.replace('/dm/', ''))
    }
    const checkIfEns = async () => {
      if (recipientWalletAddr?.includes('.eth')) {
        const address = await resolveName(recipientWalletAddr)
        router.push(`/dm/${address}`)
      }
    }
    checkIfEns()
  }, [recipientWalletAddr, window.location.pathname])

  return <Conversation recipientWalletAddr={recipientWalletAddr ?? ''} />
}

export default React.memo(ConversationPage)
