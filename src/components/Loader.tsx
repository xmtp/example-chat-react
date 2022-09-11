import SpinnerIcon from '@heroicons/react/outline/RefreshIcon'
import React from 'react'

type LoaderProps = {
  isLoading: boolean
}

type StyledLoaderProps = {
  headingText: string
  subHeadingText: string
  isLoading: boolean
}

export const Spinner = ({ isLoading }: LoaderProps): JSX.Element | null => {
  if (!isLoading) {
    return null
  }
  return (
    <div className="flex justify-center">
      <SpinnerIcon
        className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300 animate-spin"
        style={{
          animationDirection: 'reverse',
        }}
      />
    </div>
  )
}

export const Loader = ({
  headingText,
  subHeadingText,
  isLoading,
}: StyledLoaderProps): JSX.Element => (
  <div className="grid place-items-center h-full">
    <div className="columns-1 text-center">
      <Spinner isLoading={isLoading} />
      <div className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
        {headingText}
      </div>
      <div className="text-lx md:text-md text-n-200 font-normal">
        {subHeadingText}
      </div>
    </div>
  </div>
)

export default Loader
