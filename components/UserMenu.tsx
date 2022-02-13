import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/outline';
import { Signer } from 'ethers';
import { NextRouter } from 'next/router';
import { Fragment, useCallback } from 'react';
import { classNames } from '../helpers';
import Address from './Address';

type UserMenuProps = {
	walletAddress?: string;
	disconnectXmtp: () => void;
	disconnectWallet: () => Promise<void>;
	connectWallet: () => Promise<Signer | undefined>;
	router: NextRouter;
};

const UserMenu = ({
	walletAddress,
	disconnectXmtp,
	disconnectWallet,
	connectWallet,
	router,
}: UserMenuProps): JSX.Element => {
	const onDisconnect = useCallback(async () => {
		disconnectXmtp();
		await disconnectWallet();
		router.push('/');
	}, [disconnectWallet, disconnectXmtp, router]);

	const onClickCopy = useCallback(() => {
		if (walletAddress) {
			navigator.clipboard.writeText(walletAddress);
		}
	}, [walletAddress]);

	const onClickConnect = useCallback(async () => {
		await connectWallet();
	}, [connectWallet]);

	return (
		<div className="ml-4 flex items-center md:ml-6">
			<button
				type="button"
				className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				<span className="sr-only">View notifications</span>
				<BellIcon className="h-6 w-6" aria-hidden="true" />
			</button>

			{/* Profile dropdown */}
			{walletAddress ? (
				<Menu as="div" className="ml-3 relative">
					<div>
						<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none">
							<span className="sr-only">Open user menu</span>
							<Address
								address={walletAddress}
								className="inline-flex items-center justify-center px-3 py-2 text-xs font-bold leading-none text-white bg-indigo-500 rounded"
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
						<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
							<Menu.Item>
								{({ active }) => (
									<a
										onClick={onClickCopy}
										className={classNames(
											active ? 'bg-gray-100' : '',
											'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
										)}
									>
										Copy address
									</a>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<a
										onClick={onDisconnect}
										className={classNames(
											active ? 'bg-gray-100 cursor-pointer' : '',
											'block px-4 py-2 text-sm text-gray-700'
										)}
									>
										Disconnect
									</a>
								)}
							</Menu.Item>
						</Menu.Items>
					</Transition>
				</Menu>
			) : (
				<button
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-3"
					onClick={onClickConnect}
				>
					Connect
				</button>
			)}
		</div>
	);
};

export default UserMenu;
