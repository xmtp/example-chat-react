import loaderStyles from '../styles/Loader.module.css'

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

  // This feels janky af, but I'm gonna run with it rather than import some bloated library just to make a spinner.
  return (
    <div className={loaderStyles['lds-roller']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
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
