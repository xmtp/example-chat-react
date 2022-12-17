import React, { useEffect, useState, useRef, useCallback } from 'react'
import { checkIfPathIsEns, classNames } from '../helpers'
import useEnsHooks from '../hooks/useEnsHooks'
import { useAppStore } from '../store/app'

type AddressInputProps = {
  recipientWalletAddress?: string
  id?: string
  name?: string
  className?: string
  placeholder?: string
  onInputChange?: (e: React.SyntheticEvent) => Promise<void>
}

const AddressInput = ({
  recipientWalletAddress,
  id,
  name,
  className,
  placeholder,
  onInputChange,
}: AddressInputProps): JSX.Element => {
  const { lookupAddress } = useEnsHooks()
  const walletAddress = useAppStore((state) => state.address)
  const inputElement = useRef(null)
  const [value, setValue] = useState<string>(recipientWalletAddress || '')
  const conversations = useAppStore((state) => state.conversations)
  const setConversations = useAppStore((state) => state.setConversations)
  const client = useAppStore((state) => state.client)

  const focusInputElementRef = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(inputElement.current as any)?.focus()
  }

  useEffect(() => {
    if (!recipientWalletAddress) {
      focusInputElementRef()
      setValue('')
    }
  }, [recipientWalletAddress])

  useEffect(() => {
    const setLookupValue = async () => {
      if (!lookupAddress) {
        return
      }
      if (recipientWalletAddress && !checkIfPathIsEns(recipientWalletAddress)) {
        const name = await lookupAddress(recipientWalletAddress)
        const conversation = await client?.conversations.newConversation(
          recipientWalletAddress
        )
        if (conversation) {
          conversations.set(recipientWalletAddress, conversation)
          setConversations(new Map(conversations))
        }
        if (name) {
          setValue(name)
        } else if (recipientWalletAddress) {
          setValue(recipientWalletAddress)
        }
      } else if (value.startsWith('0x') && value.length === 42) {
        const conversation = await client?.conversations.newConversation(value)
        if (conversation) {
          conversations.set(value, conversation)
          setConversations(new Map(conversations))
        }
        const name = await lookupAddress(value)
        if (name) {
          setValue(name)
        }
      }
    }
    setLookupValue()
  }, [value, recipientWalletAddress, lookupAddress])

  const userIsSender = recipientWalletAddress === walletAddress

  const recipientPillInputStyle = classNames(
    'absolute',
    'top-[4px] md:top-[2px]',
    'left-[26px] md:left-[23px]',
    'rounded-2xl',
    'px-[5px] md:px-2',
    'border',
    'text-md',
    'focus:outline-none',
    'focus:ring-0',
    'font-bold',
    'font-mono',
    'overflow-visible',
    'text-center',
    'text-transparent',
    'select-none',
    userIsSender ? 'bg-bt-100' : 'bg-zinc-50',
    userIsSender ? 'border-bt-300' : 'border-gray-300'
  )

  const onAddressChange = useCallback(
    async (event: React.SyntheticEvent) => {
      const data = event.target as typeof event.target & {
        value: string
      }
      setValue(data.value.trim())
      onInputChange && onInputChange(event)
    },
    [onInputChange]
  )

  return (
    <div className="relative mb-5">
      {recipientWalletAddress && value && (
        <span className={recipientPillInputStyle}>{value}</span>
      )}
      <input
        id={id}
        name={name}
        className={classNames(
          className || '',
          'absolute top-0 left-0',
          userIsSender ? '!text-b-600' : '',
          recipientWalletAddress ? '!text-md font-bold top-[2px] left-1' : ''
        )}
        placeholder={placeholder}
        onChange={onAddressChange}
        value={value}
        ref={inputElement}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  )
}

export default AddressInput
