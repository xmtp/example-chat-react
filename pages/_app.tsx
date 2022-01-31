import "../styles/globals.css";
import type { AppProps } from "next/app";
import { XmtpProvider } from "../components/XmtpContext";
import Layout from "../components/Layout";

function App({ Component, pageProps }: AppProps) {
  return (
    // <html className="h-full bg-gray-100">
    //   <body className="h-full">
    <XmtpProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </XmtpProvider>
    //   </body>
    // </html>
  );
}

export default App;
