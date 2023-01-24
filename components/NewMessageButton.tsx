const NewMessageButton = ({ onClick }): JSX.Element => {
  const onNewMessageButtonClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // router.push('/dm/')
    onClick()
  }

  return (
    <button
      className="inline-flex items-center px-4 py-1 my-4 text-sm tracking-wide text-white border rounded h-7 md:h-6 bg-p-400 border-p-300 hover:bg-p-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:ring-offset-p-600 focus-visible:border-n-100 focus-visible:outline-none active:bg-p-500 active:border-p-500 active:ring-0 md:text-xs md:font-semibold"
      onClick={onClick || onNewMessageButtonClick}
    >
      + New Message
    </button>
  )
}

export default NewMessageButton
