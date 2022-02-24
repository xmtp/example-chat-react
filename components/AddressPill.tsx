import React from 'react'
import { classNames } from '../helpers'
import Address from './Address'
import useWallet from '../hooks/useWallet'

type addressPillProps = {
  address: string
  userIsSender: boolean
}

const AddressPill = ({
  address,
  userIsSender,
}: addressPillProps): JSX.Element => {
  const { lookupAddress } = useWallet()

  return (
    <Address
      className={classNames(
        'rounded-2xl',
        'border',
        'text-md',
        'mr-2',
        'px-2',
        'py-1',
        'font-bold',
        userIsSender ? 'bg-bt-100 text-b-600' : 'bg-zinc-50',
        userIsSender ? 'border-bt-300' : 'border-gray-300'
      )}
      address={address}
      lookupAddress={lookupAddress}
    ></Address>
  )
}

export default AddressPill
