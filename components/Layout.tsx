import { useRouter } from 'next/router'
import { NavigationView, ConversationView } from './Views'
import { RecipientControl } from './Conversation'
import NavigationPanel from './NavigationPanel'
import BackArrow from './BackArrow'
import { useCallback, useContext } from 'react'
import XmtpContext from '../contexts/xmtp'

const Layout: React.FC = ({ children }) => {
  const { client, signer } = useContext(XmtpContext)
  const router = useRouter()

  const recipientWalletAddress = router.query.recipientWalletAddr as string

  const handleSubmit = async (address: string) => {
    router.push(address ? `/dm/${address}` : '/dm/')
  }

  const handleBackArrowClick = useCallback(() => {
    router.push('/')
  }, [router])

  const onNewMessageButtonClick = () => router.push('/dm/')

  return (
    <>
      <NavigationView show={router.pathname === '/'}>
        <aside className="flex w-full md:w-84 flex-col flex-grow fixed inset-y-0">
          <div className="flex flex-col flex-grow md:border-r md:border-gray-200 bg-white overflow-y-auto">
            <div className="h-[10vh] max-h-20 bg-zinc-50 border-b border-gray-200 flex items-center justify-between flex-shrink-0 px-4">
              <span className="text-md font-bold font-mono overflow-visible">
                Messages
              </span>
              {signer && client && (
                <button
                  className="inline-flex items-center space-between h-7 md:h-6 px-4 py-1 my-4 bg-p-400 border border-p-300 hover:bg-p-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:ring-offset-p-600 focus-visible:border-n-100 focus-visible:outline-none active:bg-p-500 active:border-p-500 active:ring-0 text-sm md:text-xs md:font-semibold tracking-wide text-white rounded"
                  onClick={onNewMessageButtonClick}
                >
                  + New
                </button>
              )}
            </div>
            <NavigationPanel />
          </div>
        </aside>
      </NavigationView>
      <ConversationView show={router.pathname !== '/'}>
        {signer && client && (
          <>
            <div className="sticky top-0 z-10 flex-shrink-0 flex bg-zinc-50 border-b border-gray-200 md:bg-white md:border-0">
              <div className="md:hidden flex items-center ml-3">
                <BackArrow onClick={handleBackArrowClick} />
              </div>
              <RecipientControl
                recipientWalletAddress={recipientWalletAddress}
                onSubmit={handleSubmit}
              />
            </div>
            {children}
          </>
        )}
      </ConversationView>
    </>
  )
}

export default Layout
