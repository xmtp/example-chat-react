import React, { useContext } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Conversation } from '../../components/Conversation'
import { checkPath } from '../../helpers'
import XmtpContext from '../../contexts/xmtp'
import useWallet from '../../hooks/useWallet'

const ConversationPage: NextPage = () => {
  const router = useRouter()
  const { client } = useContext(XmtpContext)
  const recipientWalletAddr = router.query.recipientWalletAddr as string
  const [canMessageAddr, setCanMessageAddr] = useState<boolean | undefined>(
    false
  )
  const signer = useWallet()

  const redirectToHome = async () => {
    if (checkPath()) {
      const queryAddress = window.location.pathname.replace('/dm/', '')
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

  if (!canMessageAddr || !client || !signer) return <div />
  else {
    return <Conversation recipientWalletAddr={recipientWalletAddr} />
  }
}

export default React.memo(ConversationPage)
