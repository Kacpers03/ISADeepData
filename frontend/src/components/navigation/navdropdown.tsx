import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type DropdownItem = {
  text: string;
  link: string;
};

export default function NavDropdown({
  title,
  items,
}: {
  title: string;
  items: DropdownItem[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Lukker dropdown og eventuelt burgermenyen på mobil
  const handleItemClick = () => {
    setOpen(false);
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  };

  const handleDropdownItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: string
  ) => {
    if (router.pathname === link) {
      e.preventDefault();
      router.reload();
    }
    handleItemClick();
  };

  return (
    <li
      className={`nav-item dropdown ${open ? "show" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        className="nav-link dropdown-toggle"
        href="#"
        role="button"
        aria-expanded={open ? "true" : "false"}
        onClick={(e) => e.preventDefault()}
      >
        {title}
      </a>
      <ul className={`dropdown-menu ${open ? "show" : ""}`}>
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.link} legacyBehavior>
              <a
                className="dropdown-item"
                onClick={(e) => handleDropdownItemClick(e, item.link)}
              >
                {item.text}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
