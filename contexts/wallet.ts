import { createContext } from 'react'
import { ethers, Signer, Wallet } from 'ethers'
import Web3Modal from 'web3modal'

export type WalletContextType = {
  provider: ethers.providers.Web3Provider | undefined
  signer: Signer | Wallet | undefined
  address: string | undefined
  web3Modal: Web3Modal | undefined
  chainId: number | undefined
  resolveName: (name: string) => Promise<string | undefined>
  lookupAddress: (address: string) => Promise<string | undefined>
  getAvatarUrl: (address: string) => Promise<string | undefined>
  connect: (autosign: boolean) => Promise<Signer | Wallet | undefined>
  disconnect: () => Promise<void>
}

export const WalletContext = createContext<WalletContextType>({
  provider: undefined,
  signer: undefined,
  address: undefined,
  web3Modal: undefined,
  chainId: undefined,
  resolveName: async () => undefined,
  lookupAddress: async () => undefined,
  getAvatarUrl: async () => undefined,
  connect: async () => undefined,
  disconnect: async () => undefined,
})
