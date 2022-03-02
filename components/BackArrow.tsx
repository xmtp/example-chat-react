import { ChevronLeftIcon } from '@heroicons/react/outline'

type BackArrowProps = {
  onClick: () => void
}

const BackArrow = ({ onClick }: BackArrowProps): JSX.Element => (
  <button
    type="button"
    className="flex items-center justify-center h-10 w-6 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
    onClick={onClick}
  >
    <span className="sr-only">Close message view</span>
    <ChevronLeftIcon className="h-5 w-5 stroke-n-600" aria-hidden="true" />
  </button>
)

export default BackArrow
