import { classNames } from '../helpers'
import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon, FilterIcon } from '@heroicons/react/solid'
import ConversationFilterSlideOver from './ConversationFilterSlideOver'
import LitJsSdk from 'lit-js-sdk'

import useCyberConnect from '../hooks/useCyberConnect'

export default function ConversationFilter() {
  const { filterBy, updateFilterBy } = useCyberConnect()
  const items = ['friends', 'followings', 'followers', 'all']
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!filterBy) {
      updateFilterBy(items[0])
    }
  })
  return (
    <div className="w-full">
      <div className="flex justify-between w-full py-2 bg--300">
        <div className="flex justify-between flex-1">
          <Listbox value={filterBy} onChange={updateFilterBy}>
            {({ open }) => (
              <>
                <Listbox.Label className="flex items-center w-6 mr-2 text-sm font-medium text-gray-700"></Listbox.Label>
                <div className="relative w-40">
                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <span className="block truncate">{filterBy}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {items.map((name) => (
                        <Listbox.Option
                          key={name}
                          className={({ active }) =>
                            classNames(
                              active ? 'text-white bg-p-600' : 'text-gray-900',
                              'cursor-pointer select-none relative py-2 pl-3 pr-9'
                            )
                          }
                          value={name}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? 'font-semibold' : 'font-normal',
                                  'block truncate'
                                )}
                              >
                                {name}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? 'text-white' : 'text-indigo-600',
                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                  )}
                                >
                                  <CheckIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center p-1 text-xs text-indigo-500 border-0 hover:text-indigo-700"
        >
          <FilterIcon className="w-6 h-6 " aria-hidden="true" />
        </button>
      </div>
      <ConversationFilterSlideOver onClose={() => setOpen(false)} open={open} />
    </div>
  )
}
