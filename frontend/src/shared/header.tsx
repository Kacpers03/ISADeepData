import Navigation from "../components/navigation/navigation";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="public/image/logo.png" alt="Logo" />
        <h1>ISA DeepData</h1>
        <p>International Seabed Authority</p>
      </div>
      <Navigation />
    </header>
  );
}
