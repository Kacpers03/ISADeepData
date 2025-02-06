import { useState } from "react";

export default function NavDropdown({ title, items }: { title: string; items: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-dropdown" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span>{title} ▼</span>
      {open && (
        <ul className="dropdown-menu">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
