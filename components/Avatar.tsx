import Blockies from 'react-blockies'
import useEns from '../hooks/useEns'

type AvatarProps = {
  addressOrName: string
}

const Avatar = ({ addressOrName }: AvatarProps) => {
  const { ensAvatar, isLoadingAvatar } = useEns(addressOrName)
  return ensAvatar && !isLoadingAvatar ? (
    <img
      className={'rounded-full h-10 w-10'}
      src={ensAvatar}
      alt={addressOrName}
    />
  ) : (
    <Blockies seed={addressOrName} size={10} className="rounded-full" />
  )
}

export default Avatar
