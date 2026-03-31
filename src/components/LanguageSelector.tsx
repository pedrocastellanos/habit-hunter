import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SpainFlag from '@/assets/spain-flag.svg'
import EnglandFlag from '@/assets/england-flag.svg'
import '../styles/LanguageSelector.css'

export function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false)
    const { i18n, t } = useTranslation()
    const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en'>(
        i18n.language === 'en' ? 'en' : 'es'
    )
    const dropdownRef = useRef<HTMLDivElement>(null)

    const languages = [
        { code: 'es', label: 'ES', flag: SpainFlag },
        { code: 'en', label: 'EN', flag: EnglandFlag },
    ]

    const currentLang = languages.find((lang) => lang.code === currentLanguage)

    const handleSelectLanguage = (code: 'es' | 'en') => {
        setCurrentLanguage(code)
        void i18n.changeLanguage(code)
        setIsOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            className="language-selector-custom"
            ref={dropdownRef}
            aria-label={t('nav.languageSelector')}
        >
            <button
                type="button"
                className="language-selector-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                {currentLang && (
                    <>
                        <img
                            src={currentLang.flag}
                            alt={`${currentLang.label} flag`}
                            className="flag-icon"
                        />
                        <span className="language-label">{currentLang.label}</span>
                    </>
                )}
            </button>

            {isOpen && (
                <ul className="language-selector-dropdown" role="listbox">
                    {languages.map((lang) => (
                        <li key={lang.code}>
                            <button
                                type="button"
                                className={`language-option ${
                                    currentLanguage === lang.code ? 'active' : ''
                                }`}
                                onClick={() => handleSelectLanguage(lang.code as 'es' | 'en')}
                                role="option"
                                aria-selected={currentLanguage === lang.code}
                            >
                                <img
                                    src={lang.flag}
                                    alt={`${lang.label} flag`}
                                    className="flag-icon"
                                />
                                <span>{lang.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
