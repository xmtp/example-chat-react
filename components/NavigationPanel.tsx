import { LinkIcon } from '@heroicons/react/outline'
import { ChatIcon } from '@heroicons/react/outline'
import { useXmtp } from './XmtpContext'
import ConversationsList from './ConversationsList'

const NavigationPanel = (): JSX.Element => {
  const walletAddress = useXmtp()
  return (
    <div className="flex-grow flex flex-col">
      {walletAddress ? <ConversationsPanel /> : <NoWalletConnectedMessage />}
    </div>
  )
}

const NoWalletConnectedMessage = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-col items-center px-4 text-center">
        <LinkIcon className="h-8 w-8 mb-1 stroke-n-300" aria-hidden="true" />
        <p className="text-lg text-n-300 font-bold">No wallet connected</p>
        <p className="text-md text-n-200 font-normal">
          Please connect a wallet to begin
        </p>
      </div>
    </div>
  )
}

const ConversationsPanel = (): JSX.Element => {
  const { conversations } = useXmtp()
  return conversations && conversations.length > 0 ? (
    <nav className="flex-1 pb-4 space-y-1">
      <ConversationsList conversations={conversations} />
    </nav>
  ) : (
    <NoConversationsMessage />
  )
}

const NoConversationsMessage = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-col items-center px-4 text-center">
        <ChatIcon className="h-8 w-8 mb-1 stroke-n-300" aria-hidden="true" />
        <p className="text-lg text-n-300 font-bold">You have no messages</p>
        <p className="text-md text-n-200 font-normal">
          You have no messages in this wallet
        </p>
      </div>
    </div>
  )
}

export default NavigationPanel
