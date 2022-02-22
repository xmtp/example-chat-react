import { useCallback, useState } from 'react'
import AddressInput from '../AddressInput'
import useWallet from '../../hooks/useWallet'

type RecipientInputProps = {
  recipientWalletAddress: string | undefined
  onSubmit: (address: string) => Promise<void>
}

const RecipientControl = ({
  recipientWalletAddress,
  onSubmit,
}: RecipientInputProps): JSX.Element => {
  const { resolveName, lookupAddress } = useWallet()
  const [findingNameOrAddress, setFindingNameOrAddress] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      const data = e.target as typeof e.target & {
        recipient: { value: string }
      }
      if (!data.recipient) return
      onSubmit(data.recipient.value)
    },
    [onSubmit]
  )

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
            id="recipient-field"
            className="block w-full pl-8 pr-3 bg-transparent caret-n-600 text-n-600 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent text-md font-mono font-bold"
            name="recipient"
            recipientWalletAddress={recipientWalletAddress}
            resolveName={resolveName}
            lookupAddress={lookupAddress}
            setFindingNameOrAddress={setFindingNameOrAddress}
            submitAddress={onSubmit}
          />
          <button type="submit" className="hidden" />
        </div>
      </form>
      {recipientWalletAddress ? (
        <div className="text-md text-n-300 font-mono ml-10 pl-[1px] md:ml-8">
          {recipientWalletAddress}
        </div>
      ) : (
        <div className="text-sm leading-[21px] text-n-300 ml-8 pl-2 md:pl-0 ">
          {findingNameOrAddress
            ? 'Finding ENS domain...'
            : 'Please enter a wallet address'}
        </div>
      )}
    </div>
  )
}

export default RecipientControl