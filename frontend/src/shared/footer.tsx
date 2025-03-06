// frontend/src/shared/footer.tsx
import Link from "next/link";
import React from "react";
import { useLanguage } from "../contexts/languageContext";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer
      className="text-white"
      style={{ backgroundColor: "#45526e", marginTop: 0 }}
    >
      {/* Upper section: Contact, Topics and Information */}
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
              {t('footer.contact')}
            </h6>
            <p className="mt-3">
              <i className="fas fa-home mr-3"></i> {t('footer.address')}
            </p>
            <p>
              <i className="fas fa-envelope mr-3"></i> {t('footer.email')}
            </p>
            <p>
              <i className="fas fa-phone mr-3"></i> {t('footer.phone')}
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
              {t('footer.topics')}
            </h6>
            <p className="mt-3">
              <Link
                href="/topics/StrategicPlan"
                className="text-white text-decoration-none"
              >
                {t('footer.strategicPlan')}
              </Link>
            </p>
            <p>
              <Link
                href="/topics/MiningCode"
                className="text-white text-decoration-none"
              >
                {t('footer.miningCode')}
              </Link>
            </p>
            <p>
              <Link
                href="/topics/MarineProtection"
                className="text-white text-decoration-none"
              >
                {t('footer.marineProtection')}
              </Link>
            </p>
            <p>
              <Link
                href="/topics/ExplorationContracts"
                className="text-white text-decoration-none"
              >
                {t('footer.explorationContracts')}
              </Link>
            </p>

            <p>
              <Link
                href="/topics/Workshops"
                className="text-white text-decoration-none"
              >
                {t('footer.workshops')}
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
              {t('footer.information')}
            </h6>
            <p className="mt-3">
              <Link
                href="/information/terms"
                className="text-white text-decoration-none"
              >
                {t('footer.termsOfUse')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Creative divider without space */}
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

      {/* Lower section: Copyright and social links */}
      <div className="container">
        <div className="row d-flex align-items-center">
          {/* Left side */}
          <div className="col-md-7 col-lg-8 text-center text-md-start">
            <div className="p-3">{t('footer.copyright')}</div>
          </div>
          {/* Right side: Social icons */}
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