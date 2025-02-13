import React from "react";

export default function MissionTemplate() {
  return (
    <>
      {/* Hero Section med bakgrunnsbilde og gradient overlay */}
      <section
        className="position-relative text-center text-white py-5"
        style={{
          background: "linear-gradient(135deg, rgba(0,123,255,0.8), rgba(0,123,255,0.4)), url('/image/ocean-background.jpg') center/cover no-repeat",
        }}
      >
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-4 fw-bold mb-3">Our Mission</h1>
          <p className="lead fs-5">
            At ISA DeepData, we harness the power of deep-sea data to drive sustainable marine innovation.
          </p>
        </div>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0, 123, 255, 0.5)" }}
        ></div>
      </section>

      {/* Mission Cards Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="fw-bold">Key Pillars of Our Mission</h2>
              <p className="text-muted">
                Discover the core elements that drive our commitment to sustainable and innovative marine data management.
              </p>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {/* Sustainability Card */}
            <div className="col">
              <div
                className="card h-100 border-0 shadow-sm transition-hover"
                style={{ borderRadius: "0.75rem" }}
              >
                <div className="card-body text-center">
                  <i className="bi bi-water display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Sustainability</h5>
                  <p className="card-text">
                    Promote responsible and sustainable management of seabed resources.
                  </p>
                </div>
              </div>
            </div>
            {/* Marine Protection Card */}
            <div className="col">
              <div
                className="card h-100 border-0 shadow-sm transition-hover"
                style={{ borderRadius: "0.75rem" }}
              >
                <div className="card-body text-center">
                  <i className="bi bi-shield-lock-fill display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Marine Protection</h5>
                  <p className="card-text">
                    Support initiatives that safeguard and preserve marine ecosystems.
                  </p>
                </div>
              </div>
            </div>
            {/* Open Data Access Card */}
            <div className="col">
              <div
                className="card h-100 border-0 shadow-sm transition-hover"
                style={{ borderRadius: "0.75rem" }}
              >
                <div className="card-body text-center">
                  <i className="bi bi-bar-chart-line display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Open Data Access</h5>
                  <p className="card-text">
                    Provide transparent, high-quality deep-sea research data for informed decision-making.
                  </p>
                </div>
              </div>
            </div>
            {/* Global Collaboration Card */}
            <div className="col">
              <div
                className="card h-100 border-0 shadow-sm transition-hover"
                style={{ borderRadius: "0.75rem" }}
              >
                <div className="card-body text-center">
                  <i className="bi bi-globe display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Global Collaboration</h5>
                  <p className="card-text">
                    Foster cooperation among member states and research institutions worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extended Content Section */}
      <section className="py-5" style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src="/image/deepdata-impact.jpg"
                alt="Deep Data Impact"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-md-6">
              <h3 className="fw-bold mb-3">Driving Innovation & Impact</h3>
              <p className="text-muted">
                Our platform not only deciphers complex marine data but also sparks innovative solutions
                that transform the marine industry. By integrating advanced analytics with sustainable practices,
                ISA DeepData enables groundbreaking discoveries and empowers informed decision-making.
              </p>
              <p className="text-muted">
                We partner with global experts to ensure that every insight contributes to a healthier and more sustainable ocean ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .transition-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .transition-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </>
  );
}
