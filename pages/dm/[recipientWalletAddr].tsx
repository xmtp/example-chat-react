import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Message, Stream } from '@xmtp/xmtp-js';
import { useXmtp, useConversation } from '../../components/XmtpContext';
import ConversationView from '../../components/ConversationView';

const buildMessageKey = (msg: Message): string =>
	`${msg.sent}${msg.recipientAddress}${msg.senderAddress}${msg.decrypted}`;

type MessageDeduper = (message: Message) => boolean;
const buildMessageDeduper = (state: Message[]): MessageDeduper => {
	const existingMessageKeys = state.map(buildMessageKey);

	return (msg: Message) => existingMessageKeys.indexOf(buildMessageKey(msg)) === -1;
};

const Conversation: NextPage = () => {
	const router = useRouter();
	const recipientWalletAddr = router.query.recipientWalletAddr as string;
	const { walletAddress } = useXmtp();
	const conversation = useConversation(recipientWalletAddr);
	const [messages, dispatchMessages] = useReducer((state: Message[], newMessages: Message[] | undefined) => {
		// clear out messages when given undefined
		return newMessages === undefined ? [] : state.concat(newMessages.filter(buildMessageDeduper(state)));
	}, []);
	const [stream, setStream] = useState<Stream<Message>>();
	const messagesEndRef = useRef(null);

	const scrollToMessagesEndRef = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' });
	}, [messagesEndRef]);

	// Clear messages and close the stream when the recipient wallet address
	// changes.
	useEffect(() => {
		dispatchMessages(undefined);
		const closeStream = async () => {
			if (!stream) return;
			await stream.return();
		};
		closeStream();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipientWalletAddr]);

	useEffect(() => {
		const listMessages = async () => {
			if (!conversation) return;
			const msgs = await conversation.messages();
			dispatchMessages(msgs);
			scrollToMessagesEndRef();
		};
		listMessages();
	}, [conversation, scrollToMessagesEndRef]);

	useEffect(() => {
		const streamMessages = async () => {
			if (!conversation) return;
			const stream = conversation.streamMessages();
			setStream(stream);
			for await (const msg of stream) {
				dispatchMessages([msg]);
				scrollToMessagesEndRef();
			}
		};
		streamMessages();
	}, [conversation, scrollToMessagesEndRef]);

	const handleSend = useCallback(
		async (e: React.SyntheticEvent) => {
			e.preventDefault();
			if (!conversation) return;
			const data = e.target as typeof e.target & {
				message: { value: string };
			};
			if (!data.message) return;
			await conversation.send(data.message.value);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(e.target as any).reset();
		},
		[conversation]
	);

	if (!recipientWalletAddr) {
		return <div />;
	}

	return (
		<ConversationView
			messagesEndRef={messagesEndRef}
			messages={messages}
			handleSend={handleSend}
			walletAddress={walletAddress}
		/>
	);
};

export default Conversation;
