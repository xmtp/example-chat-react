export const truncate = (
  str: string | undefined,
  length: number
): string | undefined => {
  if (!str) return str
  if (str.length > length) return `${str.substring(0, length - 3)}...`
  return str
}

export const formatDate = (
  d: Date | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string => (d ? d.toLocaleDateString('en-US', options) : '')

export const formatTime = (d: Date | undefined): string =>
  d
    ? d.toLocaleTimeString(undefined, {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''

export const isOnSameDay = (d1?: Date, d2?: Date): boolean =>
  d1?.toDateString() === d2?.toDateString()

export const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith('0x')
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr
