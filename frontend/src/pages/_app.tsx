import type { AppProps } from "next/app";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/layout.css"; // Global CSS
import Layout from "../shared/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Importer bootstrap sin JS kun på klientsiden
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
