import { ethers } from 'ethers'
import Web3Modal, { IProviderOptions } from 'web3modal'
// import WalletConnectProvider from '@walletconnect/web3-provider'
// import WalletLink from 'walletlink'

// We can't run this as a normal content script, because it won't have access to the same context,
// including browser extensions (e.g. metamask) as if we inject it into the page dynamically.
// We inject this dynamically

console.log('hi from content')

// const root = document.createElement('div')
// root.id = APP_ROOT
// document.body.appendChild(root)

// const url = chrome.runtime.getURL('popup.html')
// console.log('url', url)

// const res = window.open(url, 'popup', 'width=400,height=600')
// console.log('res', res)

// console.log('window.eth', window.ethereum)

// setInterval(() => {
//   console.log('window.eth', window.ethereum)
// }, 2000)

// const injectedCode = `
// alert('hi from injected code')
// console.log("eth from injected code", window.ethereum)
// `

// const EL_ROOT_ID = 'xmtp-app-root'
// const el = document.getElementById(EL_ROOT_ID)

// only create the root if it doesn't already exist
// if (!el) {
//   const reactRootElement = document.createElement('div')
//   reactRootElement.id = EL_ROOT_ID
//   document.body.appendChild(reactRootElement)
// }

// const script = document.createElement('script')
// script.src = chrome.runtime.getURL('esbuild/popup/index.js')
// document.head.appendChild(script)

let provider: ethers.providers.Web3Provider

export async function connectWeb3Modal(): Promise<ethers.providers.JsonRpcSigner> {
  const infuraId =
    process.env.NEXT_PUBLIC_INFURA_ID || 'b6058e03f2cd4108ac890d3876a56d0d'
  const providerOptions: IProviderOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      // package: WalletLink,
      options: {
        infuraId,
      },
    },
  }
  const web3Modal = new Web3Modal({ cacheProvider: true, providerOptions })
  // if (!web3Modal) throw new Error('web3Modal not initialized')
  try {
    const instance = await web3Modal.connect()
    if (!instance) return
    instance.on('accountsChanged', (accounts: any) => {
      console.log('accounts changed', accounts)
    })
    console.log('instance', instance)

    provider = new ethers.providers.Web3Provider(instance, 'any')
    const newSigner = provider.getSigner()
    newSigner.provider
    // setSigner(newSigner)
    // setAddress(await newSigner.getAddress())
    const addr = await newSigner.getAddress()
    console.log('provider', provider)
    console.log('newSigner', newSigner)

    // return newSigner
    console.log('addr', addr)
    // newSigner.

    // sendResponse({ addr })
    // chrome.runtime.sendMessage({ addr })
    // return addr
    return newSigner
  } catch (e) {
    // TODO: better error handling/surfacing here.
    // Note that web3Modal.connect throws an error when the user closes the
    // modal, as "User closed modal"
    console.log('error', e)
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('in add listener callback', request, sender, sendResponse)

  if (request.type === 'connect') {
    console.log('connect')
    connectWeb3Modal()
  }
})
