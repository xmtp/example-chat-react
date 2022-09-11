import '@nft/chat/style.css'
import type { AppProps } from 'next/app'
import { ChatProvider } from '@nft/chat'
import { fetchEns, fetchLiteflow } from '../fetcher'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers, Signer } from 'ethers'

const cache = new Map<string, Promise<{ name?: string; avatar?: string }>>()

function AppWrapper({ Component, pageProps }: AppProps) {
  const [signer, setSigner] = useState<Signer>()
  const provider = useMemo(
    () =>
      typeof window !== 'undefined'
        ? new ethers.providers.Web3Provider(window.ethereum)
        : null,
    []
  )

  useEffect(() => {
    if (!provider) return
    provider
      .send('eth_requestAccounts', [])
      .then(() => setSigner(provider.getSigner()))
  }, [provider])

  useEffect(() => {
    if (!provider) return
    window.ethereum.on('accountsChanged', () => setSigner(provider.getSigner()))
  }, [provider])

  const lookup = useCallback(
    (address) => {
      const res = cache.get(address)
      if (res) return res

      const promise = Promise.all([
        fetchLiteflow(address),
        fetchEns(address, signer?.provider),
      ]).then(([liteflow, ens]) => ({
        name: liteflow.name || ens.name,
        avatar: liteflow.avatar || ens.avatar,
      }))

      cache.set(address, promise)
      return promise
    },
    [signer]
  )
  return (
    <ChatProvider signer={signer} lookupAddress={lookup}>
      <Component {...pageProps} />
    </ChatProvider>
  )
}

export default AppWrapper
