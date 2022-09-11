import React from 'react'
import { LinkIcon } from '@heroicons/react/outline'
import { useContext } from 'react'
import XmtpContext from '../contexts/xmtp'
import ConversationsList from './ConversationsList'
import Loader from './Loader'

const NavigationPanel = (): JSX.Element => {
  const { client, signer } = useContext(XmtpContext)

  return (
    <div className="flex-grow flex flex-col h-[82vh] overflow-y-auto">
      {signer && client !== null ? (
        <ConversationsPanel />
      ) : (
        <NoWalletConnectedMessage />
      )}
    </div>
  )
}

const NoWalletConnectedMessage: React.FC = () => {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-col items-center px-4 text-center">
        <LinkIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
          No wallet connected
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal">
          Please connect a wallet to begin
        </p>
      </div>
    </div>
  )
}

const ConversationsPanel = (): JSX.Element => {
  const { loadingConversations, client } = useContext(XmtpContext)

  if (client === undefined) {
    return (
      <Loader
        headingText="Awaiting signatures..."
        subHeadingText="Use your wallet to sign"
        isLoading
      />
    )
  }

  if (loadingConversations) {
    return (
      <Loader
        headingText="Loading conversations..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    )
  }

  return (
    <nav className="flex-1 pb-4 space-y-1">
      <ConversationsList />
    </nav>
  )
}

export default NavigationPanel