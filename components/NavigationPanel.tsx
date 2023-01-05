import { LinkIcon } from '@heroicons/react/outline'
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { useAppStore } from '../store/app'
import ConversationsList from './ConversationsList'
import Loader from './Loader'
import WalletConnector from './WalletConnector'
import { useAccount } from 'wagmi'

type NavigationPanelProps = {
  onConnect: () => Promise<void>
}

type ConnectButtonProps = {
  onConnect: () => Promise<void>
}

const NavigationPanel = ({ onConnect }: NavigationPanelProps): JSX.Element => {
  const { address: walletAddress } = useAccount()
  const client = useAppStore((state) => state.client)

  return (
    <div className="flex-grow flex flex-col h-[calc(100vh-8rem)] overflow-y-auto">
      {walletAddress && client ? (
        <ConversationsPanel />
      ) : (
        <NoWalletConnectedMessage>
          <ConnectButton onConnect={onConnect} />
        </NoWalletConnectedMessage>
      )}
    </div>
  )
}

const NoWalletConnectedMessage: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
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
      {children}
    </div>
  )
}

const ConnectButton = ({ onConnect }: ConnectButtonProps): JSX.Element => {
  const { address } = useAccount()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const onClick = () => {
    onConnect()
    if (!address) {
      setShowLoginModal(!showLoginModal)
    }
  }

  return (
    <button
      onClick={onClick}
      className="rounded border border-l-300 mx-auto my-4 text-l-300 hover:text-white hover:bg-l-400 hover:border-l-400 hover:fill-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:outline-none active:bg-l-500 active:border-l-500 active:text-l-100 active:ring-0"
    >
      <div className="flex items-center justify-center text-xs font-semibold px-4 py-1">
        Connect your wallet
        <ArrowSmRightIcon className="h-4" />
      </div>
      <WalletConnector
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
      />
    </button>
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
