import { Client, ContentTypeId } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import {
  getAppVersion,
  getEnv,
  loadKeys,
  storeKeys,
  wipeKeys,
} from '../helpers'
import { useAppStore } from '../store/app'

const useInitXmtpClient = (cacheOnly = false) => {
  const signer = useAppStore((state) => state.signer)
  const address = useAppStore((state) => state.address) ?? ''
  const client = useAppStore((state) => state.client)
  const setClient = useAppStore((state) => state.setClient)
  const reset = useAppStore((state) => state.reset)
  const [isRequestPending, setIsRequestPending] = useState(false)

  const disconnect = () => {
    reset()
    if (signer) {
      wipeKeys(address)
    }
  }

  const ContentTypeVoiceKey = new ContentTypeId({
    authorityId: 'xmtp.test',
    typeId: 'voice-key',
    versionMajor: 1,
    versionMinor: 0,
  })

  class voiceCodec {
    get contentType() {
      return ContentTypeVoiceKey
    }

    encode(key: string | undefined) {
      return {
        type: ContentTypeVoiceKey,
        parameters: {},
        content: new TextEncoder().encode(key),
      }
    }

    decode(content: { content: any }) {
      const uint8Array = content.content
      const key = new TextDecoder().decode(uint8Array)
      return key
    }
  }

  const initClient = useCallback(
    async (wallet: Signer) => {
      if (wallet && !client) {
        try {
          setIsRequestPending(true)
          let keys = loadKeys(address)
          if (!keys) {
            if (cacheOnly) {
              return
            }
            keys = await Client.getKeys(wallet, {
              env: getEnv(),
              appVersion: getAppVersion(),
            })
            storeKeys(address, keys)
          }
          const xmtp = await Client.create(null, {
            env: getEnv(),
            appVersion: getAppVersion(),
            privateKeyOverride: keys,
            codecs: [new voiceCodec()],
          })
          setClient(xmtp)
          setIsRequestPending(false)
        } catch (e) {
          console.error(e)
          setClient(null)
          setIsRequestPending(false)
        }
      }
    },
    [client]
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
