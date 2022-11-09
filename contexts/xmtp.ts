import { createContext } from 'react'
import { Signer } from 'ethers'

export type XmtpContextType = {
  initClient: (wallet: Signer) => void
}

export const XmtpContext = createContext<XmtpContextType>({
  initClient: () => undefined,
})

export default XmtpContext
