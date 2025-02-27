import NavItem from "./navitem";
import NavDropdown from "./navdropdown";

export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <div className="collapse navbar-collapse justify-content-start" id="navbarNav">
          <ul className="navbar-nav d-flex gap-3">
            <NavDropdown
              title="About ISA"
              items={[
                { text: "About", link: "/about/about" },
                { text: "Purpose", link: "/purpose" },
                { text: "Missions", link: "/about/mission" },
              ]}
            />
            <NavItem text="Map" link="/map" />
            <NavDropdown
              title="Library"
              items={[
                { text: "Reports", link: "/library/reports" },
                { text: "Publications", link: "/library/publications" },
                { text: "Research", link: "/library/research" },
              ]}
            />
            <NavItem text="Gallery" link="/gallery" />
            <NavItem text="Documents" link="/documents" />
          </ul>
        </div>
      </div>
    </nav>
  );
}
