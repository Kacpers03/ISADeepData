import Link from "next/link";

export default function NavItem({
  text,
  link,
}: {
  text: string;
  link: string;
}) {
  return (
    <li className="nav-item">
      <Link href={link} className="nav-link">
        {text}
      </Link>
    </li>
  );
}
