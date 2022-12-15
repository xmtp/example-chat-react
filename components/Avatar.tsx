import Blockies from 'react-blockies'
import useEns from '../hooks/useEns'

type AvatarProps = {
  peerAddress: string
}

const Avatar = ({ peerAddress }: AvatarProps) => {
  const { avatarUrl, loading } = useEns(peerAddress)
  if (loading) {
    return (
      <div className="animate-pulse flex">
        <div className="rounded-full bg-gray-200 h-10 w-10" />
      </div>
    )
  }
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
  return <Blockies seed={peerAddress.toLowerCase()} scale={5} size={8} className="rounded-full" />
}

export default Avatar
