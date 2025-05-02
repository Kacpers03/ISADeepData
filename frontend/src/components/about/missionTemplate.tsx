// components/MissionTemplate.tsx
import { useLanguage } from '../../contexts/languageContext'

export default function MissionTemplate() {
	const { t } = useLanguage()

	return (
		<section className='py-3 py-md-5'>
			<div className='container'>
				<div className='row gy-3 gy-md-4 gy-lg-0 align-items-lg-center'>
					<div className='col-12 col-lg-6 col-xl-5'>
						<img className='img-fluid rounded' loading='lazy' src='../image/missions.jpg' alt='Deep Data Impact' />
					</div>
					<div className='col-12 col-lg-6 col-xl-7'>
						<div className='row justify-content-xl-center'>
							<div className='col-12 col-xl-11'>
								<h2 className='mb-3'>{t('mission.title')}</h2>
								<p className='lead fs-4 text-secondary mb-3'>{t('mission.subtitle')}</p>
								<p className='mb-5'>{t('mission.description')}</p>
								<div className='row gy-4 gy-md-0 gx-xxl-5'>
									<div className='col-12 col-md-6'>
										<div className='d-flex'>
											<div className='me-3 text-primary'>
												{/* Sustainability Icon */}
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='32'
													height='32'
													fill='currentColor'
													className='bi bi-water'
													viewBox='0 0 16 16'>
													<path d='M8 0a8 8 0 0 0-8 8c0 3.86 3.14 7 7 7s7-3.14 7-7a8 8 0 0 0-7-7zm3.5 8a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z' />
												</svg>
											</div>
											<div>
												<h2 className='h5 mb-2'>{t('mission.keyObjectives.objective1.title')}</h2>
												<p className='text-secondary mb-0'>{t('mission.keyObjectives.objective1.description')}</p>
											</div>
										</div>
									</div>
									<div className='col-12 col-md-6'>
										<div className='d-flex'>
											<div className='me-3 text-primary'>
												{/* Marine Protection Icon */}
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='32'
													height='32'
													fill='currentColor'
													className='bi bi-shield-lock-fill'
													viewBox='0 0 16 16'>
													<path
														fillRule='evenodd'
														d='M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5z'
													/>
												</svg>
											</div>
											<div>
												<h2 className='h5 mb-2'>{t('mission.keyObjectives.objective2.title')}</h2>
												<p className='text-secondary mb-0'>{t('mission.keyObjectives.objective2.description')}</p>
											</div>
										</div>
									</div>
								</div>
								<div className='row gy-4 gy-md-0 gx-xxl-5 mt-4'>
									<div className='col-12 col-md-6'>
										<div className='d-flex'>
											<div className='me-3 text-primary'>
												{/* Open Data Access Icon */}
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='32'
													height='32'
													fill='currentColor'
													className='bi bi-bar-chart-line'
													viewBox='0 0 16 16'>
													<path d='M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-2 0V2a1 1 0 0 1 1-1z' />
													<path d='M6 5a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1z' />
													<path d='M1 8a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z' />
												</svg>
											</div>
											<div>
												<h2 className='h5 mb-2'>{t('mission.keyObjectives.objective3.title')}</h2>
												<p className='text-secondary mb-0'>{t('mission.keyObjectives.objective3.description')}</p>
											</div>
										</div>
									</div>
									<div className='col-12 col-md-6'>
										<div className='d-flex'>
											<div className='me-3 text-primary'>
												{/* Global Collaboration Icon */}
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='32'
													height='32'
													fill='currentColor'
													className='bi bi-globe'
													viewBox='0 0 16 16'>
													<path d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z' />
												</svg>
											</div>
											<div>
												<h2 className='h5 mb-2'>{t('mission.keyObjectives.objective4.title')}</h2>
												<p className='text-secondary mb-0'>{t('mission.keyObjectives.objective4.description')}</p>
											</div>
										</div>
									</div>
								</div>

								{/* Impact Section */}
								<div className='mt-5'>
									<h3 className='mb-3'>{t('mission.impact.title')}</h3>
									<p className='text-secondary'>{t('mission.impact.description1')}</p>
									<p className='text-secondary'>{t('mission.impact.description2')}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
