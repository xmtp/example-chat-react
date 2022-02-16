import { Menu, Transition } from '@headlessui/react'
import { CogIcon } from '@heroicons/react/solid'
import { Fragment, useCallback } from 'react'
import { classNames } from '../helpers'
import Address from './Address'
import { useWallet } from './WalletContext'
import { useXmtp } from './XmtpContext'

type UserMenuProps = {
  onConnect: () => Promise<void>
  onDisconnect: () => Promise<void>
}

const UserMenu = ({ onConnect, onDisconnect }: UserMenuProps): JSX.Element => {
  const { walletAddress } = useXmtp()
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
              {/* TODO: ENS profile photo */}
              <div className={classNames(open ? 'opacity-75' : '')}>
                <div className="flex items-center">
                  <div className="bg-g-100 rounded h-2 w-2 mr-1"></div>
                  <p className="text-sm font-bold text-g-100">Connected as:</p>
                </div>
                <Address
                  address={walletAddress}
                  className="text-sm font-semibold text-white ml-3"
                  lookupAddress={lookupAddress}
                />
              </div>
              <div>
                <Menu.Button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none">
                  <span className="sr-only">Open user menu</span>
                  <CogIcon
                    className={classNames(
                      open
                        ? 'h-8 w-8 fill-white'
                        : 'h-8 w-8 fill-n-100 hover:fill-n-200'
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
                <Menu.Items className="origin-bottom-right absolute right-0 bottom-12 mb-4 w-40 rounded-md shadow-lg bg-white divide-y-2 divide-n-20 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={onClickCopy}
                          className={classNames(
                            active ? 'bg-n-20' : '',
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
                            active ? 'bg-n-20 cursor-pointer' : '',
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
        <>
          <div>
            <div className="flex items-center">
              <div className="bg-y-100 rounded-full h-2 w-2 mr-1"></div>
              <p className="text-sm font-bold text-y-100">
                You are not connected.
              </p>
            </div>
            <p className="text-sm font-normal text-y-100 ml-3">
              Sign in with your wallet
            </p>
          </div>
          <button
            className="max-w-xs flex items-center text-sm rounded focus:outline-none"
            onClick={onConnect}
          >
            <span className="sr-only">Connect</span>
            <CogIcon
              className="h-8 w-8 fill-n-100 hover:fill-n-200"
              aria-hidden="true"
            />
          </button>
        </>
      )}
    </div>
  )
}

export default UserMenu
