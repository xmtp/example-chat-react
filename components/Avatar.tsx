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
        <div className="rounded-full bg-gray-200 h-10 w-10"></div>
      </div>
    )
  }
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        className="w-10 h-10 rounded-full"
        alt={peerAddress}
      />
    )
  }
  return <Blockies seed={peerAddress} size={10} className="rounded-full" />
}

export default Avatar
