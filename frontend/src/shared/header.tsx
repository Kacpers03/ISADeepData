import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navigation from "../components/navigation/navigation";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      // Hvis navigasjonsmenyen er åpen, la headeren stå synlig
      if (isNavOpen) {
        setShowHeader(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current && window.scrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isNavOpen]);

  // Håndter toggling av burger-menyen
  const handleNavToggle = () => {
    setIsNavOpen((prev) => !prev);
    // Når menyen åpnes, tving headeren til å være synlig
    setShowHeader(true);
  };

  return (
    <header className={`sticky-header ${showHeader ? "header-visible" : "header-hidden"}`}>
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
          {/* Burger-knapp – vises kun på mobil */}
          <button
            className="navbar-toggler custom-toggler d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
            onClick={handleNavToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        {/* Navigasjonsmenyen */}
        <Navigation />
      </div>
    </header>
  );
}
