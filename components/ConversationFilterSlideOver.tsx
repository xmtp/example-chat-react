import { Fragment, useContext, useEffect, useState } from 'react'
import CyberConnectContext from '../contexts/cyberConnect'
import { chainItems } from './CyberConnectProvider'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import Selector from './Selector'
import LitACLItem from './LitACLItem'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { booleanLogicItems } from '../contexts/cyberConnect'
import LitJsSdk from 'lit-js-sdk'
import useXmtp from '../hooks/useXmtp'
import { ethers } from 'ethers'
import { union, intersection } from 'lodash'
const defaultConditionItem = {
  id: '',
  contractType: 'ERC721',
  contractAddress: '',
  comparator: '',
  number: '',
}

export default function ConversationFilterSlideOver(props) {
  const { conversations } = useXmtp()
  const [isLoading, setIsLoading] = useState(false)

  const {
    booleanLogic,
    conditionItems,
    setBooleanLogic,
    setConditionItems,
    chainItem,
    setChainItem,
    allLitValidateAddress,
    setAllLitValidateAddress,
  } = useContext(CyberConnectContext)

  const addItem = () => {
    setConditionItems([
      ...conditionItems,
      {
        ...defaultConditionItem,
        id: Date.now() + '' + Math.floor(Math.random() * 100000),
      },
    ])
  }

  const deleteItem = (id) => {
    const items = conditionItems.filter((item) => item.id !== id)
    setConditionItems(items)
  }

  const doSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const client = new LitJsSdk.LitNodeClient({
      alertWhenUnauthorized: false,
    })
    await client.connect()
    const chain = chainItem.id
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    const allAddressArr = conversations.map((item) => item.peerAddress)

    const allValidateAddress = []
    const filterResultAddressArr = await Promise.all(
      conditionItems.map(async (item) => {
        const { contractAddress, comparator, contractType } = item
        const verifiedRz = await Promise.all(
          allAddressArr.map(async (userWalletAddress) => {
            const accessControlConditions = []
            switch (contractType) {
              case 'ETH':
                accessControlConditions.push({
                  contractAddress: '',
                  standardContractType: '',
                  chain,
                  method: 'eth_getBalance',
                  parameters: [userWalletAddress, 'latest'],
                  returnValueTest: {
                    comparator,
                    value: ethers.utils.parseEther(item.number).toString(),
                  },
                })
                break
              case 'ERC20':
                accessControlConditions.push({
                  contractAddress: '',
                  standardContractType: '',
                  chain,
                  method: 'balanceOf',
                  parameters: [userWalletAddress],
                  returnValueTest: {
                    comparator,
                    value: ethers.utils.parseEther(item.number).toString(),
                  },
                })
                break
              case 'ERC721':
                accessControlConditions.push({
                  contractAddress,
                  standardContractType: 'ERC721',
                  chain,
                  method: 'balanceOf',
                  parameters: [userWalletAddress],
                  returnValueTest: {
                    comparator,
                    value: item.number,
                  },
                })
                break
              case 'ERC777':
                accessControlConditions.push({
                  contractAddress,
                  standardContractType: 'ERC777',
                  chain,
                  method: 'balanceOf',
                  parameters: [userWalletAddress],
                  returnValueTest: {
                    comparator,
                    value: item.number,
                  },
                })
                break
              case 'ERC1155':
                accessControlConditions.push({
                  contractAddress,
                  standardContractType: 'ERC1155',
                  chain,
                  method: 'balanceOf',
                  parameters: [userWalletAddress, item.tokenId],
                  returnValueTest: {
                    comparator,
                    value: item.number,
                  },
                })
                break
            }

            const randomNumber = Math.floor(Math.random() * 100000)
            const resourceId = {
              baseUrl: 'https://chat.xmtp.com',
              path: `/${contractAddress}/${userWalletAddress}/${Date.now()}/${randomNumber}`,
              orgId: '',
              role: '',
              extraData: '',
            }

            try {
              await client.saveSigningCondition({
                accessControlConditions,
                chain,
                authSig,
                resourceId,
              })
              const jwt = await client.getSignedToken({
                accessControlConditions,
                chain,
                authSig,
                resourceId,
              })

              const { verified } = LitJsSdk.verifyJwt({ jwt })
              return [userWalletAddress, verified]
            } catch (err) {
              console.log('err', err)

              return [userWalletAddress, false]
            }
          })
        )
        const validateAddressArr = verifiedRz
          .filter((item) => item[1] === true)
          .map((item) => item[0])
        allValidateAddress.push(validateAddressArr)
        return {
          ...item,
          validateAddressArr,
        }
      })
    )
    setConditionItems(filterResultAddressArr)

    setIsLoading(false)
  }
  useEffect(() => {
    const funcMap = {
      intersection,
      union,
    }
    const allValidateAddress = conditionItems.map(
      ({ validateAddressArr }) => validateAddressArr
    )
    setAllLitValidateAddress(funcMap[booleanLogic.id](...allValidateAddress))
  }, [booleanLogic, conditionItems, setAllLitValidateAddress])

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.onClose}>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-y-0 left-0 overflow-hidden">
            <div className="fixed inset-y-0 left-0 flex max-w-full pr-10 pointer-events-none sm:pr-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="w-screen max-w-4xl pointer-events-auto">
                  <form className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl">
                    <div className="flex-1 h-0 overflow-y-auto">
                      <div className="px-4 py-6 bg-indigo-700 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            XMTP LIT Condition Generator
                          </Dialog.Title>
                          <div className="flex items-center ml-3 h-7">
                            <button
                              type="button"
                              className="text-indigo-200 bg-indigo-700 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={props.onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="w-6 h-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">
                            Generate your on-chain conditions to filter who you
                            want to chat with here. <br />
                            Have more LIT conditions ideas?{' '}
                            <a
                              href="https://twitter.com/Web3HackerNinja"
                              target="_blank"
                              rel="noreferrer"
                              className="text-red-400 hover:underline"
                            >
                              Contact US{' '}
                            </a>{' '}
                            to add more!
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div className="px-4 divide-y divide-gray-200 sm:px-6">
                          <div className="flex items-center justify-end pt-4 pb-6 text-sm">
                            On which chain:
                            <div className="w-32 ml-2">
                              <Selector
                                items={chainItems}
                                selected={chainItem}
                                onSelected={(item) => setChainItem(item)}
                              ></Selector>
                            </div>
                          </div>
                          <div className="flex items-center justify-end pt-4 pb-6 text-sm">
                            All the LIT conditions should be:
                            <div className="w-32 ml-2">
                              <Selector
                                items={booleanLogicItems}
                                selected={booleanLogic}
                                onSelected={(item) => setBooleanLogic(item)}
                              ></Selector>
                            </div>
                          </div>
                          <div className="pt-6 pb-5 space-y-6">
                            {conditionItems &&
                              conditionItems.map((item, index) => {
                                return (
                                  <LitACLItem
                                    key={item.id}
                                    id={item.id}
                                    validateAddressArr={item.validateAddressArr}
                                    contractType={item.contractType}
                                    onUpdate={({ key, value }) => {
                                      conditionItems[index][key] = value
                                      setConditionItems([...conditionItems])
                                    }}
                                    onDelete={deleteItem}
                                  />
                                )
                              })}

                            <div className="flex items-center justify-end">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-700 "
                                onClick={addItem}
                              >
                                <PlusCircleIcon className="w-5 h-5 mr-1 text-white hover:cursor-pointer" />
                                Add Condition
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end flex-shrink-0 px-4 py-4">
                      <div className="flex items-center justify-end">
                        <div className="mr-3">
                          <div>
                            LIT condition {booleanLogic.id} result
                            {allLitValidateAddress.map((address) => {
                              return <div>{address}</div>
                            })}
                          </div>
                        </div>
                        <button
                          onClick={(e) => doSubmit(e)}
                          disabled={isLoading}
                          className="inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-500"
                        >
                          {isLoading ? 'loading...' : 'Calculate with LIT'}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-end flex-shrink-0 px-4 py-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={props.onClose}
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
