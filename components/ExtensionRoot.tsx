import React from 'react'
import { WagmiConfig } from 'wagmi'
import { wagmiClient } from '../helpers/ethereumClient'

import { ExtensionLayout } from './extension/ExtensionLayout'

function ExtensionRoot({ children }: { children?: React.ReactNode }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ExtensionLayout>{children}</ExtensionLayout>
    </WagmiConfig>
  )
}

export default ExtensionRoot
