export const getEnv = (): 'dev' | 'production' => {
  return process.env.NEXT_PUBLIC_XMTP_ENVIRONMENT === 'production'
    ? 'production'
    : 'dev'
}
