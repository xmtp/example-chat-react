import { XmtpProvider } from '../components/XmtpContext'
import Layout from '../components/Layout'
import { WalletProvider } from './WalletContext'

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
