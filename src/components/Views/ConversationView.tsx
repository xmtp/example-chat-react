import React from 'react'

type ConversationViewProps = React.PropsWithChildren<{
  show: boolean
}>

const ConversationView = ({
  children,
  show,
}: ConversationViewProps): JSX.Element => {
  return (
    <>
      {show && (
        <div className="md:hidden inset-0 flex flex-col h-screen bg-white ">
          <div className="md:hidden relative flex-1 flex flex-col w-full">
            {children}
          </div>
        </div>
      )}

      {/* Always show in desktop layout */}
      <div className="hidden md:bg-white md:pl-84 md:flex md:flex-col md:flex-1 md:h-screen md:overflow-y-auto">
        {children}
      </div>
    </>
  )
}

export default ConversationView
