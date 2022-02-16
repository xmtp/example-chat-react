import { useEffect, useState } from 'react'

type AddressInputProps = {
  initialValue?: string
  id?: string
  name?: string
  className?: string
  placeholder?: string
  resolveName?: (name: string) => Promise<string | undefined>
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
}: AddressInputProps): JSX.Element => {
  const [value, setValue] = useState<string>(initialValue || '')

  useEffect(() => {
    const setResolvedValue = async () => {
      if (resolveName && value.endsWith('.eth')) {
        const address = await resolveName(value)
        if (address) {
          setValue(address)
        }
      }
    }
    setResolvedValue()
  }, [value, resolveName])

  return (
    <input
      id={id}
      name={name}
      className={classNames(className || '')}
      placeholder={placeholder}
      onChange={async (event: React.SyntheticEvent) => {
        const data = event.target as typeof event.target & {
          value: string
        }
        setValue(data.value.trim())
      }}
      value={value}
    />
  )
}

export default AddressInput
