import { SearchIcon } from '@heroicons/react/outline'
import { useCallback, useEffect, useState } from 'react'

type RecipientInputProps = {
  initialAddress: string | undefined
  onSubmit: (address: string) => Promise<void>
}

const RecipientInput = ({
  initialAddress,
  onSubmit,
}: RecipientInputProps): JSX.Element => {
  const [address, setAddress] = useState<string>()

  const handleChange = useCallback((e: React.SyntheticEvent) => {
    const data = e.target as typeof e.target & {
      value: string
    }
    setAddress(data.value)
  }, [])

  const handleSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault()
      const data = e.target as typeof e.target & {
        recipient: { value: string }
      }
      if (!data.recipient) return
      onSubmit(data.recipient.value)
    },
    [onSubmit]
  )

  useEffect(() => {
    setAddress(initialAddress || '')
  }, [initialAddress])

  return (
    <div className="flex-1 flex">
      <form
        className="w-full flex md:ml-0"
        action="#"
        method="GET"
        onSubmit={handleSubmit}
      >
        <label htmlFor="recipient-field" className="sr-only">
          Recipient
        </label>
        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="recipient-field"
            className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
            placeholder="Ethereum address or ENS name"
            type="recipient"
            name="recipient"
            onChange={handleChange}
            value={address === undefined ? initialAddress || '' : address}
          />
          <button type="submit" className="hidden" />
        </div>
      </form>
    </div>
  )
}

export default RecipientInput
