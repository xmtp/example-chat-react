import { useEffect, useState } from 'react'
import AddressPill from './AddressPill'
import useXmtp from '../hooks/useXmtp'

const RecipientInputMode = {
  InvalidEntry: 0,
  ValidEntry: 1,
  FindingEntry: 2,
  Submitted: 3,
}

type AddressInputProps = {
  recipientWalletAddress?: string
  id?: string
  name?: string
  className?: string
  placeholder?: string
  resolveName?: (name: string) => Promise<string | undefined>
  lookupAddress?: (address: string) => Promise<string | undefined>
  setRecipientInputMode?: (recipientInputMode: number) => void
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
  setRecipientInputMode,
  submitAddress,
}: AddressInputProps): JSX.Element => {
  const [value, setValue] = useState<string>('')
  const { walletAddress } = useXmtp()

  useEffect(() => {
    const setResolvedAddress = async () => {
      if (
        resolveName &&
        lookupAddress &&
        setRecipientInputMode &&
        submitAddress
      ) {
        if (value.endsWith('.eth')) {
          setRecipientInputMode(RecipientInputMode.FindingEntry)
          const address = await resolveName(value)
          if (address) {
            submitAddress(address)
            setValue('')
            setRecipientInputMode(RecipientInputMode.Submitted)
          }
        } else if (value.startsWith('0x') && value.length === 42) {
          setRecipientInputMode(RecipientInputMode.FindingEntry)
          const name = await lookupAddress(value)
          if (name) {
            submitAddress(value)
            setValue('')
            setRecipientInputMode(RecipientInputMode.Submitted)
          } else {
            setRecipientInputMode(RecipientInputMode.ValidEntry)
          }
        } else {
          setRecipientInputMode(RecipientInputMode.InvalidEntry)
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
    setRecipientInputMode,
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
