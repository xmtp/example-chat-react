import React from 'react'
import { ChatIcon } from '@heroicons/react/outline'

export const NoConversationsMessage = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-grow justify-center h-[100%]">
      <div className="flex flex-col items-center px-4 text-center">
        <ChatIcon
          className="w-8 h-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl font-bold md:text-lg text-n-200 md:text-n-300">
          Your message list is empty
        </p>
        <p className="font-normal text-lx md:text-md text-n-200">
          There are no messages for this address
        </p>
      </div>
    </div>
  )
}
