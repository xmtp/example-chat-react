import { useEffect, useState } from 'react'
import { classNames, shortAddress } from '../helpers'
import useEnsHooks from '../hooks/useEnsHooks'

type AddressProps = {
  address: string
  className?: string
}

const Address = ({ address, className }: AddressProps): JSX.Element => {
  const [name, setName] = useState<string>()
  const { lookupAddress, loading } = useEnsHooks()

  useEffect(() => {
    const getName = async () => {
      const newName = await lookupAddress(address)
      setName(newName)
    }
    getName()
  }, [address, lookupAddress])

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
