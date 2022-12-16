import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useAppStore } from '../store/app'

const useDisconnect = () => {
  const router = useRouter()
  const reset = useAppStore((state) => state.reset)

  const disconnect = useCallback(() => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('xmtp')) {
        localStorage.removeItem(key)
      }
    })
    reset()
    router.push('/')
  }, [router])

  return {
    disconnect,
  }
}

export default useDisconnect
