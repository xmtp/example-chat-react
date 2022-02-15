import Link from 'next/link'
import { useXmtp } from '../XmtpContext'
import ConversationsList from './ConversationsList'

type DesktopSidebarProps = {
  onNewMessage: () => Promise<void>
}

const DesktopSidebar = ({ onNewMessage }: DesktopSidebarProps): JSX.Element => {
  const { walletAddress, conversations } = useXmtp()

  return (
    <section className="hidden md:flex md:w-84 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
        <div className="h-14 bg-purple-600 flex items-center justify-between flex-shrink-0 px-4">
          <Link href="/" passHref={true}>
            <img className="h-8 w-auto" src="/xmtp-icon.png" alt="XMTP" />
          </Link>
          {walletAddress && (
            <button
              className="inline-flex items-center h-6 px-4 py-1 my-4 bg-purple-400 border border-purple-300 text-xs font-semibold tracking-wide text-white rounded"
              onClick={onNewMessage}
            >
              + New Message
            </button>
          )}
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            <ConversationsList conversations={conversations} />
          </nav>
        </div>
      </div>
    </section>
  )
}

export default DesktopSidebar
