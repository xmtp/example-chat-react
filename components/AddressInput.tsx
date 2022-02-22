import { useEffect, useState } from 'react'
import AddressPill from './AddressPill'
import useXmtp from '../hooks/useXmtp'

type AddressInputProps = {
  recipientWalletAddress?: string
  id?: string
  name?: string
  className?: string
  placeholder?: string
  resolveName?: (name: string) => Promise<string | undefined>
  lookupAddress?: (address: string) => Promise<string | undefined>
  setFindingNameOrAddress?: (findingNameOrAddress: boolean) => void
  submitAddress?: (address: string) => void
  setRecipientAddress?: (address: string) => void
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const AddressInput = ({
  recipientWalletAddress,
  id,
  name,
  className,
  placeholder,
  resolveName,
  lookupAddress,
  setFindingNameOrAddress,
  submitAddress,
}: AddressInputProps): JSX.Element => {
  const [value, setValue] = useState<string>('')
  const { walletAddress } = useXmtp()

  useEffect(() => {
    const setResolvedAddress = async () => {
      if (
        resolveName &&
        lookupAddress &&
        setFindingNameOrAddress &&
        submitAddress
      ) {
        if (value.endsWith('.eth')) {
          setFindingNameOrAddress(true)
          const address = await resolveName(value)
          setFindingNameOrAddress(false)
          if (address) {
            submitAddress(address)
          }
        } else if (value.startsWith('0x') && value.length === 42) {
          setFindingNameOrAddress(true)
          const name = await lookupAddress(value)
          setFindingNameOrAddress(false)
          if (name) {
            submitAddress(value)
          }
        }
      }
    }
    if (!recipientWalletAddress) {
      setResolvedAddress()
    }
  }, [
    value,
    resolveName,
    lookupAddress,
    setFindingNameOrAddress,
    submitAddress,
    recipientWalletAddress,
  ])

  const onAddressChange = async (event: React.SyntheticEvent) => {
    const data = event.target as typeof event.target & {
      value: string
    }
    setValue(data.value.trim())
  }

  const isSender = recipientWalletAddress === walletAddress

  return (
    <>
      {recipientWalletAddress ? (
        <div className="block pl-6 pr-3 pb-[1px]">
          <AddressPill
            address={recipientWalletAddress || ''}
            userIsSender={isSender}
          />
        </div>
      ) : (
        <input
          id={id}
          name={name}
          className={classNames(className || '')}
          placeholder={placeholder}
          onChange={onAddressChange}
          value={value}
        />
      )}
    </>
  )
}

export default AddressInput
