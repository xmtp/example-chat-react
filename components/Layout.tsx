import { useEffect, useRef, useState } from 'react'
import { useXmtp } from './XmtpContext'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useWallet } from './WalletContext'
import { DesktopSidebar, MobileSidebar } from './Sidebar'
import RecipientInput from './RecipientInput'
import UserMenu from './UserMenu'
import HamburgerMenu from './HandburgerMenu'

const TopBarLayout: React.FC = ({ children }) => (
  <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
    {children}
  </div>
)

const TopRightLayout: React.FC = ({ children }) => (
  <div className="flex-1 px-4 flex justify-between">{children}</div>
)

const RightPanelLayout: React.FC = ({ children }) => (
  <div className="md:pl-64 flex flex-col flex-1 h-screen">{children}</div>
)

const Layout: React.FC = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    walletAddress,
    conversations,
    connect: connectXmtp,
    disconnect: disconnectXmtp,
  } = useXmtp()
  const router = useRouter()
  const [recipientWalletAddress, setRecipientWalletAddress] =
    useState<string>('')
  const recipientWalletAddressUrlParam = router.query
    .recipientWalletAddr as string
  const {
    signer,
    connect: connectWallet,
    disconnect: disconnectWallet,
  } = useWallet()

  const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T>()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const prevSigner = usePrevious(signer)

  useEffect(() => {
    setRecipientWalletAddress(recipientWalletAddressUrlParam || '')
  }, [recipientWalletAddressUrlParam])

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
      </Head>
      <div>
        <MobileSidebar
          {...{ conversations, setSidebarOpen, sidebarOpen, router }}
        />
        <DesktopSidebar {...{ conversations, router }} />
        <RightPanelLayout>
          <TopBarLayout>
            <HamburgerMenu setSidebarOpen={setSidebarOpen} />
            <TopRightLayout>
              <RecipientInput
                {...{
                  recipientWalletAddress,
                  setRecipientWalletAddress,
                  router,
                }}
              />
              <UserMenu
                {...{
                  connectWallet,
                  disconnectWallet,
                  disconnectXmtp,
                  walletAddress,
                  router,
                }}
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
