import { useEffect, useState } from 'react'
import Blockies from 'react-blockies'
import useWalletProvider from '../hooks/useWalletProvider'

type AvatarProps = {
  peerAddress: string
}

const Avatar = ({ peerAddress }: AvatarProps) => {
  const { getAvatarUrl } = useWalletProvider()
  const [avatarUrl, setAvatarUrl] = useState<string>()

  useEffect(() => {
    const updateAvatarUrl = async () => {
      const avatarUrlResponse = await getAvatarUrl(peerAddress)
      setAvatarUrl(avatarUrlResponse)
    }
    updateAvatarUrl()
  }, [peerAddress])

  if (avatarUrl) {
    return (
      <div>
        <div className="w-10 h-10 rounded-full border border-n-80" />
        <img
          className="w-10 h-10 rounded-full z-10 -mt-10"
          src={avatarUrl}
          alt={peerAddress}
        />
      </div>
    )
  }
  return <Blockies seed={peerAddress} size={10} className="rounded-full" />
}

export default Avatar
