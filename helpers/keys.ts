import { getEnv } from './env'

const ENCODING = 'binary'

export const buildLocalStorageKey = (walletAddress: string) =>
  `xmtp:${getEnv()}:keys:${walletAddress}`

export const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress))
  return val ? Buffer.from(val, ENCODING) : null
}

export const storeKeys = (walletAddress: string, keys: Uint8Array) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  )
}

export const wipeKeys = (walletAddress: string) => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress))
}
