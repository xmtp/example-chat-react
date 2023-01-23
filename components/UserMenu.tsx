import { Menu, Transition } from '@headlessui/react'
import { CogIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'

import { classNames, tagStr } from '../helpers'
import Blockies from 'react-blockies'
import Address from './Address'
import useEns from '../hooks/useEns'
import { Tooltip } from './Tooltip/Tooltip'
import packageJson from '../package.json'
import { useAppStore } from '../store/app'

type UserMenuProps = {
  onConnect?: () => Promise<void>
  onDisconnect?: () => Promise<void>
}

type AvatarBlockProps = {
  walletAddress: string
  avatarUrl?: string
}

const AvatarBlock = ({ walletAddress }: AvatarBlockProps) => {
  const { avatarUrl, loading } = useEns(walletAddress)
  if (loading) {
    return (
      <div className="flex animate-pulse">
        <div className="w-8 h-8 mr-2 rounded-full bg-n-200" />
      </div>
    )
  }
  return avatarUrl ? (
    <div>
      <div className="w-8 h-8 mr-2 border rounded-full border-n-80" />
      <img
        className={'rounded-full h-8 w-8 -mt-8'}
        src={avatarUrl}
        alt={walletAddress}
      />
    </div>
  ) : (
    <Blockies
      seed={walletAddress.toLowerCase()}
      scale={4}
      size={8}
      className="rounded-full mr-2"
    />
  )
}

const NotConnected = ({ onConnect }: UserMenuProps): JSX.Element => {
  return (
    <>
      <div>
        <div className="flex items-center">
          <div className="w-2 h-2 mr-1 rounded-full bg-y-100"></div>
          <p className="text-sm font-bold text-y-100">You are not connected.</p>
        </div>

        <a onClick={onConnect}>
          <p className="ml-3 text-sm font-normal cursor-pointer text-y-100 hover:text-y-200">
            Sign in with your wallet
          </p>
        </a>
      </div>
      <button
        className="flex items-center max-w-xs text-sm rounded focus:outline-none"
        onClick={onConnect}
      >
        <span className="sr-only">Connect</span>
        <CogIcon
          className="w-6 h-6 md:h-5 md:w-5 fill-n-100 hover:fill-n-200"
          aria-hidden="true"
        />
      </button>
    </>
  )
}

const UserMenu = ({ onConnect, onDisconnect }: UserMenuProps): JSX.Element => {
  const walletAddress = useAppStore((state) => state.address)

  const onClickCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
    }
  }

  return (
    <div
      className={`flex ${
        tagStr() ? 'bg-p-600' : 'bg-n-500'
      } items-center justify-between rounded-lg max-h-16 min-h-[4rem] px-4 py-2 m-2 mt-0 drop-shadow-xl`}
    >
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
                {walletAddress ? (
                  <>
                    <AvatarBlock walletAddress={walletAddress} />
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div className="w-2 h-2 mr-1 rounded bg-g-100"></div>
                        <p className="text-sm font-bold text-g-100">
                          Connected as:
                        </p>
                      </div>
                      <Address
                        address={walletAddress}
                        className="ml-3 font-semibold leading-4 text-white text-md"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-center flex-1 h-14">
                    <div className="flex items-center">
                      <div className="w-2 h-2 mr-1 rounded bg-p-100"></div>
                      <p className="text-sm font-bold text-p-100">
                        Connecting...
                      </p>
                    </div>
                    <p className="ml-3 text-sm font-normal text-p-100">
                      Verifying your wallet
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {tagStr() && (
                  <Tooltip message="You are connected to the dev network">
                    <div className="p-1 mr-1 text-sm font-bold rounded cursor-pointer bg-p-200">
                      {tagStr()}
                    </div>
                  </Tooltip>
                )}
                <div>
                  <Menu.Button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <CogIcon
                      className={classNames(
                        open ? 'fill-white' : '',
                        'h-6 w-6 md:h-5 md:w-5 fill-n-100 hover:fill-n-200'
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
                  <Menu.Items className="absolute right-0 w-40 mb-4 origin-bottom-right bg-white divide-y-2 rounded-md shadow-lg bottom-12 divide-zinc-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        <span className="block px-2 py-2 text-sm font-normal text-right rounded-md text-n-600">
                          xmtp-js v
                          {packageJson.dependencies['@xmtp/xmtp-js'].substring(
                            1
                          )}
                        </span>
                      </Menu.Item>
                    </div>
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
              </div>
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
