import React, { useContext } from 'react'
import { WalletContext } from '../contexts/wallet'
import { classNames } from '../helpers'
import Address from './Address'

type addressPillProps = {
  address: string
}

const AddressPill = ({ address }: addressPillProps): JSX.Element => {
  const { address: walletAddress } = useContext(WalletContext)
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
