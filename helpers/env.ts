export const getEnv = (): 'dev' | 'production' | 'local' => {
  const envVar = process.env.NEXT_PUBLIC_XMTP_ENVIRONMENT
  console.log(envVar)
  if (envVar === 'production') {
    return envVar
  }
  if (envVar === 'local') {
    return envVar
  }
  return 'dev'
}
