import '../styles/globals.css'
import type { AppProps } from 'next/app'
import useWallet from '../hooks/useWallet'
import XmtpProvider from '../components/XmtpProvider'

function AppWrapper({ Component, pageProps }: AppProps) {
  const signer = useWallet()
  return (
    <XmtpProvider signer={signer}>
      <Component {...pageProps} />
    </XmtpProvider>
  )
}

export default AppWrapper
