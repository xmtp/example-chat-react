import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Message } from "xmtp-js";
import { useXmtp } from "../components/XmtpContext";

const Home: NextPage = () => {
  const { client, user } = useXmtp();
  const [messages, setMessages] = useState<Message[]>();

  const messagesEndRef = useRef(null);

  const scrollToMessagesEndRef = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (messagesEndRef.current as any)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const streamMessages = async () => {
      if (!client || !user) return;
      // Stream from self for now
      const stream = client.streamMessages(
        user.identityKey.publicKey.walletSignatureAddress(),
        user
      );
      for await (const msg of stream.iterator) {
        console.log("msg", msg);

        setMessages((messages) => [...(messages || []), msg]);
        scrollToMessagesEndRef();
      }
    };
    streamMessages();
  }, [user, client]);

  const handleSend = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!client || !user) return;

    const data = e.target as typeof e.target & {
      recipient: { value: string };
      content: { value: string };
    };

    const recipient = await client.getPublicKeyBundle(data.recipient.value);
    if (!recipient) {
      // TODO: populate page error or in-page alert here instead of throwing an error
      throw new Error("recipient not found");
    }
    await client.sendMessage(user, recipient, data.content.value);
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <form onSubmit={handleSend}>
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <pre>
              You (address):{" "}
              {user.identityKey.publicKey.walletSignatureAddress()}
            </pre>
          </div>
        </div>
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div>
              <label
                htmlFor="recipient"
                className="block text-sm font-medium text-gray-700"
              >
                Recipient
              </label>
              <input
                type="text"
                name="recipient"
                id="recipient"
                autoComplete="recipient"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="content"
                  name="content"
                  // rows="3"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send
            </button>
          </div>
        </div>
      </form>
      <div className="w-full flex flex-col">
        {/* <div className="relative flex items-center p-3 border-b border-gray-300">
          <img
            className="object-cover w-10 h-10 rounded-full"
            src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
            alt="username"
          />
          <span className="block ml-2 font-bold text-gray-600">Emma</span>
          <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
        </div> */}

        {/* <div className="flex-1"></div> */}

        <div className="relative w-full p-6 overflow-y-auto flex">
          <ul className="space-y-2">
            {messages?.map((msg: Message, index: number) => (
              <li key={index} className="flex justify-end">
                <div className="relative max-w-xl px-4 py-2 mb-2 text-gray-700 bg-white rounded shadow">
                  <span className="block">{msg.decrypted}</span>
                </div>
              </li>
            ))}
            <div ref={messagesEndRef} />
            {/* <li className="flex justify-start">
              <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-white rounded shadow">
                <span className="block">Hi</span>
              </div>
            </li>
            <li className="flex justify-end">
              <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-white bg-gray-100 rounded shadow">
                <span className="block">Hiiii</span>
              </div>
            </li>
            <li className="flex justify-end">
              <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-white bg-gray-100 rounded shadow">
                <span className="block">how are you?</span>
              </div>
            </li>
            <li className="flex justify-start">
              <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-white rounded shadow">
                <span className="block">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.{" "}
                </span>
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
