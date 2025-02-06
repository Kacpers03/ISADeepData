import NavItem from "./navitem";
import NavDropdown from "./navdropdown";

export default function Navigation() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <NavDropdown title="About ISA" items={["Mission", "History", "Team"]} />
        <NavItem text="Map" link="/map" />
        <NavDropdown title="Library" items={["Reports", "Publications", "Research"]} />
        <NavItem text="Gallery" link="/gallery" />
        <NavItem text="Documents" link="/documents" />
        <NavItem text="Contact Us" link="/contact" />
      </ul>
    </nav>
  );
}
