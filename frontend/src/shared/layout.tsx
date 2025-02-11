import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Header />
      <main className="container mt-4">{children}</main>
      <Footer />
    </div>
  );
}
