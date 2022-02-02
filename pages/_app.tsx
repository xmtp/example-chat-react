import "../styles/globals.css";
import type { AppProps } from "next/app";
import { XmtpProvider } from "../components/XmtpContext";
import Layout from "../components/Layout";

function App({ Component, pageProps }: AppProps) {
  return (
    <XmtpProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </XmtpProvider>
  );
}

export default App;
