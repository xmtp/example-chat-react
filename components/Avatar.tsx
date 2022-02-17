import Blockies from 'react-blockies'

type AvatarProps = {
  peerAddress: string
}

const Avatar = ({ peerAddress }: AvatarProps) => (
  <Blockies seed={peerAddress} size={10} className="rounded-full" />
)

export default Avatar
