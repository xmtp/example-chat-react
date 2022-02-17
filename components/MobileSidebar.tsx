import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

type MobileSidebarProps = {
  setSidebarOpen: (open: boolean) => void
  sidebarOpen: boolean
  children?: React.ReactNode
}

const MobileSidebar = ({
  setSidebarOpen,
  sidebarOpen,
  children,
}: MobileSidebarProps): JSX.Element => {
  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 flex z-40 md:hidden"
        onClose={setSidebarOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>
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
      </Dialog>
    </Transition.Root>
  )
}

export default MobileSidebar
