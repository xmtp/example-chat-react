import React from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Conversation } from '../../components/Conversation'
import { checkPath } from '../../helpers'
import { useAppStore } from '../../store/app'
import useWalletProvider from '../../hooks/useWalletProvider'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const client = useAppStore((state) => state.client)
  const { resolveName } = useWalletProvider()
  const recipientWalletAddr = router.query.recipientWalletAddr as string
  const [canMessageAddr, setCanMessageAddr] = useState<boolean | undefined>(
    false
  )

  const redirectToHome = async () => {
    if (checkPath()) {
      let queryAddress = window.location.pathname.replace('/dm/', '')
      if (queryAddress.includes('.eth')) {
        queryAddress = (await resolveName(queryAddress)) ?? ''
      }
      if (!queryAddress) {
        setCanMessageAddr(false)
        router.push('/')
      } else {
        const canMessage = await client?.canMessage(queryAddress)
        if (!canMessage) {
          setCanMessageAddr(false)
          router.push('/')
        } else {
          setCanMessageAddr(true)
          router.push(`/dm/${queryAddress}`)
        }
      }
    }
  }

  useEffect(() => {
    redirectToHome()
  }, [window.location.pathname])

  if (!canMessageAddr || !client) return <div />
  else {
    return <Conversation recipientWalletAddr={recipientWalletAddr} />
  }
}

export default React.memo(ConversationPage)
