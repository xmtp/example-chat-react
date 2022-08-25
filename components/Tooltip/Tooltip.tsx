import { ReactNode } from 'react'

export const Tooltip = ({
  message,
  children,
}: {
  message: string
  children: ReactNode
}) => {
  return (
    <div className="relative flex flex-col items-center group">
      {children}
      <div className="w-32 absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex">
        <span className="relative z-10 p-2 text-sm leading-none text-white whitespace-no-wrap bg-gray-900 shadow-lg rounded-md">
          {message}
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-gray-900"></div>
      </div>
    </div>
  )
}
