import Link from 'next/link'
import { useXmtp } from '../XmtpContext'
import ConversationsList from './ConversationsList'

type DesktopSidebarProps = {
  onClickNewMessageButton: () => void
}

const DesktopSidebar = ({
  onClickNewMessageButton,
}: DesktopSidebarProps): JSX.Element => {
  const { walletAddress, conversations } = useXmtp()

  return (
    <aside className="hidden md:flex md:w-84 md:flex-col md:fixed md:inset-y-0 bg-zinc-50">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
        <div className="h-14 bg-p-600 flex items-center justify-between flex-shrink-0 px-4">
          <Link href="/" passHref={true}>
            <img className="h-8 w-auto" src="/xmtp-icon.png" alt="XMTP" />
          </Link>
          {walletAddress && (
            <button
              className="inline-flex items-center h-6 px-4 py-1 my-4 bg-p-400 hover:bg-p-300 border border-p-300 text-xs font-semibold tracking-wide text-white rounded"
              onClick={onClickNewMessageButton}
            >
              + New Message
            </button>
          )}
        </div>
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 pb-4 space-y-1">
            <ConversationsList conversations={conversations} />
          </nav>
        </div>
      </div>
    </aside>
  )
}

export default DesktopSidebar
