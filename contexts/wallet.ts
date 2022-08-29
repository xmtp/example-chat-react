import { createContext } from 'react'
import { Signer } from 'ethers'

export type WalletContextType = {
  signer: Signer | undefined
  address: string | undefined
  resolveName: (name: string) => Promise<string | undefined>
  lookupAddress: (address: string) => Promise<string | undefined>
  getAvatarUrl: (address: string) => Promise<string | undefined>
  connect: () => Promise<Signer | undefined>
  disconnect: () => void
}

export const WalletContext = createContext<WalletContextType>({
  signer: undefined,
  address: undefined,
  resolveName: async () => undefined,
  lookupAddress: async () => undefined,
  getAvatarUrl: async () => undefined,
  connect: async () => undefined,
  disconnect: async () => undefined,
})
