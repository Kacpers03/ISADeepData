import React from "react";

interface MissionTemplateProps {
  t: (key: string) => string;
}

export default function MissionTemplate({ t }: MissionTemplateProps) {
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
          <h1 className="display-4 fw-bold mb-3">{t('mission.title')}</h1>
          <p className="lead fs-5">
            {t('mission.subtitle')}
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
              <h2 className="fw-bold">{t('mission.keyObjectives.title')}</h2>
              <p className="text-muted">
                {t('mission.description')}
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
                  <h5 className="card-title">{t('mission.keyObjectives.objective1.title')}</h5>
                  <p className="card-text">
                    {t('mission.keyObjectives.objective1.description')}
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
                  <h5 className="card-title">{t('mission.keyObjectives.objective2.title')}</h5>
                  <p className="card-text">
                    {t('mission.keyObjectives.objective2.description')}
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
                  <h5 className="card-title">{t('mission.keyObjectives.objective3.title')}</h5>
                  <p className="card-text">
                    {t('mission.keyObjectives.objective3.description')}
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
                  <h5 className="card-title">{t('mission.keyObjectives.objective4.title')}</h5>
                  <p className="card-text">
                    {t('mission.keyObjectives.objective4.description')}
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
              <h3 className="fw-bold mb-3">{t('mission.impact.title')}</h3>
              <p className="text-muted">
                {t('mission.impact.description1')}
              </p>
              <p className="text-muted">
                {t('mission.impact.description2')}
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