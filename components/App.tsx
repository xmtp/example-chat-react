import Layout from '../components/Layout'
import { WalletProvider } from './WalletProvider'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
    <WalletProvider>
      <Layout>{children}</Layout>
    </WalletProvider>
  )
}

export default App
