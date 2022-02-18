type NewMessageButtonProps = {
  onClickNewMessageButton: () => void
}

const NewMessageButton = ({
  onClickNewMessageButton,
}: NewMessageButtonProps): JSX.Element => {
  return (
    <button
      className="inline-flex items-center h-6 px-4 py-1 my-4 bg-p-400 border border-p-300 hover:bg-p-300 focus:ring-2 focus:ring-offset-2 focus:ring-n-100 focus:ring-offset-p-600 focus:border-n-100 text-xs font-semibold tracking-wide text-white rounded"
      onClick={onClickNewMessageButton}
    >
      + New Message
    </button>
  )
}

export default NewMessageButton
