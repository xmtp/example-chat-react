import React, { createRef } from 'react'
import { Conversation, RecipientControl } from './Conversation'
import NavigationPanel from './NavigationPanel'
import { useCallback, useContext, useEffect, useState } from 'react'
import XmtpContext from '../contexts/xmtp'
import {
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  useDimensions,
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import useThemeBackground from '../hooks/useThemeBackground'

type Props = {
  recipient?: string
}

type AddressInputProps = {
  recipient?: string
  onCancel: () => void
  onSubmit: (address: string) => void
}

type NavbarProps = AddressInputProps & {
  createMode: boolean
  onCreate: () => void
}

const AddressInput = ({ onCancel, onSubmit, recipient }: AddressInputProps) => (
  <Flex alignItems="center" padding="4">
    <Link onClick={onCancel} marginRight="2">
      <ChevronLeftIcon width="20" />
    </Link>
    <RecipientControl value={recipient} onSubmit={onSubmit} />
  </Flex>
)

const Navbar = ({ createMode, onCreate, ...addressInputProps }: NavbarProps) =>
  createMode ? (
    <AddressInput {...addressInputProps} />
  ) : (
    <Flex justifyContent="space-between" padding="3" alignItems="center">
      <Heading size="md">Messages</Heading>
      <Button size="sm" onClick={onCreate}>
        + New
      </Button>
    </Flex>
  )

const Layout: React.FC<Props> = ({ recipient: originalRecipient }) => {
  const { client, signer, recipient, setRecipient } = useContext(XmtpContext)
  const [createMode, setCreateMode] = useState<boolean>(false)
  const backgroundColor = useThemeBackground()
  const ref = createRef<HTMLDivElement>()
  const dimensions = useDimensions(ref, true)

  const reset = useCallback(() => {
    setRecipient(undefined)
    setCreateMode(false)
  }, [setRecipient])

  const edit = useCallback(() => {
    reset()
    setCreateMode(true)
  }, [reset, setCreateMode])

  const selectRecipient = useCallback(
    (address: string) => {
      reset()
      setRecipient(address)
    },
    [reset, setRecipient]
  )

  useEffect(() => {
    setRecipient(originalRecipient)
  }, [setRecipient, originalRecipient])

  const menuWidth = 350
  const width = (dimensions && dimensions.contentBox.width) || '100vw'
  const height = (dimensions && dimensions.contentBox.height) || '100vh'

  const largeView = width >= menuWidth * 2.5 // Content should be at least 1.5x larger than menu (aka: 875px)
  const shouldDisplayNavbar = !recipient || largeView

  return (
    <Flex
      ref={ref}
      width="full"
      height="full"
      backgroundColor={backgroundColor}
    >
      {shouldDisplayNavbar && (
        <Flex
          direction="column"
          borderRight={largeView ? '1px' : 0}
          borderRightColor="inherit"
          overflowY="auto"
          height={height}
          width={largeView ? menuWidth : 'full'}
          minWidth={menuWidth}
        >
          <Navbar
            createMode={createMode}
            onCancel={reset}
            onCreate={edit}
            onSubmit={selectRecipient}
            recipient={recipient}
          />
          <Divider />
          <NavigationPanel />
        </Flex>
      )}

      {signer && client && (recipient || largeView) && (
        <Flex direction="column" height={height} width="full">
          <AddressInput
            onCancel={reset}
            onSubmit={selectRecipient}
            recipient={recipient}
          />
          <Divider />
          <Conversation />
        </Flex>
      )}
    </Flex>
  )
}

export default Layout
