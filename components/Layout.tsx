import { useCallback, useEffect, useRef, useState } from 'react'
import { useXmtp } from './XmtpContext'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useWallet } from './WalletContext'
import Stack from './Stack'
import MobileSidebar from './MobileSidebar'
import RecipientInput from './RecipientInput'
import UserMenu from './UserMenu'
import BackArrow from './BackArrow'

const TopBarLayout: React.FC = ({ children }) => (
  <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow items-center">
    {children}
  </div>
)

const TopRightLayout: React.FC = ({ children }) => (
  <div className="flex-1 px-4 flex justify-between">{children}</div>
)

const RightPanelLayout: React.FC = ({ children }) => (
  <div className="hidden md:pl-84 md:flex md:flex-col md:flex-1 md:h-screen">
    {children}
  </div>
)

const Layout: React.FC = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { connect: connectXmtp, disconnect: disconnectXmtp } = useXmtp()
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
    setSidebarOpen(true)
    router.push('/')
  }, [router])

  const handleConversationTileClick = () => {
    setSidebarOpen(true)
  }

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

  const handleSubmit = useCallback(
    async (address: string) => {
      router.push(address ? `/dm/${address}` : '/')
    },
    [router]
  )

  return (
    <>
      <Head>
        <title>Chat via XMTP</title>
      </Head>
      <div>
        <Stack
          onClickNewMessageButton={handleNewMessageButtonClick}
          onClickConversationTile={handleConversationTileClick}
        >
          <UserMenu onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </Stack>
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        >
          <TopBarLayout>
            <BackArrow setSidebarOpen={setSidebarOpen} />
            <RecipientInput
              initialAddress={router.query.recipientWalletAddr as string}
              onSubmit={handleSubmit}
            />
          </TopBarLayout>
          {children}
        </MobileSidebar>
        <RightPanelLayout>
          <TopBarLayout>
            <TopRightLayout>
              <RecipientInput
                initialAddress={router.query.recipientWalletAddr as string}
                onSubmit={handleSubmit}
              />
            </TopRightLayout>
          </TopBarLayout>
          {children}
        </RightPanelLayout>
      </div>
    </>
  )
}

export default Layout
