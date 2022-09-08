export const truncate = (
  str: string | undefined,
  length: number
): string | undefined => {
  if (!str) {
    return str
  }
  if (str.length > length) {
    return `${str.substring(0, length - 3)}...`
  }
  return str
}

export const formatDate = (d: Date | undefined): string =>
  d ? d.toLocaleDateString('en-US') : ''

export const formatTime = (d: Date | undefined): string =>
  d
    ? d.toLocaleTimeString(undefined, {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''

export const checkPath = () => {
  return window.location.pathname !== '/' && window.location.pathname !== '/dm'
}

export const checkIfPathIsEns = (address: string): boolean => {
  return address.includes('eth')
}
