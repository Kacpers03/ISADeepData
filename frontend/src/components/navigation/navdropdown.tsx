import { useState } from "react";
import Link from "next/link";

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
        onClick={(e) => e.preventDefault()} // Hindrer lenken fra å navigere
      >
        {title}
      </a>
      <ul className={`dropdown-menu ${open ? "show" : ""}`}>
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.link} className="dropdown-item">
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
