import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSelector } from './LanguageSelector'

export function MainNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { t } = useTranslation()

    const links = [
        { to: '/', label: t('nav.home') },
        { to: '/personaje', label: t('nav.operator') },
        { to: '/tareas', label: t('nav.missions') },
    ]

    const handleCloseMobile = () => {
        setMobileMenuOpen(false)
    }

    return (
        <header className="main-nav">
            <div className="brand-mark">
                <div className="brand-icon-wrap">
                    <span className="material-symbols-outlined brand-icon neon-text">
                        deployed_code
                    </span>
                </div>
                <h2 className="brand-title neon-text">HABIT HUNTER</h2>
            </div>

            <div className={mobileMenuOpen ? 'main-nav-content open' : 'main-nav-content'}>
                <nav className="main-nav-links" aria-label={t('nav.mainNavigation')}>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={handleCloseMobile}
                            className={({ isActive }) =>
                                isActive ? 'header-link active' : 'header-link'
                            }
                            end={link.to === '/'}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <NavLink to="/arena" onClick={handleCloseMobile} className="launch-mission-btn">
                    {t('nav.launchMission')}
                </NavLink>

                <LanguageSelector />
            </div>

            <button
                type="button"
                className="mobile-menu-toggle"
                aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((current) => !current)}
            >
                <span className="material-symbols-outlined">
                    {mobileMenuOpen ? 'close' : 'menu'}
                </span>
            </button>
        </header>
    )
}
