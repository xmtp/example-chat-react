import { Transition } from '@headlessui/react'
import { Fragment } from 'react'

type NavigationViewProps = React.PropsWithChildren<{
  show: boolean
}>

const NavigationView = ({
  children,
  show,
}: NavigationViewProps): JSX.Element => {
  return (
    <>
      <Transition.Root show={show} as={Fragment}>
        <div className="fixed inset-0 flex bg-white md:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col w-full bg-white">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Transition.Root>

      {/* Always show in desktop layout */}
      <div className="hidden md:flex">{children}</div>
    </>
  )
}

export default NavigationView
