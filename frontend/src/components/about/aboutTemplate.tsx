// components/AboutTemplate.tsx
import { useLanguage } from "../../contexts/languageContext";

export default function AboutTemplate() {
  const { t } = useLanguage();
  
  return (
    <section className="py-3 py-md-5">
      <div className="container">
        <div className="row gy-3 gy-md-4 gy-lg-0 align-items-lg-center">
          <div className="col-12 col-lg-6 col-xl-5">
            <img
              className="img-fluid rounded"
              loading="lazy"
              src="/image/DeepSeaMiningPic.jpg"
              alt="ISA DeepData Overview"
            />
          </div>
          <div className="col-12 col-lg-6 col-xl-7">
            <div className="row justify-content-xl-center">
              <div className="col-12 col-xl-11">
                <h2 className="mb-3">{t('about.title')}</h2>
                <p className="lead fs-4 text-secondary mb-3">
                  {t('about.leadText')}
                </p>
                <p className="mb-5">
                  {t('about.description')}
                </p>
                <div className="row gy-4 gy-md-0 gx-xxl-5">
                  <div className="col-12 col-md-4">
                    <div className="d-flex">
                      <div className="me-3 text-primary">
                        {/* Innovative Analytics Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="currentColor"
                          className="bi bi-bar-chart-line"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-2 0V2a1 1 0 0 1 1-1z" />
                          <path d="M6 5a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1z" />
                          <path d="M1 8a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="h5 mb-2">{t('about.features.innovativeAnalytics.title')}</h2>
                        <p className="text-secondary mb-0">
                          {t('about.features.innovativeAnalytics.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="d-flex">
                      <div className="me-3 text-primary">
                        {/* Marine Insights Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="currentColor"
                          className="bi bi-water"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 0a8 8 0 0 0-8 8c0 3.86 3.14 7 7 7s7-3.14 7-7a8 8 0 0 0-7-7zm3.5 8a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="h5 mb-2">{t('about.features.marineInsights.title')}</h2>
                        <p className="text-secondary mb-0">
                          {t('about.features.marineInsights.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="d-flex">
                      <div className="me-3 text-primary">
                        {/* Collaborative Expertise Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="currentColor"
                          className="bi bi-handshake"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.146 11.354a.5.5 0 0 1 .708 0L8 12.5l1.146-1.146a.5.5 0 0 1 .708.708L8.707 13.5l1.147 1.146a.5.5 0 0 1-.708.708L8 14.207l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 13.5 6.146 12.354a.5.5 0 0 1 0-.708z" />
                          <path d="M2.5 8.5a.5.5 0 0 1 .5-.5H4v1H3a.5.5 0 0 1-.5-.5zM12 8h1.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H12v-2z" />
                          <path d="M2.939 4.86a.5.5 0 0 1 .707-.04l1.098.998a.5.5 0 0 1-.642.766l-1.098-.998a.5.5 0 0 1-.065-.728zM12.657 4.795a.5.5 0 0 1 .066.728l-1.098.998a.5.5 0 1 1-.642-.766l1.098-.998a.5.5 0 0 1 .578-.04z" />
                          <path d="M7.646 1.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V6.5a.5.5 0 0 1-1 0V2.707L4.354 5.354a.5.5 0 1 1-.708-.708l3-3z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="h5 mb-2">{t('about.features.collaborativeExpertise.title')}</h2>
                        <p className="text-secondary mb-0">
                          {t('about.features.collaborativeExpertise.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Extra content - e.g. a call-to-action */}
                <div className="mt-5">
                  <h3 className="mb-3">{t('about.joinSection.title')}</h3>
                  <p className="text-secondary">
                    {t('about.joinSection.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}