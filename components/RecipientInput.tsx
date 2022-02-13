import { SearchIcon } from '@heroicons/react/outline';
import { NextRouter, useRouter } from 'next/router';
import { useCallback } from 'react';

type RecipientInputProps = {
	recipientWalletAddress?: string;
	setRecipientWalletAddress: (recipient: string) => void;
	router: NextRouter;
};

const RecipientInput = ({ recipientWalletAddress, setRecipientWalletAddress }: RecipientInputProps): JSX.Element => {
	const router = useRouter();
	const handleRecipientChange = useCallback(
		(e: React.SyntheticEvent) => {
			const data = e.target as typeof e.target & {
				value: string;
			};
			setRecipientWalletAddress(data.value);
		},
		[setRecipientWalletAddress]
	);

	const onSubmit = useCallback(
		(e: React.SyntheticEvent) => {
			e.preventDefault();
			const data = e.target as typeof e.target & {
				recipient: { value: string };
			};
			if (!data.recipient) return;
			router.push(`/dm/${data.recipient.value}`);
		},
		[router]
	);

	return (
		<div className="flex-1 flex">
			<form className="w-full flex md:ml-0" action="#" method="GET" onSubmit={onSubmit}>
				<label htmlFor="recipient-field" className="sr-only">
					Recipient
				</label>
				<div className="relative w-full text-gray-400 focus-within:text-gray-600">
					<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
						<SearchIcon className="h-5 w-5" aria-hidden="true" />
					</div>
					<input
						id="recipient-field"
						className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
						placeholder="Ethereum address or ENS name"
						type="recipient"
						name="recipient"
						onChange={handleRecipientChange}
						value={recipientWalletAddress}
					/>
					<button type="submit" className="hidden" />
				</div>
			</form>
		</div>
	);
};

export default RecipientInput;
