import React, { ReactNode, useCallback, useEffect } from 'react'
import { useSigner } from 'wagmi'
import { useWeb3Modal, Web3Button, Web3Modal } from '@web3modal/react'

import useInitXmtpClient from '../../hooks/useInitXmtpClient'
import useListConversations from '../../hooks/useListConversations'
import useWalletProvider from '../../hooks/useWalletProvider'
import { useAppStore } from '../../store/app'
import { RecipientControl } from '../Conversation'
import NavigationPanel from './NavigationPanel'
import NewMessageButton from '../NewMessageButton'
import {
  NavigationColumnLayout,
  NavigationHeaderLayout,
  TopBarLayout,
} from '../shared'
import UserMenu from '../UserMenu'
import { ConversationView, ReactNavigationView } from '../Views'
import XmtpInfoPanel from '../XmtpInfoPanel'
import { ethereumClient } from '../../helpers/ethereumClient'
import ConversationScreen from './screens/ConversationScreen'
import { clear as clearStorage } from '../../helpers/localPrivateKeyStorage'
import { getFirebaseToken } from '../../helpers/firebase'
import useNotificationSubscription from '../../hooks/useNotificationSubscription'

export const PROJECT_ID =
  process.env.WALLETCONNECT_PROJECT_ID ||
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

export const ExtensionLayout = ({ children }) => {
  const { data, isLoading, isError } = useSigner()
  const { open: openWeb3Modal } = useWeb3Modal()
  const extensionAppViewState = useAppStore(
    (state) => state.extensionAppViewState
  )
  const setExtensionAppViewState = useAppStore(
    (state) => state.setExtensionAppViewState
  )
  const client = useAppStore((state) => state.client)
  const walletAddress = useAppStore((state) => state.address)
  const setSigner = useAppStore((state) => state.setSigner)
  const setAddress = useAppStore((state) => state.setAddress)
  const { initClient } = useInitXmtpClient()
  const { connect: connectWallet, disconnect: disconnectWallet } =
    useWalletProvider()
  const { register: registerPush, revoke } = useNotificationSubscription()
  useListConversations()

  const handleConnect = useCallback(async () => {
    openWeb3Modal()
    // data && (await initClient(data))
  }, [initClient, data])

  useEffect(() => {
    ;(async () => {
      if (isLoading || isError) return

      if (data) {
        await initClient(data)
      }
    })()
  }, [isLoading, data, isError, initClient])

  useEffect(() => {
    client && registerPush()
  }, [client, registerPush])

  useEffect(() => {
    console.log('sending extension loaded')

    chrome.runtime.sendMessage({ type: 'extension_loaded' }).then((res) => {
      console.log('extension_loaded response', res)
    })
  }, [])

  const handleCloseConversation = () => {
    console.log('close conversation')
  }

  const handleClickedNew = () => {
    setExtensionAppViewState('dm')
  }

  const handleClickedLogo = () => {
    console.log('clicked logo')
  }

  const handleDisconnect = async () => {
    localStorage.removeItem('walletconnect')
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('-walletlink')) {
        localStorage.removeItem(key)
      }
    })
    setSigner(undefined)
    setAddress(undefined)
    clearStorage()
  }

  const requestNotificationPerms = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted.')
      }
      const token = await getFirebaseToken()
      console.log('firebase token', token)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <ReactNavigationView>
        <NavigationColumnLayout>
          <>
            <NavigationHeaderLayout
              renderCtx="react"
              onClickLogo={handleClickedLogo}
            >
              {walletAddress && client && (
                <NewMessageButton onClick={handleClickedNew} />
              )}
            </NavigationHeaderLayout>
            <NavigationPanel onConnect={handleConnect} />
            <Web3Button />
            <Web3Modal projectId={PROJECT_ID} ethereumClient={ethereumClient} />
            {/* <button className="mt-8" onClick={handleConnect}>
            connect wallet
          </button> */}
            <button onClick={requestNotificationPerms}>
              Request push notifications
            </button>
            <UserMenu
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </>
        </NavigationColumnLayout>
      </ReactNavigationView>
      <ConversationView show={extensionAppViewState !== 'home'}>
        {walletAddress && client ? (
          <ConversationLayout onClose={handleCloseConversation}>
            {children}
          </ConversationLayout>
        ) : (
          <XmtpInfoPanel onConnect={handleConnect} />
        )}
      </ConversationView>
    </div>
  )
}

interface IConversationLayout {
  children: ReactNode
  onClose: () => void
}

const ConversationLayout: React.FC<IConversationLayout> = ({
  children,
  onClose,
}) => {
  const setActiveConversation = useAppStore(
    (state) => state.setActiveConversation
  )
  const setActiveRecipient = useAppStore((state) => state.setActiveRecipient)
  const appViewContext = useAppStore((state) => state.extensionAppViewState)
  const setAppViewContext = useAppStore(
    (state) => state.setExtensionAppViewState
  )
  const activeRecipient = useAppStore((state) => state.activeRecipient)

  const handleSubmit = async (address: string) => {
    setActiveRecipient(address)
    setAppViewContext('conversation')
  }

  const handleBackArrowClick = () => {
    setActiveConversation(null)
    setActiveRecipient(null)
    setAppViewContext('home')
    onClose()
  }

  return (
    <>
      <TopBarLayout>
        <RecipientControl
          onBackArrowClick={handleBackArrowClick}
          recipientWalletAddress={activeRecipient}
          onSubmit={handleSubmit}
          onInputChange={() => {
            if (appViewContext !== 'dm') {
              setAppViewContext('dm')
            }
          }}
        />

        <ConversationScreen recipientWalletAddr={activeRecipient} />
      </TopBarLayout>
      {children}
    </>
  )
}
