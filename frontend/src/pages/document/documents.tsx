import React from "react";
import { useLanguage } from "../../contexts/languageContext";

export default function Documents() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-6 px-4">
            <div className="max-w-2xl w-full">
                <h1 className="text-xl font-bold text-center mb-3">{t('documents.title')}</h1>
                
                {/* Beskrivelsestekst - gjort mer kompakt */}
                <p className="text-sm text-gray-700 mb-2">
                    {t('documents.userManual.description')}
                </p>
                
                {/* Punktliste over innhold - redusert mellomrom */}
                <div className="mb-4">
                    <h2 className="font-bold text-sm mb-1">{t('documents.userManual.contents.title')}</h2>
                    <ul className="list-disc pl-5 space-y-0 text-sm">
                        <li>{t('documents.userManual.contents.item1')}</li>
                        <li>{t('documents.userManual.contents.item2')}</li>
                        <li>{t('documents.userManual.contents.item3')}</li>
                        <li>{t('documents.userManual.contents.item4')}</li>
                        <li>{t('documents.userManual.contents.item5')}</li>
                    </ul>
                </div>
                
            
                {/* Document link with text above icon, aligned left */}
                <div className="flex justify-start mt-4">
                    <div className="inline-block text-left">
                        <a
                            href="/docs/UserManualISA.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-50 hover:bg-blue-100 text-black py-2 px-4 rounded text-sm transition-colors duration-300 no-underline"
                        >
                            <div className="block text-left mb-1">Open User Manual</div>
                            <div className="flex justify-start">
                                <svg 
                                    width="500" 
                                    height="500" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ minWidth: '10px', minHeight: '10px' }}
                                >
                                    <path 
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}