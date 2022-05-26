import XmtpProvider from './XmtpProvider'
import CyberConnectProvider from './CyberConnectProvider'
import Layout from '../components/Layout'
import { WalletProvider } from './WalletProvider'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
    <WalletProvider>
      <XmtpProvider>
        <CyberConnectProvider>
          <Layout>{children}</Layout>
        </CyberConnectProvider>
      </XmtpProvider>
    </WalletProvider>
  )
}

export default App
