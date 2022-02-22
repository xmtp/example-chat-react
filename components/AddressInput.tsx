import { useEffect, useState } from 'react'

type AddressInputProps = {
  initialValue?: string
  id?: string
  name?: string
  className?: string
  placeholder?: string
  resolveName?: (name: string) => Promise<string | undefined>
  lookupAddress?: (address: string) => Promise<string | undefined>
  setResolving?: (resolving: boolean) => void
  submitAddress?: (address: string) => void
  setRecipientAddress?: (address: string) => void
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const AddressInput = ({
  initialValue,
  id,
  name,
  className,
  placeholder,
  resolveName,
  lookupAddress,
  setResolving,
  submitAddress,
}: AddressInputProps): JSX.Element => {
  const [value, setValue] = useState<string>(initialValue || '')

  useEffect(() => {
    const setResolvedAddress = async () => {
      if (resolveName && lookupAddress && setResolving && submitAddress) {
        if (value.endsWith('.eth')) {
          setResolving(true)
          const address = await resolveName(value)
          setResolving(false)
          if (address) {
            submitAddress(address)
          }
        } else if (value.startsWith('0x') && value.length === 42) {
          const name = await lookupAddress(value)
          if (name) {
            submitAddress(value)
          }
        }
      }
    }
    setResolvedAddress()
  }, [value, resolveName, lookupAddress, setResolving, submitAddress])

  const onAddressChange = async (event: React.SyntheticEvent) => {
    const data = event.target as typeof event.target & {
      value: string
    }
    setValue(data.value.trim())
  }

  return (
    <input
      id={id}
      name={name}
      className={classNames(className || '')}
      placeholder={placeholder}
      onChange={onAddressChange}
      value={value}
    />
  )
}

export default AddressInput
