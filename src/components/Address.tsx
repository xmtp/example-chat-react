import React from 'react'
import { classNames } from '../helpers'
import useLookup from '../hooks/useLookup'

type AddressProps = {
  address: string
  className?: string
}

const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith('0x')
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr

const Address = ({ address, className }: AddressProps): JSX.Element => {
  const {
    data: { name },
    loading,
  } = useLookup(address)
  return (
    <span
      className={classNames(
        className || '',
        'font-mono',
        loading ? 'animate-pulse' : ''
      )}
      title={address}
    >
      {name || shortAddress(address)}
    </span>
  )
}

export default Address
