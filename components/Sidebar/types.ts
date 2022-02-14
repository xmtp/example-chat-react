import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'
import { NextRouter } from 'next/router'

export interface SidebarProps {
  conversations: Conversation[]
  router: NextRouter
}
