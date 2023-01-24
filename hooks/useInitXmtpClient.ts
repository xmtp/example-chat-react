import { Client } from '@xmtp/xmtp-js'
import { utils } from '@noble/secp256k1'
import { Signer } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { getEnv, wipeKeys } from '../helpers'
import { useAppStore } from '../store/app'

import {
  get as readFromLocalStorage,
  set as writeLocalStorage,
} from '../helpers/localPrivateKeyStorage'

const useInitXmtpClient = (cacheOnly = false) => {
  const signer = useAppStore((state) => state.signer)
  const address = useAppStore((state) => state.address) ?? ''
  const client = useAppStore((state) => state.client)
  const setSigner = useAppStore((state) => state.setSigner)
  const setClient = useAppStore((state) => state.setClient)
  const reset = useAppStore((state) => state.reset)
  const setAddress = useAppStore((state) => state.setAddress)
  const [isRequestPending, setIsRequestPending] = useState(false)

  const disconnect = () => {
    reset()
    if (signer) {
      wipeKeys(address)
    }
  }

  const initClient = useCallback(
    async (wallet: Signer) => {
      if (wallet && !client) {
        try {
          setIsRequestPending(true)

          const address = await wallet.getAddress()

          const existingKey = await readFromLocalStorage(address)

          if (existingKey) {
            const response = await Client.create(wallet, {
              privateKeyOverride: utils.hexToBytes(existingKey),
              env: getEnv(),
            })
            setSigner(wallet)
            setAddress(address)

            setClient(response)
            setIsRequestPending(false)
            return
          }
          const keys = await Client.getKeys(wallet, { env: getEnv() })
          const response = await Client.create(wallet, {
            privateKeyOverride: keys,
            env: getEnv(),
          })

          await writeLocalStorage(address, utils.bytesToHex(keys))
          setSigner(wallet)
          setAddress(address)

          setClient(response)
        } catch (e) {
          console.log('error setting client', e)

          console.error(e)
          setClient(null)
          setIsRequestPending(false)
        }
      }
    },
    [client, setClient, setSigner, setAddress]
  )

  useEffect(() => {
    if (!isRequestPending) {
      signer ? initClient(signer) : disconnect()
    }
  }, [signer, initClient])

  return {
    initClient,
  }
}

export default useInitXmtpClient
