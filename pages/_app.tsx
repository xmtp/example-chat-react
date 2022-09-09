import '../styles/globals.css'
import type { AppProps } from 'next/app'
import useWallet from '../hooks/useWallet'
import XmtpProvider from '../components/XmtpProvider'
import { fetchEns, fetchLiteflow } from '../helpers/fetcher'
import { useCallback } from 'react'

const cache = new Map<string, Promise<{ name?: string; avatar?: string }>>()

function AppWrapper({ Component, pageProps }: AppProps) {
  const signer = useWallet()

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
    <XmtpProvider signer={signer} lookupAddress={lookup}>
      <Component {...pageProps} />
    </XmtpProvider>
  )
}

export default AppWrapper
