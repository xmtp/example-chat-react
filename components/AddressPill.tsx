import React from 'react'
import { classNames } from '../helpers'
import { useAppStore } from '../store/app'
import Address from './Address'

type addressPillProps = {
  address: string
}

const AddressPill = ({ address }: addressPillProps): JSX.Element => {
  const walletAddress = useAppStore((state) => state.address)
  const userIsSender = address === walletAddress
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
    ></Address>
  )
}

export default AddressPill
