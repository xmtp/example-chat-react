import React from 'react'
import { useState, useContext, useCallback, useEffect } from 'react'
import AddressInput from '../AddressInput'
import XmtpContext from '../../contexts/xmtp'
import useLookup from '../../hooks/useLookup'

type RecipientInputProps = {
  value: string | undefined
  onSubmit: (address: string) => void
}

const RecipientControl = ({
  value,
  onSubmit,
}: RecipientInputProps): JSX.Element => {
  const { client } = useContext(XmtpContext)
  const {
    data: { name },
  } = useLookup(value)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (value) setError(undefined)
    return () => setError(undefined)
  }, [value])

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const address = e.target.value
      if (!address.startsWith('0x'))
        return setError(new Error('Please enter a valid wallet address'))
      if (address.length !== 42)
        return setError(new Error('Please enter a valid wallet address'))

      const onNetwork = client ? await client.canMessage(address) : false
      if (!onNetwork)
        return setError(new Error('Recipient is not on the XMTP network'))

      onSubmit(address)
      e.target.blur()
    },
    [onSubmit, client]
  )

  return (
    <div className="flex-1 flex-col shrink justify-center flex h-[10vh] max-h-20 bg-zinc-50 md:border-b md:border-gray-200 md:px-4 md:pb-[2px]">
      <div className="w-full flex pl-2 md:pl-0 h-8 pt-1">
        <div className="relative w-full text-n-300">
          <div className="absolute top-1 left-0 flex items-center pointer-events-none text-md md:text-sm font-medium md:font-semibold">
            To:
          </div>
          {value ? (
            <span className="absolute top-[4px] md:top-[2px] left-[26px] md:left-[23px] rounded-2xl px-[5px] md:px-2 border text-md focus:outline-none focus:ring-0 font-bold font-mono overflow-visible text-center bg-zinc-50 border-gray-300">
              {name || value}
            </span>
          ) : (
            <AddressInput
              id="recipient"
              name="recipient"
              value={value}
              onChange={handleInputChange}
            />
          )}
        </div>
      </div>

      <div className="text-sm md:text-xs text-n-300 ml-[29px] pl-2 md:pl-0 pb-1 md:pb-[3px]">
        {error && error.message}
      </div>
    </div>
  )
}

export default RecipientControl
