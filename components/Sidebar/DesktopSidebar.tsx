import Link from 'next/link'
import { LinkIcon } from '@heroicons/react/outline'
import { ChatIcon } from '@heroicons/react/outline'
import { useXmtp } from '../XmtpContext'
import ConversationsList from './ConversationsList'

type DesktopSidebarProps = {
  onClickNewMessageButton: () => void
  children?: React.ReactNode
}

const DesktopSidebar = ({
  onClickNewMessageButton,
  children,
}: DesktopSidebarProps): JSX.Element => {
  const { walletAddress } = useXmtp()

  return (
    <section className="hidden md:flex md:w-84 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
        <div className="h-14 bg-p-600 flex items-center justify-between flex-shrink-0 px-4">
          <Link href="/" passHref={true}>
            <img className="h-8 w-auto" src="/xmtp-icon.png" alt="XMTP" />
          </Link>
          {walletAddress && (
            <button
              className="inline-flex items-center h-6 px-4 py-1 my-4 bg-p-400 border border-p-300 hover:bg-p-300 focus:ring-2 focus:ring-offset-2 focus:ring-n-100 focus:ring-offset-p-600 focus:border-n-100 text-xs font-semibold tracking-wide text-white rounded"
              onClick={onClickNewMessageButton}
            >
              + New Message
            </button>
          )}
        </div>
        <div className="flex-grow flex flex-col">
          {walletAddress ? (
            <ConversationsPanel />
          ) : (
            <NoWalletConnectedMessage />
          )}
        </div>
        {children}
      </div>
    </section>
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

export default DesktopSidebar
