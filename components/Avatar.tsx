import Blockies from 'react-blockies'
import useLookup from '../hooks/useLookup'

type AvatarProps = {
  peerAddress: string
}

const Avatar = ({ peerAddress }: AvatarProps) => {
  const {
    data: { avatar },
    loading,
  } = useLookup(peerAddress)
  if (loading) {
    return (
      <div className="animate-pulse flex">
        <div className="rounded-full bg-gray-200 h-10 w-10" />
      </div>
    )
  }
  if (avatar) {
    return (
      <div>
        <div className="w-10 h-10 rounded-full border border-n-80" />
        <img
          className="w-10 h-10 rounded-full z-10 -mt-10"
          src={avatar}
          alt={peerAddress}
        />
      </div>
    )
  }
  return <Blockies seed={peerAddress} size={10} className="rounded-full" />
}

export default Avatar
