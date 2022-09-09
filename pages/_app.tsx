import '../styles/globals.css'
import type { AppProps } from 'next/app'
import useWallet from '../hooks/useWallet'
import XmtpProvider from '../components/XmtpProvider'
import Layout from '../components/Layout'

function AppWrapper({ Component, pageProps }: AppProps) {
  const signer = useWallet()
  return (
    <XmtpProvider signer={signer}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </XmtpProvider>
  )
}

export default AppWrapper
