import React from "react";
import { useLanguage } from "../contexts/languageContext";

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
                
                {/* Knapp med mindre nedlastingsikon */}
                <div className="flex justify-center mt-4">
                    <a
                        href="https://www.isa.org.jm/wp-content/uploads/2022/04/UserManual_v1.1_20181119.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-800 py-1 px-2.5 rounded text-sm transition-colors duration-300"
                    >
                      
                        {t('documents.userManual.openManual')}
                    </a>
                </div>
            </div>
        </div>
    );
}