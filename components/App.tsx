import XmtpProvider from './XmtpProvider'
import Layout from '../components/Layout'
import useWallet from '../hooks/useWallet'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  const signer = useWallet()
  return (
    <XmtpProvider signer={signer}>
      <Layout signer={signer}>{children}</Layout>
    </XmtpProvider>
  )
}

export default App
