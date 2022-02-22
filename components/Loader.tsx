import loaderStyles from '../styles/Loader.module.css'

type LoaderProps = {
  isLoading: boolean
}

const Loader = ({ isLoading }: LoaderProps): JSX.Element | null => {
  if (!isLoading) {
    return null
  }

  // This feels janky af, but I'm gonna run with it rather than import some bloated library just to make a spinner.
  return (
    <div className={loaderStyles.ldsRoller}>
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

export default Loader
