import { Message } from '@xmtp/xmtp-js/dist/types/src';
import React, { MutableRefObject } from 'react';
import Emoji from 'react-emoji-render';

type ConversationViewProps = {
	messages: Message[];
	walletAddress: string | undefined;
	handleSend: (e: React.SyntheticEvent) => Promise<void>;
	messagesEndRef: MutableRefObject<null>;
};

type MessageComposerProps = Pick<ConversationViewProps, 'handleSend'>;

type MessageTileProps = {
	message: Message;
	isSender: boolean;
};

const MessageComposer = ({ handleSend }: MessageComposerProps): JSX.Element => (
	<div className="sticky bottom-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
		<form className="flex w-full p-3 border-t border-gray-300" onSubmit={handleSend}>
			<input
				type="text"
				placeholder="Message"
				className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-full py-2 pl-4 mr-3"
				name="message"
				required
			/>
			<button type="submit">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-8 w-8 rotate-90 text-gray-500"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
				</svg>
			</button>
		</form>
	</div>
);

const MessageTile = ({ message, isSender }: MessageTileProps): JSX.Element => (
	<div className={`flex justify-${isSender ? 'end' : 'start'}`}>
		<div
			className={`relative max-w-xl px-4 py-2 mb-2 ${
				isSender ? 'text-white bg-indigo-500' : 'bg-white'
			} rounded shadow`}
		>
			<span className="block">
				{message.error ? `Error: ${message.error?.message}` : <Emoji text={message.text || ''} />}
			</span>
		</div>
	</div>
);

const ConversationView = ({
	messages,
	walletAddress,
	handleSend,
	messagesEndRef,
}: ConversationViewProps): JSX.Element => (
	<div className="flex flex-col flex-1 h-screen">
		<main className="flex-grow">
			<div className="pb-6">
				<div className="w-full flex flex-col">
					<div className="relative w-full p-6 overflow-y-auto flex">
						<div className="space-y-2 w-full">
							{messages?.map((msg: Message, index: number) => {
								const isSender = msg.senderAddress === walletAddress;
								return <MessageTile message={msg} key={index} isSender={isSender} />;
							})}
							<div ref={messagesEndRef} />
						</div>
					</div>
				</div>
			</div>
		</main>
		{walletAddress && <MessageComposer handleSend={handleSend} />}
	</div>
);

export default ConversationView;
