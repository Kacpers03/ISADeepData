import Header from "./header";
import Footer from "./footer";
import "../styles/layout.css"; // ✅ Koble til CSS


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Header />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}
