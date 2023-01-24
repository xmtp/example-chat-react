import { useAppStore } from '../../store/app'
import Loader from '../Loader'
import { ConnectButton, NoWalletConnectedMessage } from '../NavigationPanel'
import ConversationsList from './ConversationsList'

type NavigationPanelProps = {
  onConnect: () => Promise<void>
}

const NavigationPanel = ({ onConnect }: NavigationPanelProps): JSX.Element => {
  const walletAddress = useAppStore((state) => state.address)
  const client = useAppStore((state) => state.client)

  return (
    <div className="flex-grow flex flex-col h-[calc(100vh-8rem)] overflow-y-auto">
      {walletAddress && client !== null ? (
        <ConversationsPanel />
      ) : (
        <NoWalletConnectedMessage>
          <ConnectButton onConnect={onConnect} />
        </NoWalletConnectedMessage>
      )}
    </div>
  )
}

const ConversationsPanel = (): JSX.Element => {
  const client = useAppStore((state) => state.client)
  const loadingConversations = useAppStore(
    (state) => state.loadingConversations
  )

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
    <nav className="flex-1 pb-4">
      <ConversationsList />
    </nav>
  )
}

export default NavigationPanel
