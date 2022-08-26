import { useContext } from 'react'
import { XmtpContextType, XmtpContext } from '../contexts/xmtp'

const useXmtp = (): XmtpContextType => {
  const context = useContext(XmtpContext)
  if (context === undefined) {
    throw new Error('useXmtp must be used within an XmtpProvider')
  }
  return context
}

export default useXmtp
