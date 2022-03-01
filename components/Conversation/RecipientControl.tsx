import { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AddressInput from '../AddressInput'
import useWallet from '../../hooks/useWallet'
type RecipientInputProps = {
  recipientWalletAddress: string | undefined
  onSubmit: (address: string) => Promise<void>
}

const RecipientInputMode = {
  InvalidEntry: 0,
  ValidEntry: 1,
  FindingEntry: 2,
  Submitted: 3,
}

const RecipientControl = ({
  recipientWalletAddress,
  onSubmit,
}: RecipientInputProps): JSX.Element => {
  const { resolveName, lookupAddress } = useWallet()
  const router = useRouter()
  const [recipientInputMode, setRecipientInputMode] = useState(
    RecipientInputMode.InvalidEntry
  )
  const [hasName, setHasName] = useState(false)

  useEffect(() => {
    const handleAddressLookup = async (address: string) => {
      const name = await lookupAddress(address)
      setHasName(!!name)
    }
    if (recipientWalletAddress) {
      setRecipientInputMode(RecipientInputMode.Submitted)
      handleAddressLookup(recipientWalletAddress)
    } else {
      setRecipientInputMode(RecipientInputMode.InvalidEntry)
    }
  }, [recipientWalletAddress, setRecipientInputMode, lookupAddress, setHasName])

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent, value?: string) => {
      e.preventDefault()
      const data = e.target as typeof e.target & {
        recipient: { value: string }
      }
      const input = e.target as HTMLInputElement
      const recipientValue = value || data.recipient.value
      if (recipientValue.endsWith('eth')) {
        setRecipientInputMode(RecipientInputMode.FindingEntry)
        const address = await resolveName(recipientValue)
        if (address) {
          onSubmit(address)
          input.blur()
          setRecipientInputMode(RecipientInputMode.Submitted)
        } else {
          setRecipientInputMode(RecipientInputMode.InvalidEntry)
        }
      } else if (
        recipientValue.startsWith('0x') &&
        recipientValue.length === 42
      ) {
        onSubmit(recipientValue)
        input.blur()
        setRecipientInputMode(RecipientInputMode.Submitted)
      }
    },
    [onSubmit, setRecipientInputMode, resolveName]
  )

  const handleInputChange = async (e: React.SyntheticEvent) => {
    const data = e.target as typeof e.target & {
      value: string
    }
    if (router.pathname !== '/dm') {
      router.push('/dm')
    }
    if (
      data.value.endsWith('.eth') ||
      (data.value.startsWith('0x') && data.value.length === 42)
    ) {
      handleSubmit(e, data.value)
    } else {
      setRecipientInputMode(RecipientInputMode.InvalidEntry)
    }
  }

  return (
    <div className="flex-1 flex-col flex justify-center h-14 bg-zinc-50 md:border md:border-gray-200 pt-1 md:rounded-lg md:px-4 md:mx-4 md:mt-4">
      <form
        className="w-full flex pl-2 md:pl-0"
        action="#"
        method="GET"
        onSubmit={handleSubmit}
      >
        <label htmlFor="recipient-field" className="sr-only">
          Recipient
        </label>
        <div className="relative w-full text-n-300 focus-within:text-n-600">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-sm font-semibold">
            To:
          </div>
          <AddressInput
            recipientWalletAddress={recipientWalletAddress}
            id="recipient-field"
            className="block w-full pl-8 pr-3 bg-transparent caret-n-600 text-n-600 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent text-md font-mono font-bold"
            name="recipient"
            lookupAddress={lookupAddress}
            onInputChange={handleInputChange}
          />
          <button type="submit" className="hidden" />
        </div>
      </form>

      {recipientInputMode === RecipientInputMode.Submitted ? (
        <div className="text-md text-n-300 font-mono ml-10 md:ml-8">
          {hasName ? recipientWalletAddress : <br />}
        </div>
      ) : (
        <div className="text-sm leading-[21px] text-n-300 ml-8 pl-2 md:pl-0 ">
          {recipientInputMode === RecipientInputMode.FindingEntry &&
            'Finding ENS domain...'}
          {recipientInputMode === RecipientInputMode.InvalidEntry &&
            'Please enter a valid wallet address'}
          {recipientInputMode === RecipientInputMode.ValidEntry && <br />}
        </div>
      )}
    </div>
  )
}

export default RecipientControl
