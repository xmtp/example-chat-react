import { XmtpProvider } from './components/XmtpProvider'
import Layout from './components/Layout'
import _useChat from './hooks/useChat'

export type { Account } from './contexts/xmtp'

export const Chat = Layout
export const ChatProvider = XmtpProvider
export const useChat = _useChat
