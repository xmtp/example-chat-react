import { ChatProvider } from '@nft/chat'
import { fetchEns, fetchLiteflow } from '../fetcher'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Chat } from '@nft/chat'
import { useCallback } from 'react'
import { useSigner, useProvider } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const cache = new Map<string, Promise<{ name?: string; avatar?: string }>>()

const Home: NextPage = () => {
  const signer = useSigner()
  const provider = useProvider()

  const { query } = useRouter()
  const recipient = Array.isArray(query.recipient)
    ? query.recipient[0]
    : query.recipient

  const lookup = useCallback(
    (address) => {
      const res = cache.get(address)
      if (res) return res

      const promise = Promise.all([
        fetchLiteflow(address),
        fetchEns(address, provider),
      ]).then(([liteflow, ens]) => ({
        name: liteflow.name || ens.name,
        avatar: liteflow.avatar || ens.avatar,
      }))

      cache.set(address, promise)
      return promise
    },
    [provider]
  )

  if (!signer.data)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <ConnectButton />
      </div>
    )
  return (
    <ChatProvider signer={signer.data} lookupAddress={lookup}>
      <Chat recipient={recipient} />
    </ChatProvider>
  )
}

export default Home
