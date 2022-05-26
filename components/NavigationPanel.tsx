import { LinkIcon } from '@heroicons/react/outline'
import { ChatIcon } from '@heroicons/react/outline'
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import useXmtp from '../hooks/useXmtp'
import ConversationsList from './ConversationsList'
import ConversationFilter from './ConversationFilter'
import ConversationCategory from './ConversationCategory'

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
    <div className="flex flex-col flex-grow">
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
    <div className="flex flex-col justify-center flex-grow">
      <div className="flex flex-col items-center px-4 text-center">
        <LinkIcon
          className="w-8 h-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl font-bold md:text-lg text-n-200 md:text-n-300">
          No wallet connected
        </p>
        <p className="font-normal text-lx md:text-md text-n-200">
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
      className="mx-auto my-4 border rounded border-l-300 text-l-300 hover:text-white hover:bg-l-400 hover:border-l-400 hover:fill-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:outline-none active:bg-l-500 active:border-l-500 active:text-l-100 active:ring-0"
    >
      <div className="flex items-center justify-center px-4 py-1 text-xs font-semibold">
        Connect your wallet
        <ArrowSmRightIcon className="h-4" />
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
  if (loadingConversations) {
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
      <div className="flex items-center justify-end p-1 border-b-1 border ">
        <ConversationFilter />
      </div>
      {/* <ConversationCategory /> */}
      <ConversationsList conversations={conversations} />
    </nav>
  ) : (
    <NoConversationsMessage />
  )
}

const NoConversationsMessage = (): JSX.Element => {
  return (
    <div className="flex flex-col justify-center flex-grow">
      <div className="flex flex-col items-center px-4 text-center">
        <ChatIcon
          className="w-8 h-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl font-bold md:text-lg text-n-200 md:text-n-300">
          Your message list is empty
        </p>
        <p className="font-normal text-lx md:text-md text-n-200">
          There are no messages in this wallet
        </p>
      </div>
    </div>
  )
}

export default NavigationPanel
