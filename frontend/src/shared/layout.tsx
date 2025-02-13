import { useRouter } from "next/router";
import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  // Dersom du vil ha samme scroll-opplevelse overalt,
  // kan du vurdere å bruke en felles klasse (f.eks. "container")
  // eller oppdatere .homeMain slik at den oppfører seg likt.
  const mainClass = pathname === "/" ? "homeMain" : "container mt-4";

  return (
    <div className="layout">
      <Header />
      <main className={mainClass}>{children}</main>
      <Footer />
    </div>
  );
}
