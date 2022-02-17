import { useEffect, useState } from 'react'
import { classNames } from '../helpers'

type AddressProps = {
  address: string
  className?: string
  lookupAddress?: (address: string) => Promise<string | undefined>
}

const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith('0x')
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr

const Address = ({
  address,
  className,
  lookupAddress,
}: AddressProps): JSX.Element => {
  const [name, setName] = useState<string>()

  useEffect(() => {
    if (!lookupAddress) return
    const initName = async () => {
      setName(await lookupAddress(address))
    }
    initName()
  }, [address, lookupAddress])

  return (
    <span className={classNames(className || '', 'font-mono')} title={address}>
      {name || shortAddress(address)}
    </span>
  )
}

export default Address
