export async function getCurrentTab() {
  const queryOptions = {
    active: true,
    // lastFocusedWindow: true,
    currentWindow: true,
  }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}
