import Head from 'next/head'
import Link from 'next/link'
import { NavigationView, ConversationView } from './Views'
import { RecipientControl } from './Conversation'
import NewMessageButton from './NewMessageButton'
import NavigationPanel from './NavigationPanel'
import XmtpInfoPanel from './XmtpInfoPanel'
import UserMenu from './UserMenu'
import React, { useCallback } from 'react'
import { useAppStore } from '../store/app'
import useInitXmtpClient from '../hooks/useInitXmtpClient'
import useListConversations from '../hooks/useListConversations'
import useWalletProvider from '../hooks/useWalletProvider'
import useWalletProviderDemo from '../hooks/useWalletProviderDemo'
import { isAppEnvDemo } from '../helpers'
import useDisconnect from '../hooks/useDisconnect'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const client = useAppStore((state) => state.client)
  const walletAddress = useAppStore((state) => state.address)
  const signer = useAppStore((state) => state.signer)
  const { initClient } = useInitXmtpClient()
  useListConversations()

  const { connect: connectWallet } = useWalletProvider()

  const { disconnect: disconnectWallet } = useDisconnect()

  const { connect: connectDemo } = useWalletProviderDemo()

  const handleDisconnect = useCallback(async () => {
    await disconnectWallet()
  }, [disconnectWallet])

  const handleConnect = useCallback(async () => {
    const isDemoEnv = isAppEnvDemo()
    debugger
    if (isDemoEnv) {
      await connectDemo()
    } else {
      await connectWallet()
    }
    signer && (await initClient(signer))
  }, [connectWallet, initClient, connectDemo, signer])

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
          <aside className="flex w-full md:w-84 flex-col flex-grow fixed inset-y-0">
            <div className="flex flex-col flex-grow md:border-r md:border-gray-200 bg-white overflow-y-auto">
              <div className="max-h-16 min-h-[4rem] bg-p-600 flex items-center justify-between flex-shrink-0 px-4">
                <Link href="/" passHref={true}>
                  <img className="h-8 w-auto" src="/xmtp-icon.png" alt="XMTP" />
                </Link>
                {walletAddress && client && <NewMessageButton />}
              </div>
              <NavigationPanel onConnect={handleConnect} />
              <UserMenu
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            </div>
          </aside>
        </NavigationView>
        <ConversationView>
          {walletAddress && client ? (
            <>
              <div className="flex bg-zinc-50 border-b border-gray-200 md:bg-white md:border-0 max-h-16 min-h-[4rem]">
                <RecipientControl />
              </div>
              {children}
            </>
          ) : (
            <XmtpInfoPanel onConnect={handleConnect} />
          )}
        </ConversationView>
      </div>
    </>
  )
}

export default Layout
