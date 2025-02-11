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
                { text: "Mission", link: "/mission" },
                { text: "History", link: "/history" },
                { text: "Team", link: "/team" },
              ]}
            />
            <NavItem text="Map" link="/map" />
            <NavDropdown
              title="Library"
              items={[
                { text: "Reports", link: "/reports" },
                { text: "Publications", link: "/publications" },
                { text: "Research", link: "/research" },
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
