// These are wrappers for chrome extension local storage functions. The API is slightly different
// than window.localStorage.

export function setValue(key: string, value: string) {
  // window.localStorage.setItem(key, value)
  chrome.storage.local.set({ [key]: value })
}

export function getValue(key: string) {
  // const val = window.localStorage.getItem(key)
  // return Promise.resolve({ firebaseToken: val })
  return chrome.storage.local.get(key)
}
