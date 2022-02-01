import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Message, PublicKeyBundle } from "xmtp-js";
import { useXmtp } from "../../components/XmtpContext";

const Conversation: NextPage = () => {
  const router = useRouter();
  const recipientWalletAddr = router.query.recipientWalletAddr as string;
  const [recipient, setRecipient] = useState<PublicKeyBundle>();
  const { client, user } = useXmtp();
  const [messages, setMessages] = useState<Message[]>();
  const messagesEndRef = useRef(null);

  const scrollToMessagesEndRef = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (messagesEndRef.current as any)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initRecipient = async () => {
      if (!client) return;
      const recipient = await client.getUserContact(recipientWalletAddr);
      setRecipient(recipient);
      setMessages([]);
    };
    initRecipient();
  }, [client, recipientWalletAddr]);

  useEffect(() => {
    const streamMessages = async () => {
      if (!client || !user || !recipient?.identityKey) return;
      const stream = client.streamMessages(
        user.identityKey.publicKey.walletSignatureAddress(),
        recipient.identityKey.walletSignatureAddress(),
        user
      );
      for await (const msg of stream.iterator) {
        setMessages((messages) => [...(messages || []), msg]);
        scrollToMessagesEndRef();
      }
    };
    streamMessages();
  }, [user, client, recipient]);

  const handleSend = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!client || !user) return;
    if (!recipient) throw new Error("missing recipient");
    const data = e.target as typeof e.target & {
      message: { value: string };
    };
    if (!data.message) return;
    await client.sendMessage(user, recipient, data.message.value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e.target as any).reset();
  };

  if (!user || !recipient) {
    return <div />;
  }

  return (
    <div className="flex flex-col flex-1 h-screen">
      <main className="flex-grow">
        <div className="pb-6">
          <div className="w-full flex flex-col">
            <div className="relative w-full p-6 overflow-y-auto flex">
              <ul className="space-y-2 w-full">
                {messages?.map((msg: Message, index: number) => (
                  <li
                    key={index}
                    className={`flex justify-${
                      msg.senderAddress() ===
                      user.identityKey.publicKey.walletSignatureAddress()
                        ? "end"
                        : "start"
                    }`}
                  >
                    <div
                      className={`relative max-w-xl px-4 py-2 mb-2 ${
                        msg.senderAddress() ===
                        user.identityKey.publicKey.walletSignatureAddress()
                          ? "text-white bg-indigo-500"
                          : "bg-white"
                      } rounded shadow`}
                    >
                      <span className="block">{msg.decrypted}</span>
                    </div>
                  </li>
                ))}
                <div ref={messagesEndRef} />
              </ul>
            </div>
          </div>
        </div>
      </main>
      <div className="sticky bottom-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
        <form
          className="flex w-full p-3 border-t border-gray-300"
          onSubmit={handleSend}
        >
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
    </div>
  );
};

export default Conversation;
