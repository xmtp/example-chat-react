import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import useXmtp from '../hooks/useXmtp'
import {
  CyberConnectContext,
  CyberConnectContextType,
} from '../contexts/cyberConnect'
import { GET_IDENTITY } from '../gql/GET_IDENTITY'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useLazyQuery,
} from '@apollo/client'
import { Conversations } from '@xmtp/xmtp-js/dist/types/src'
const CYBERCONNECT_ENDPOINT = 'https://api.cybertino.io/connect/'

const client = new ApolloClient({
  uri: CYBERCONNECT_ENDPOINT,
  cache: new InMemoryCache(),
})

export const CyberConnectProvider: React.FC = ({ children }) => {
  const [filterBy, setFilterBy] = useState<string>()
  const [categoryBy, setCategoryBy] = useState<string>()
  const [identity, setIdentity] = useState<any>()
  const { walletAddress, conversations } = useXmtp()

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
  const filterConversations = useCallback(
    (conversations) => {
      if (identity[filterBy]) {
        if (identity[filterBy].list.length === 0) return []
        const list = identity[filterBy].list.map(({ address }) =>
          ethers.utils.getAddress(address)
        )
        return conversations.filter((item) => {
          return list.includes(item.client.address)
        })
      }

      return conversations
    },
    [filterBy, identity]
  )
  const [providerState, setProviderState] = useState<CyberConnectContextType>({
    filterBy,
    categoryBy,
    identity,
    updateFilterBy,
    updateCategoryBy,
    updateIdentity,
    filterConversations,
  })

  useEffect(() => {
    setProviderState({
      filterBy,
      categoryBy,
      identity,
      updateFilterBy,
      updateCategoryBy,
      updateIdentity,
      filterConversations,
    })
  }, [
    filterBy,
    categoryBy,
    identity,
    updateFilterBy,
    updateCategoryBy,
    updateIdentity,
    filterConversations,
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
