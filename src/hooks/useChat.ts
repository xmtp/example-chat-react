import { useContext } from 'react'
import XmtpContext from '../contexts/xmtp'

const useChat = () => useContext(XmtpContext)
export default useChat
