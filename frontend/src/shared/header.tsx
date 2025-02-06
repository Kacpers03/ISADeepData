import Image from "next/image";
import Navigation from "../components/navigation/navigation";

export default function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <Image src="/image/image.png" alt="Logo" width={80} height={80} className="logo-img" />
        <div className="logo-text">
          <h1>ISA DeepData</h1>
          <p>International Seabed Authority</p>
        </div>
      </div>
      {/* Plasser navbar under logoen */}
      <div className="navbar-container">
        <Navigation />
      </div>
    </header>
  );
}
