import type { AppProps } from "next/app";
import "../styles/layout.css"; // ✅ Flytt global CSS-hit!
import Layout from "../shared/layout"; // 👉 importer Layout-komponenten

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
