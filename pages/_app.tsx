import '../styles/globals.css'
import type { AppProps } from 'next/app'
import App from '../components/App'

function AppWrapper({ Component, pageProps }: AppProps) {
  return (
    <App>
      <Component {...pageProps} />
    </App>
  )
}

export default AppWrapper
