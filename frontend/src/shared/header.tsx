import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/navigation/navigation";

export default function Header() {
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Denne useEffect trigges hver gang URL-en (router.asPath) endres
  useEffect(() => {
    console.log("Rute endret til: ", router.asPath);
    setShowHeader(true);
    lastScrollY.current = 0;
    window.scrollTo(0, 0);
  }, [router.asPath]);

  // Håndter scroll-logikken
  useEffect(() => {
    const handleScroll = () => {
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

  const handleNavToggle = () => {
    setIsNavOpen((prev) => !prev);
    setShowHeader(true);
  };

  return (
    <header
      className={`sticky-header ${
        showHeader ? "header-visible" : "header-hidden"
      }`}
    >
      <div className="container">
        {/* Øverste rad med logo og burger-knapp */}
        <div className="d-flex align-items-center justify-content-between py-3">
          <Link href="/" passHref legacyBehavior>
            <a className="home-link d-flex align-items-center text-decoration-none">
              <Image src="/image/image.png" alt="Logo" width={80} height={80} />
              <div className="ms-3">
                <h1 className="h4 mb-0">ISA DeepData</h1>
                <p className="text-primary">International Seabed Authority</p>
              </div>
            </a>
          </Link>
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
