import React from 'react'

type NavigationViewProps = React.PropsWithChildren<{
  show: boolean
}>

const NavigationView = ({
  children,
  show,
}: NavigationViewProps): JSX.Element => {
  return (
    <>
      {show && (
        <div className="fixed inset-0 flex bg-white md:hidden">
          <div className="relative flex-1 flex flex-col w-full bg-white">
            {children}
          </div>
        </div>
      )}

      {/* Always show in desktop layout */}
      <div className="hidden md:flex">{children}</div>
    </>
  )
}

export default NavigationView
