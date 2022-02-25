import { Menu, Transition } from '@headlessui/react'
import { CogIcon } from '@heroicons/react/solid'
import { Fragment, useCallback } from 'react'
import { classNames } from '../helpers'
import Blockies from 'react-blockies'
import Address from './Address'
import useWallet from '../hooks/useWallet'
import useXmtp from '../hooks/useXmtp'

type UserMenuProps = {
  onConnect?: () => Promise<void>
  onDisconnect?: () => Promise<void>
}

type AvatarBlockProps = {
  walletAddress: string
}

const AvatarBlock = ({ walletAddress }: AvatarBlockProps) => (
  <Blockies seed={walletAddress} size={8} className="rounded-full mr-2" />
)

const NotConnected = ({ onConnect }: UserMenuProps): JSX.Element => {
  return (
    <>
      <div>
        <div className="flex items-center">
          <div className="bg-y-100 rounded-full h-2 w-2 mr-1"></div>
          <p className="text-sm font-bold text-y-100">You are not connected.</p>
        </div>

        <a onClick={onConnect}>
          <p className="text-sm font-normal text-y-100 hover:text-y-200 ml-3 cursor-pointer">
            Sign in with your wallet
          </p>
        </a>
      </div>
      <button
        className="max-w-xs flex items-center text-sm rounded focus:outline-none"
        onClick={onConnect}
      >
        <span className="sr-only">Connect</span>
        <CogIcon
          className="h-4 w-4 fill-n-100 hover:fill-n-200"
          aria-hidden="true"
        />
      </button>
    </>
  )
}

const UserMenu = ({ onConnect, onDisconnect }: UserMenuProps): JSX.Element => {
  const { walletAddress, client } = useXmtp()
  const { lookupAddress } = useWallet()

  const onClickCopy = useCallback(() => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
    }
  }, [walletAddress])

  return (
    <div className="flex bg-n-500 items-center justify-between rounded-lg h-14 m-4 px-4 drop-shadow-xl">
      {walletAddress ? (
        <Menu>
          {({ open }) => (
            <>
              <div
                className={classNames(
                  open ? 'opacity-75' : '',
                  'flex items-center'
                )}
              >
                {client ? (
                  <>
                    <AvatarBlock walletAddress={walletAddress} />
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div className="bg-g-100 rounded h-2 w-2 mr-1"></div>
                        <p className="text-sm font-bold text-g-100">
                          Connected as:
                        </p>
                      </div>
                      <Address
                        address={walletAddress}
                        className="text-sm font-semibold text-white ml-3"
                        lookupAddress={lookupAddress}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div className="bg-p-100 rounded h-2 w-2 mr-1"></div>
                        <p className="text-sm font-bold text-p-100">
                          Connecting...
                        </p>
                      </div>
                      <p className="text-sm font-normal text-p-100 ml-3">
                        Verifying your wallet
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div>
                <Menu.Button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none">
                  <span className="sr-only">Open user menu</span>
                  <CogIcon
                    className={classNames(
                      open ? 'fill-white' : '',
                      'h-4 w-4 fill-n-100 hover:fill-n-200'
                    )}
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-bottom-right absolute right-0 bottom-12 mb-4 w-40 rounded-md shadow-lg bg-white divide-y-2 divide-zinc-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={onClickCopy}
                          className={classNames(
                            active ? 'bg-zinc-50' : '',
                            'block rounded-md px-2 py-2 text-sm text-n-600 text-right font-normal cursor-pointer'
                          )}
                        >
                          Copy wallet address
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={onDisconnect}
                          className={classNames(
                            active ? 'bg-zinc-50 cursor-pointer' : '',
                            'block rounded-md px-2 py-2 text-sm text-l-300 text-right font-semibold'
                          )}
                        >
                          Disconnect wallet
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      ) : (
        <NotConnected onConnect={onConnect} />
      )}
    </div>
  )
}

export default UserMenu
