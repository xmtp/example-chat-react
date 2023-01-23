import React from 'react'
import { Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useRouter } from 'next/router'

type NavigationViewProps = {
  show: boolean
  children?: React.ReactNode
}

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
            <div className="relative flex flex-col flex-1 w-full bg-white">
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

export const ReactNavigationView = ({ children }) => {
  return <NavigationView show={true}>{children}</NavigationView>
}

const NextNavigationView = ({ children }) => {
  const router = useRouter()
  const show = router.pathname === '/'
  return <NavigationView show={show}>{children}</NavigationView>
}

export default NextNavigationView
