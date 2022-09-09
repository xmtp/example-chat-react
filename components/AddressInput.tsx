import React, { InputHTMLAttributes } from 'react'

const AddressInput = (
  props: InputHTMLAttributes<HTMLInputElement>
): JSX.Element => {
  return (
    <input
      {...props}
      className="block w-[95%] pl-7 pr-3 pt-[3px] md:pt-[2px] md:pt-[1px] bg-transparent caret-n-600 text-n-600 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent text-lg font-mono absolute top-0 left-0 !text-md font-bold top-[2px] left-1"
      autoComplete="off"
      autoFocus
    />
  )
}

export default AddressInput
