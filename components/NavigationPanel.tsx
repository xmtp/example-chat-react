import { LinkIcon } from '@heroicons/react/outline'
import { ChatIcon } from '@heroicons/react/outline'
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import useXmtp from '../hooks/useXmtp'
import ConversationsList from './ConversationsList'
import Loader from './Loader'

type NavigationPanelProps = {
  onConnect: () => Promise<void>
}

type ConnectButtonProps = {
  onConnect: () => Promise<void>
}

const NavigationPanel = ({ onConnect }: NavigationPanelProps): JSX.Element => {
  const { walletAddress } = useXmtp()

  return (
    <div className="flex-grow flex flex-col">
      {walletAddress ? (
        <ConversationsPanel />
      ) : (
        <NoWalletConnectedMessage>
          <ConnectButton onConnect={onConnect} />
        </NoWalletConnectedMessage>
      )}
    </div>
  )
}

const NoWalletConnectedMessage: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-col items-center px-4 text-center">
        <LinkIcon className="h-8 w-8 mb-1 stroke-n-300" aria-hidden="true" />
        <p className="text-lg text-n-300 font-bold">No wallet connected</p>
        <p className="text-md text-n-200 font-normal">
          Please connect a wallet to begin
        </p>
      </div>
      {children}
    </div>
  )
}

const ConnectButton = ({ onConnect }: ConnectButtonProps): JSX.Element => {
  return (
    <button
      onClick={onConnect}
      className="rounded border border-l-300 bg-zinc-50 hover:bg-zinc-100 mx-auto my-4"
    >
      <div className="flex items-center justify-center text-xs text-l-300 font-semibold px-4 py-1">
        Connect your wallet
        <ArrowSmRightIcon className="h-4 fill-l-300" />
      </div>
    </button>
  )
}

const ConversationsPanel = (): JSX.Element => {
  const { conversations, loadingConversations, client } = useXmtp()
  if (!client) {
    return (
      <Loader
        headingText="Awaiting signatures..."
        subHeadingText="Use your wallet to sign"
        isLoading
      />
    )
  }
  if (loadingConversations && !conversations?.length) {
    return (
      <Loader
        headingText="Loading conversations..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    )
  }

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
