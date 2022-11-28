import { useEffect, useState } from 'react'
import { classNames, shortAddress } from '../helpers'
import useWalletProvider from '../hooks/useWalletProvider'

type AddressProps = {
  address: string
  className?: string
}

const Address = ({ address, className }: AddressProps): JSX.Element => {
  const { lookupAddress } = useWalletProvider()
  const [name, setName] = useState<string>('')

  useEffect(() => {
    const updateName = async () => {
      const nameResponse = await lookupAddress(address)
      setName(nameResponse)
    }
    updateName()
  }, [address])

  return (
    <span className={classNames(className || '', 'font-mono')} title={address}>
      {name || shortAddress(address)}
    </span>
  )
}

export default Address
