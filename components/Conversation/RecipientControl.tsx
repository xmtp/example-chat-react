import { useState, useEffect, useContext, useCallback } from 'react'
import { useRouter } from 'next/router'
import AddressInput from '../AddressInput'
import { WalletContext } from '../../contexts/wallet'
import XmtpContext from '../../contexts/xmtp'
import { checkIfPathIsEns } from '../../helpers'

type RecipientInputProps = {
  recipientWalletAddress: string | undefined
  onSubmit: (address: string) => Promise<void>
}

const RecipientInputMode = {
  InvalidEntry: 0,
  ValidEntry: 1,
  FindingEntry: 2,
  Submitted: 3,
  NotOnNetwork: 4,
}

const RecipientControl = ({
  recipientWalletAddress,
  onSubmit,
}: RecipientInputProps): JSX.Element => {
  const { resolveName, lookupAddress } = useContext(WalletContext)
  const { client } = useContext(XmtpContext)
  const router = useRouter()
  const [recipientInputMode, setRecipientInputMode] = useState(
    RecipientInputMode.InvalidEntry
  )
  const [hasName, setHasName] = useState(false)

  const checkIfOnNetwork = useCallback(
    async (address: string): Promise<boolean> => {
      return client?.canMessage(address) || false
    },
    []
  )

  const completeSubmit = useCallback(
    async (address: string, input: HTMLInputElement) => {
      if (await checkIfOnNetwork(address)) {
        onSubmit(address)
        input.blur()
        setRecipientInputMode(RecipientInputMode.Submitted)
      } else {
        setRecipientInputMode(RecipientInputMode.NotOnNetwork)
      }
    },
    [checkIfOnNetwork, onSubmit]
  )

  useEffect(() => {
    const handleAddressLookup = async (address: string) => {
      const name = await lookupAddress(address)
      setHasName(!!name)
    }
    if (recipientWalletAddress && !checkIfPathIsEns(recipientWalletAddress)) {
      setRecipientInputMode(RecipientInputMode.Submitted)
      handleAddressLookup(recipientWalletAddress)
    } else {
      setRecipientInputMode(RecipientInputMode.InvalidEntry)
    }
  }, [lookupAddress, recipientWalletAddress])

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
          await completeSubmit(address, input)
        } else {
          setRecipientInputMode(RecipientInputMode.InvalidEntry)
        }
      } else if (
        recipientValue.startsWith('0x') &&
        recipientValue.length === 42
      ) {
        await completeSubmit(recipientValue, input)
      }
    },
    [completeSubmit, resolveName]
  )

  const handleInputChange = useCallback(
    async (e: React.SyntheticEvent) => {
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
    },
    [handleSubmit, router]
  )

  return (
    <div className="flex-1 flex-col shrink justify-center flex h-[72px] bg-zinc-50 md:border-b md:border-gray-200 md:px-4 md:pb-[2px]">
      <form
        className="w-full flex pl-2 md:pl-0 h-8 pt-1"
        action="#"
        method="GET"
        onSubmit={handleSubmit}
      >
        <label htmlFor="recipient-field" className="sr-only">
          Recipient
        </label>
        <div className="relative w-full text-n-300 focus-within:text-n-600">
          <div className="absolute top-1 left-0 flex items-center pointer-events-none text-md md:text-sm font-medium md:font-semibold">
            To:
          </div>
          <AddressInput
            recipientWalletAddress={recipientWalletAddress}
            id="recipient-field"
            className="block w-[95%] pl-7 pr-3 pt-[3px] md:pt-[2px] md:pt-[1px] bg-transparent caret-n-600 text-n-600 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent text-lg font-mono"
            name="recipient"
            onInputChange={handleInputChange}
          />
          <button type="submit" className="hidden" />
        </div>
      </form>

      {recipientInputMode === RecipientInputMode.Submitted ? (
        <div className="text-md text-n-300 text-sm font-mono ml-10 md:ml-8 pb-1 md:pb-[1px]">
          {hasName ? recipientWalletAddress : <br />}
        </div>
      ) : (
        <div className="text-sm md:text-xs text-n-300 ml-[29px] pl-2 md:pl-0 pb-1 md:pb-[3px]">
          {recipientInputMode === RecipientInputMode.NotOnNetwork &&
            'Recipient is not on the XMTP network'}
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
