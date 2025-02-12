import { useRouter } from "next/router";
import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  // Hvis vi er på hjem-siden ("/"), bruk en fullbredde wrapper (klasse "homeMain").
  // For øvrige sider benyttes standard Bootstrap-container med mt-4.
  const mainClass = pathname === "/" ? "homeMain" : "container mt-4";

  return (
    <div className="layout">
      <Header />
      <main className={mainClass}>{children}</main>
      <Footer />
    </div>
  );
}
