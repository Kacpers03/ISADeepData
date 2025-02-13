import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: '#45526e', marginTop: 0 }}>
      {/* Upper section with contact info */}
      <div className="container p-4">
        <div className="row">
          {/* Left side: Contact info */}
          <div className="col-md-6 text-start mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
            <p>
              <i className="fas fa-home mr-3"></i> 14 - 20 Port Royal Street, Kingston, Jamaica
            </p>
            <p>
              <i className="fas fa-envelope mr-3"></i> news@isa.org.jm
            </p>
            <p>
              <i className="fas fa-phone mr-3"></i> +1 (876) 922-9105
            </p>
          </div>

          {/* Right side: Information + Terms link */}
          <div className="col-md-6 text-end mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold">Information</h6>
            <p>
              {/* Link to /terms page */}
              <Link href="/information/temps" className="text-white">
                Terms of Use
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Lower section with copyright and social media */}
      <div className="container">
        <div className="row d-flex align-items-center">
          {/* Left side */}
          <div className="col-md-7 col-lg-8 text-center text-md-start">
            <div className="p-3">© 2025 All rights reserved.</div>
          </div>

          {/* Right side: Social media icons */}
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
