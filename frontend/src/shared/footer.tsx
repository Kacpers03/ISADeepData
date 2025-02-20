import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer
      className="text-white"
      style={{ backgroundColor: "#45526e", marginTop: 0 }}
    >
      {/* Øvre seksjon: Contact, Topics og Information */}
      <div className="container p-4">
        <div className="row">
          {/* Contact Section */}
          <div className="col-md-4 text-start mt-3">
            <h6
              className="text-uppercase mb-4 font-weight-bold"
              style={{
                borderBottom: "2px solid white",
                display: "inline-block",
                paddingBottom: "5px",
              }}
            >
              Contact
            </h6>
            <p className="mt-3">
              <i className="fas fa-home mr-3"></i> 14 - 20 Port Royal Street,
              Kingston, Jamaica
            </p>
            <p>
              <i className="fas fa-envelope mr-3"></i> news@isa.org.jm
            </p>
            <p>
              <i className="fas fa-phone mr-3"></i> +1 (876) 922-9105
            </p>
          </div>

          {/* Topics Section */}
          <div className="col-md-4 text-start mt-3">
            <h6
              className="text-uppercase mb-4 font-weight-bold"
              style={{
                borderBottom: "2px solid white",
                display: "inline-block",
                paddingBottom: "5px",
              }}
            >
              Topics
            </h6>
            <p className="mt-3">
              <Link
                href="/topics/strategic-plan"
                className="text-white text-decoration-none"
              >
                Strategic Plan
              </Link>
            </p>
            <p>
              <Link
                href="/topics/mining-code"
                className="text-white text-decoration-none"
              >
                Mining Code
              </Link>
            </p>
            <p>
              <Link
                href="/topics/marine-protection"
                className="text-white text-decoration-none"
              >
                Protection of the Marine Environment
              </Link>
            </p>
            <p>
              <Link
                href="/topics/exploration-contracts"
                className="text-white text-decoration-none"
              >
                Exploration Contracts
              </Link>
            </p>
            <p>
              <Link
                href="/topics/voluntary-commitments"
                className="text-white text-decoration-none"
              >
                Voluntary Commitments
              </Link>
            </p>
            <p>
              <Link
                href="/topics/workshops"
                className="text-white text-decoration-none"
              >
                Workshops
              </Link>
            </p>
          </div>

          {/* Information Section */}
          <div className="col-md-4 text-start mt-3">
            <h6
              className="text-uppercase mb-4 font-weight-bold"
              style={{
                borderBottom: "2px solid white",
                display: "inline-block",
                paddingBottom: "5px",
              }}
            >
              Information
            </h6>
            <p className="mt-3">
              <Link
                href="/information/terms"
                className="text-white text-decoration-none"
              >
                Terms of Use
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Kreativ divider uten mellomrom */}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "30px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to right, transparent, white)",
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to left, transparent, white)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nedre seksjon: Copyright og sosiale lenker */}
      <div className="container">
        <div className="row d-flex align-items-center">
          {/* Venstre side */}
          <div className="col-md-7 col-lg-8 text-center text-md-start">
            <div className="p-3">© 2025 All rights reserved.</div>
          </div>
          {/* Høyre side: Sosiale ikoner */}
          <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
            <a
              href="https://www.facebook.com/ISBAHeadquarters"
              className="btn btn-outline-light btn-floating m-1"
              role="button"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://x.com/ISBAHQ?mx=2"
              className="btn btn-outline-light btn-floating m-1"
              role="button"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/isbahq/"
              className="btn btn-outline-light btn-floating m-1"
              role="button"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://www.youtube.com/channel/UCocsSo1icTK8iI45SKS60sQ"
              className="btn btn-outline-light btn-floating m-1"
              role="button"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
