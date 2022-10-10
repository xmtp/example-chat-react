import { Avatar as AvatarComponent, Box } from '@chakra-ui/react'
import React from 'react'
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
  if (loading) return <AvatarComponent />
  return avatar ? (
    <AvatarComponent name={peerAddress} src={avatar} />
  ) : (
    <Box
      rounded="full"
      width="48px"
      height="48px"
      overflow="hidden"
      flex="none"
    >
      <Blockies seed={peerAddress} size={12} />
    </Box>
  )
  // )
}

export default Avatar
