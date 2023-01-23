import { WagmiConfig } from 'wagmi'
import Layout from '../components/Layout'
import { wagmiClient } from '../helpers/ethereumClient'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <Layout>{children}</Layout>
    </WagmiConfig>
  )
}

export default App
