import { useRouter } from "next/router";
import Link from "next/link";

export default function NavItem({
  text,
  link,
}: {
  text: string;
  link: string;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Hvis vi er på samme side, tving reload
    if (router.pathname === link) {
      e.preventDefault();
      router.reload();
      return;
    }
    // Lukker burgermenyen hvis den er åpen (mobil)
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  };

  return (
    <li className="nav-item">
      <Link href={link} legacyBehavior>
        <a className="nav-link" onClick={handleClick}>
          {text}
        </a>
      </Link>
    </li>
  );
}
