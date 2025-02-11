import Image from "next/image";
import Navigation from "../components/navigation/navigation";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container">
        {/* Øverste rad med logo og burger-knapp */}
        <div className="d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center">
            <Image src="/image/image.png" alt="Logo" width={80} height={80} />
            <div className="ms-3">
              <h1 className="h4 mb-0">ISA DeepData</h1>
              <p className="text-primary">International Seabed Authority</p>
            </div>
          </div>
          {/* Burgerknapp – vises kun på mobil */}
          <button
            className="navbar-toggler custom-toggler d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        {/* Navigasjonsbar – beholdt under logoen */}
        <Navigation />
      </div>
    </header>
  );
}
