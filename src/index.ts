// Hack for https://github.com/xmtp/xmtp-js/issues/189
import { StorageMock } from './StorageMock'
if (typeof localStorage === 'undefined' || localStorage === null) {
  global.localStorage = new StorageMock()
}

import { XmtpProvider } from './components/XmtpProvider'
import Layout from './components/Layout'
import _useChat from './hooks/useChat'

export type { Account } from './contexts/xmtp'

export const Chat = Layout
export const ChatProvider = XmtpProvider
export const useChat = _useChat
