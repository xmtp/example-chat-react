import { useContext } from 'react'
import {
  CyberConnectContextType,
  CyberConnectContext,
} from '../contexts/cyberConnect'

const useCyberConnect = (): CyberConnectContextType => {
  const context = useContext(CyberConnectContext)
  if (context === undefined) {
    throw new Error(
      'useCyberConnect must be used within an CyberConnectProvider'
    )
  }
  return context
}

export default useCyberConnect
