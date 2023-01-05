import { ArrowCircleRightIcon } from '@heroicons/react/outline'
import { XCircleIcon } from '@heroicons/react/solid'
import { Dispatch, FC } from 'react'
import type { Connector } from 'wagmi'
import { useConnect, useAccount } from 'wagmi'
import useIsMounted from '../hooks/useIsMounted'
import { Modal } from './Modal'

interface Props {
  showLoginModal: boolean
  setShowLoginModal: Dispatch<boolean>
}

const WalletConnector: FC<Props> = ({ showLoginModal, setShowLoginModal }) => {
  const { connectors, error, connectAsync } = useConnect()
  const { connector: activeConnector } = useAccount()

  const { mounted } = useIsMounted()

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector })
      if (account) {
        setShowLoginModal(false)
      }
    } catch {}
  }

  return (
    <Modal
      title="Sign In"
      icon={<ArrowCircleRightIcon className="w-5 h-5 stroke-black" />}
      show={showLoginModal}
      onClose={() => {
        setShowLoginModal(false)
      }}
    >
      <div className="bg-white pt-2 px-8 pb-8 inline-block overflow-hidden space-y-3 w-full text-left align-middle transition-all transform">
        <div className="space-y-1">
          <div className="text-xl font-bold">Connect your wallet.</div>
          <div className="text-sm text-gray-500">
            Connect with one of our available wallet providers or create a new
            one.
          </div>
        </div>
        {connectors.map((connector) => {
          return (
            <button
              type="button"
              key={connector.id}
              className={`w-full flex items-center space-x-2.5 justify-center px-4 py-3 overflow-hidden rounded-xl border dark:border-gray-700/80 outline-none`}
              onClick={() => onConnect(connector)}
              disabled={
                mounted
                  ? !connector.ready || connector.id === activeConnector?.id
                  : false
              }
            >
              <span className="flex justify-center w-full">
                {mounted
                  ? connector.id === 'injected'
                    ? 'Browser Wallet'
                    : connector.name
                  : connector.name}
                {mounted ? !connector.ready && ' (unsupported)' : ''}
              </span>
            </button>
          )
        })}
        {error?.message ? (
          <div className="flex items-center justify-center space-x-1 text-red-500">
            <XCircleIcon className="w-5 h-5" />
            <div>{error?.message ?? 'Failed to connect'}</div>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

export default WalletConnector
