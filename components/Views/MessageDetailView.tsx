import { Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useRouter } from 'next/router'

type MessageDetailViewProps = {
  children?: React.ReactNode
}

const MessageDetailView = ({
  children,
}: MessageDetailViewProps): JSX.Element => {
  const router = useRouter()
  const show = router.pathname !== '/'

  return (
    <>
      <Transition.Root show={show} as={Fragment}>
        <div className="inset-0 flex md:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="relative flex-1 flex flex-col w-full bg-white">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Transition.Root>

      {/* Always show in desktop layout */}
      <div className="hidden md:pl-84 md:flex md:flex-col md:flex-1 md:h-screen">
        {children}
      </div>
    </>
  )
}

export default MessageDetailView
