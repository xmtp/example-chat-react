import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { NavigationView, ConversationView } from './Views'
import { RecipientControl } from './Conversation'
import NewMessageButton from './NewMessageButton'
import NavigationPanel from './NavigationPanel'
import XmtpInfoPanel from './XmtpInfoPanel'
import UserMenu from './UserMenu'
import BackArrow from './BackArrow'
import { useCallback, useContext } from 'react'
import { WalletContext } from '../contexts/wallet'
import XmtpContext from '../contexts/xmtp'

const NavigationColumnLayout: React.FC = ({ children }) => (
  <aside className="flex w-full md:w-84 flex-col flex-grow fixed inset-y-0">
    <div className="flex flex-col flex-grow md:border-r md:border-gray-200 bg-white overflow-y-auto">
      {children}
    </div>
  </aside>
)

const NavigationHeaderLayout: React.FC = ({ children }) => (
  <div className="h-[10vh] max-h-20 bg-p-600 flex items-center justify-between flex-shrink-0 px-4">
    <Link href="/" passHref={true}>
      <img className="h-8 w-auto" src="/xmtp-icon.png" alt="XMTP" />
    </Link>
    {children}
  </div>
)

const TopBarLayout: React.FC = ({ children }) => (
  <div className="sticky top-0 z-10 flex-shrink-0 flex bg-zinc-50 border-b border-gray-200 md:bg-white md:border-0">
    {children}
  </div>
)

const ConversationLayout: React.FC = ({ children }) => {
  const router = useRouter()
  const recipientWalletAddress = router.query.recipientWalletAddr as string

  const handleSubmit = async (address: string) => {
    router.push(address ? `/dm/${address}` : '/dm/')
  }

  const handleBackArrowClick = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <>
      <TopBarLayout>
        <div className="md:hidden flex items-center ml-3">
          <BackArrow onClick={handleBackArrowClick} />
        </div>
        <RecipientControl
          recipientWalletAddress={recipientWalletAddress}
          onSubmit={handleSubmit}
        />
      </TopBarLayout>
      {children}
    </>
  )
}

const Layout: React.FC = ({ children }) => {
  const { client, initClient } = useContext(XmtpContext)

  const {
    address: walletAddress,
    connect: connectWallet,
    disconnect: disconnectWallet,
    signer,
  } = useContext(WalletContext)

  const handleDisconnect = useCallback(async () => {
    await disconnectWallet()
  }, [disconnectWallet])

  const handleConnect = useCallback(async () => {
    await connectWallet()
    signer && (await initClient(signer))
  }, [connectWallet, initClient, signer])

  return (
    <>
      <Head>
        <title>Chat via XMTP</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <div>
        <NavigationView>
          <NavigationColumnLayout>
            <NavigationHeaderLayout>
              {walletAddress && client && <NewMessageButton />}
            </NavigationHeaderLayout>
            <NavigationPanel onConnect={handleConnect} />
            <UserMenu
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </NavigationColumnLayout>
        </NavigationView>
        <ConversationView>
          {walletAddress && client ? (
            <ConversationLayout>{children}</ConversationLayout>
          ) : (
            <XmtpInfoPanel onConnect={handleConnect} />
          )}
        </ConversationView>
      </div>
    </>
  )
}

export default Layout
