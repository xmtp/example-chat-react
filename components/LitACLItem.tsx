import { useState } from 'react'
import Selector from './Selector'
import { MinusCircleIcon } from '@heroicons/react/solid'

export default function LitACLItem(props) {
  const contractTypeItems = [
    { id: 'ETH', name: 'ETH' },
    { id: 'ERC20', name: 'ERC20' },
    { id: 'ERC721', name: 'ERC721' },
    { id: 'ERC777', name: 'ERC777' },
    { id: 'ERC1155', name: 'ERC1155' },
  ]
  const selected = {
    id: props.contractType,
    name: props.contractType,
  }

  return (
    <div className="flex items-center justify-between">
      <div className="w-28">
        <Selector
          items={contractTypeItems}
          selected={selected}
          onSelected={(item) =>
            props.onUpdate({ key: 'contractType', value: item.id })
          }
        ></Selector>
      </div>
      <input
        type="text"
        value={props.contractAddress}
        onChange={(e) =>
          props.onUpdate({ key: 'contractAddress', value: e.target.value })
        }
        disabled={props.contractType === 'ETH'}
        name="contractAddress"
        placeholder="contract address"
        className="flex-1 block mx-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
      />
      <input
        type="text"
        value={props.comparator}
        name="comparator"
        onChange={(e) =>
          props.onUpdate({ key: 'comparator', value: e.target.value })
        }
        placeholder="comparator, must be one of <, <=, =, >=, >"
        className="flex-1 block mx-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
      <input
        name="number"
        type="number"
        value={props.number}
        onChange={(e) =>
          props.onUpdate({ key: 'number', value: e.target.value })
        }
        placeholder="number"
        className="block w-40 mx-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
      <MinusCircleIcon
        className="w-6 h-6 text-red-500 hover:cursor-pointer"
        onClick={() => props.onDelete()}
      />
    </div>
  )
}