export async function set(address: string, value: string) {
  if (!address) {
    throw new Error("Can't get key without address")
  }

  try {
    await chrome.storage.local.set({ [address]: value })
    return value
  } catch (error) {
    console.error(error)
    return error
  }
}

export async function get(address: string): Promise<string> {
  if (!address) {
    throw new Error("Can't get key without address")
  }

  try {
    const result = await chrome.storage.local.get([address])
    console.log('get', result)
    return result[address]
  } catch (error) {
    console.error(error)
    return error
  }
}

export function clear(): Promise<void> {
  return chrome.storage.local.clear()
}
