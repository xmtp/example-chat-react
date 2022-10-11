import React from 'react'
import useChat from '../../hooks/useChat'
import ConversationsList from '../ConversationsList'
import Loader from '../Loader'
import NoWalletConnectedMessage from './NoWalletConnectedMessage'

const NavigationPanel = (): JSX.Element => {
  const { client, signer } = useChat()

  if (client === undefined)
    return (
      <Loader
        headingText="Initialization..."
        subHeadingText="Use your wallet to sign"
      />
    )

  if (!signer) return <NoWalletConnectedMessage />

  return <ConversationsList />
}

export default NavigationPanel
