import { ArrowLeftIcon } from '@heroicons/react/outline'

type BackArrowProps = {
  onClick: () => void
}

const BackArrow = ({ onClick }: BackArrowProps): JSX.Element => (
  <button
    type="button"
    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
    onClick={onClick}
  >
    <span className="sr-only">Close sidebar</span>
    <ArrowLeftIcon className="h-6 w-6 stroke-n-200" aria-hidden="true" />
  </button>
)

export default BackArrow
