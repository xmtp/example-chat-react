import XmtpProvider from './XmtpProvider'
import Layout from '../components/Layout'
import { WalletProvider } from './WalletProvider'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
    <WalletProvider>
      <XmtpProvider>
        <Layout>{children}</Layout>
      </XmtpProvider>
    </WalletProvider>
  )
}

export default App
