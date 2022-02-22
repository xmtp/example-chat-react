import { useCallback, useEffect, useRef } from 'react'
import useXmtp from '../hooks/useXmtp'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import useWallet from '../hooks/useWallet'
import { NavigationView, ConversationView } from './Views'
import { RecipientControl } from './Conversation'
import NewMessageButton from './NewMessageButton'
import NavigationPanel from './NavigationPanel'
import UserMenu from './UserMenu'
import BackArrow from './BackArrow'

const NavigationColumnLayout: React.FC = ({ children }) => (
  <aside className="flex w-full md:w-84 flex-col flex-grow fixed inset-y-0">
    <div className="flex flex-col flex-grow md:border-r md:border-gray-200 bg-white overflow-y-auto">
      {children}
    </div>
  </aside>
)

const NavigationHeaderLayout: React.FC = ({ children }) => (
  <div className="h-14 bg-p-600 flex items-center justify-between flex-shrink-0 px-4">
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

  const handleSubmit = useCallback(
    async (address: string) => {
      router.push(address ? `/dm/${address}` : '/dm/')
    },
    [router]
  )

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
  const {
    connect: connectXmtp,
    disconnect: disconnectXmtp,
    walletAddress,
  } = useXmtp()
  const router = useRouter()
  const {
    signer,
    connect: connectWallet,
    disconnect: disconnectWallet,
  } = useWallet()

  const handleDisconnect = useCallback(async () => {
    disconnectXmtp()
    await disconnectWallet()
    router.push('/')
  }, [disconnectWallet, disconnectXmtp, router])

  const handleConnect = useCallback(async () => {
    await connectWallet()
  }, [connectWallet])

  const handleNewMessageButtonClick = useCallback(() => {
    router.push('/dm/')
  }, [router])

  const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T>()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const prevSigner = usePrevious(signer)

  useEffect(() => {
    if (!signer && prevSigner) {
      disconnectXmtp()
    }
    if (!signer || signer === prevSigner) return
    const connect = async () => {
      const prevAddress = await prevSigner?.getAddress()
      const address = await signer.getAddress()
      if (address === prevAddress) return
      connectXmtp(signer)
    }
    connect()
  }, [signer, prevSigner, connectXmtp, disconnectXmtp])

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
              {walletAddress && (
                <NewMessageButton
                  onClickNewMessageButton={handleNewMessageButtonClick}
                />
              )}
            </NavigationHeaderLayout>
            <NavigationPanel />
            <UserMenu
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </NavigationColumnLayout>
        </NavigationView>
        <ConversationView>
          <ConversationLayout>{children}</ConversationLayout>
        </ConversationView>
      </div>
    </>
  )
}

export default Layout
