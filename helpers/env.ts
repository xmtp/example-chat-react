export const getEnv = (): 'dev' | 'production' => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
    ? 'production'
    : 'dev'
}
