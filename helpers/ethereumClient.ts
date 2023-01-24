import { EthereumClient, modalConnectors } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { Address, fetchEnsAddress, fetchEnsName } from '@wagmi/core'

export const chains = [mainnet]

// TODO: cleanup infura key
const { provider, webSocketProvider } = configureChains(chains, [
  // walletConnectProvider({ projectId: PROJECT_ID }),
  infuraProvider({ apiKey: '2ce53cb01dcb426590a40074621f1e14' }),
])

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
  webSocketProvider,
})

export const ethereumClient = new EthereumClient(wagmiClient, chains)

// Turn a .eth name into an address
export const getEnsAddress = (name: string) => {
  return fetchEnsAddress({
    name,
    chainId: chains[0].id,
  })
}

// Turn an address into a .eth name
export const getEnsName = (address: Address | string) => {
  return fetchEnsName({
    address: address as Address,
    chainId: chains[0].id,
  })
}
