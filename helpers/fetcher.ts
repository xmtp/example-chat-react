import { Provider } from '@ethersproject/abstract-provider'
import { Account } from '../contexts/xmtp'

export const fetchLiteflow = async (address: string): Promise<Account> => {
  const response = await fetch(
    'https://nft-demo-bsc-testnet-4u4nk.ondigitalocean.app/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          account(address: "${address.toLowerCase()}") {
            name
            image
          }
        }`,
      }),
    }
  )
  const { data } = await response.json()
  return {
    name: data.account.name,
    avatar: data.account.image,
  }
}

export const fetchEns = async (
  address: string,
  provider?: Provider
): Promise<Account> => {
  if (!provider) return {}
  try {
    const [name, avatar] = await Promise.all([
      provider.lookupAddress(address),
      provider.getAvatar(address),
    ])
    return { name: name || undefined, avatar: avatar || undefined }
  } catch (e) {
    console.error(e)
    return {}
  }
}
