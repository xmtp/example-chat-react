import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import LitJsSdk from 'lit-js-sdk'
import useXmtp from '../hooks/useXmtp'
import {
  CyberConnectContext,
  CyberConnectContextType,
  BooleanLogic,
  ChainItem,
  ConditionItem,
  booleanLogicItems,
} from '../contexts/cyberConnect'
import { GET_IDENTITY } from '../gql/GET_IDENTITY'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useLazyQuery,
} from '@apollo/client'
// import { Conversations } from '@xmtp/xmtp-js/dist/types/src'
const CYBERCONNECT_ENDPOINT = 'https://api.cybertino.io/connect/'

const client = new ApolloClient({
  uri: CYBERCONNECT_ENDPOINT,
  cache: new InMemoryCache(),
})

export const chainItems = Object.keys(LitJsSdk.ALL_LIT_CHAINS).map((key) => {
  return { id: key, name: key }
})

export const CyberConnectProvider: React.FC = ({ children }) => {
  const [filterBy, setFilterBy] = useState<string>('friends')
  const [allLitValidateAddress, setAllLitValidateAddress] = useState<[string]>(
    []
  )
  const [chainItem, setChainItem] = useState<ChainItem>({
    id: 'ethereum',
    name: 'ethereum',
  })
  const [booleanLogic, setBooleanLogic] = useState<BooleanLogic>(
    booleanLogicItems[0]
  )
  const [conditionItems, setConditionItems] = useState<ConditionItem>([])
  const [categoryBy, setCategoryBy] = useState<string>()
  const [identity, setIdentity] = useState<any>()
  const { walletAddress } = useXmtp()

  const updateFilterBy = useCallback(
    (newFilterBy) => {
      setFilterBy(newFilterBy)
    },
    [setFilterBy]
  )

  const [getIdentity, { loading, error, data }] = useLazyQuery(GET_IDENTITY, {
    client,
  })

  useEffect(() => {
    if (!walletAddress) return

    getIdentity({
      variables: { address: walletAddress },
    })
  }, [walletAddress, getIdentity])

  const updateIdentity = useCallback(
    (identity) => setIdentity(identity),
    [setIdentity]
  )

  useEffect(() => {
    if (!data) return
    if (loading) return
    if (error) {
      console.error(error)
      return
    }
    updateIdentity(data.identity)
  }, [loading, error, data, updateIdentity])

  const updateCategoryBy = useCallback(
    (newCategoryBy) => {
      setCategoryBy(newCategoryBy)
    },
    [setCategoryBy]
  )

  const [providerState, setProviderState] = useState<CyberConnectContextType>({
    filterBy,
    booleanLogic,
    conditionItems,
    categoryBy,
    identity,
    setBooleanLogic,
    setConditionItems,
    updateFilterBy,
    updateCategoryBy,
    updateIdentity,
    chainItem,
    setChainItem,
    allLitValidateAddress,
    setAllLitValidateAddress,
  })

  useEffect(() => {
    setProviderState({
      filterBy,
      booleanLogic,
      conditionItems,
      categoryBy,
      identity,
      updateFilterBy,
      setBooleanLogic,
      setConditionItems,
      updateCategoryBy,
      updateIdentity,
      chainItem,
      setChainItem,
      allLitValidateAddress,
      setAllLitValidateAddress,
    })
  }, [
    filterBy,
    booleanLogic,
    conditionItems,
    categoryBy,
    identity,
    updateFilterBy,
    setBooleanLogic,
    setConditionItems,
    updateCategoryBy,
    updateIdentity,
    chainItem,
    setChainItem,
    allLitValidateAddress,
    setAllLitValidateAddress,
  ])

  return (
    <ApolloProvider client={client}>
      <CyberConnectContext.Provider value={providerState}>
        {children}
      </CyberConnectContext.Provider>
    </ApolloProvider>
  )
}

export default CyberConnectProvider
