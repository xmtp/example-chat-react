import XmtpProvider from './XmtpProvider'
import Layout from '../components/Layout'

import { WagmiConfig, createClient, chain, configureChains } from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'

const alchemyId =
  process.env.NEXT_PUBLIC_ALCHEMY_ID || 'kdfkwIFWhX41Ny0gtZ_xpx58Y_wAw3RM'

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.ropsten],
  [alchemyProvider({ alchemyId })]
)
const { connectors } = getDefaultWallets({
  appName: 'Chat via XMTP',
  chains,
})

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
})

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <XmtpProvider>
          <Layout>{children}</Layout>
        </XmtpProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
