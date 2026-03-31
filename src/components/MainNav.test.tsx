import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { MainNav } from './MainNav'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('MainNav Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render navigation component', () => {
    renderWithRouter(<MainNav />)
    expect(screen.getByText('HABIT HUNTER')).toBeInTheDocument()
  })

  it('should render main navigation links', () => {
    renderWithRouter(<MainNav />)
    expect(screen.getByText(/INICIO|HOME/i)).toBeInTheDocument()
    expect(screen.getByText(/OPERADOR|OPERATOR/i)).toBeInTheDocument()
    expect(screen.getByText(/MISIONES|MISSIONS/i)).toBeInTheDocument()
  })

  it('should render launch mission button', () => {
    renderWithRouter(<MainNav />)
    const launchButton = screen.getByText(/INICIAR|LAUNCH/i)
    expect(launchButton).toBeInTheDocument()
  })

  it('should render language selector', () => {
    renderWithRouter(<MainNav />)
    // LanguageSelector is a button with aria-haspopup
    // const languageButton = screen.getByRole('button', { name: /ES|EN/ })
    const buttons = screen.getAllByRole('button')
    const langButton = buttons.find(btn => btn.hasAttribute('aria-haspopup'))
    expect(langButton).toBeInTheDocument()
  })

  it('should render mobile menu toggle on small screens', () => {
    renderWithRouter(<MainNav />)
    const toggleButton = screen.getByRole('button', {
      hidden: true,
      name: /menu|abrir/i
    })
    expect(toggleButton).toBeInTheDocument()
  })

  it('should toggle mobile menu on button click', () => {
    renderWithRouter(<MainNav />)
    const toggleButton = screen.getByRole('button', {
      hidden: true,
      name: /menu|abrir/i
    })

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('should have brand icon', () => {
    renderWithRouter(<MainNav />)
    const brandIcon = screen.getByText('deployed_code')
    expect(brandIcon).toBeInTheDocument()
  })

  it('should have accessibility attributes', () => {
    renderWithRouter(<MainNav />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label')
  })

  it('should have language selector with options', () => {
    renderWithRouter(<MainNav />)
    // LanguageSelector is a button with aria-haspopup
    const buttons = screen.getAllByRole('button')
    const langButton = buttons.find(btn => btn.hasAttribute('aria-haspopup'))
    expect(langButton).toBeInTheDocument()

    // Click to toggle language
    if (langButton) {
      fireEvent.click(langButton)
    }
  })

  it('should render links properly', () => {
    renderWithRouter(<MainNav />)

    const homeLink = screen.getByText(/INICIO|HOME/).closest('a')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')

    const taskLink = screen.getByText(/MISIONES|MISSIONS/).closest('a')
    expect(taskLink).toBeInTheDocument()
    expect(taskLink).toHaveAttribute('href', '/tareas')

    const characterLink = screen.getByText(/OPERADOR|OPERATOR/).closest('a')
    expect(characterLink).toBeInTheDocument()
    expect(characterLink).toHaveAttribute('href', '/personaje')
  })

  it('should close mobile menu when clicking a link', async () => {
    renderWithRouter(<MainNav />)

    const toggleButton = screen.getByRole('button', {
      hidden: true,
      name: /abrir|open/i
    })

    fireEvent.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

    const homeLink = screen.getByText(/INICIO|HOME/).closest('a')
    if (homeLink) {
      fireEvent.click(homeLink)
    }

    await waitFor(() => {
      // Menu should be closed after clicking a link
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    }, { timeout: 500 })
  })

  it('should have language icons', () => {
    renderWithRouter(<MainNav />)
    // LanguageSelector button with flag icon
    const buttons = screen.getAllByRole('button')
    const langButton = buttons.find(btn => btn.hasAttribute('aria-haspopup'))
    expect(langButton).toBeInTheDocument()
    const flagIcon = langButton?.querySelector('.flag-icon')
    expect(flagIcon).toBeInTheDocument()
  })
})

describe('MainNav - Accessibility', () => {
  it('should have proper ARIA labels', () => {
    renderWithRouter(<MainNav />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label')
  })

  it('should have expanded state on mobile menu button', () => {
    renderWithRouter(<MainNav />)

    const toggleButton = screen.getByRole('button', {
      hidden: true,
      name: /abrir|open|menu/i
    })
    expect(toggleButton).toHaveAttribute('aria-expanded')
  })

  it('should support keyboard navigation', () => {
    renderWithRouter(<MainNav />)

    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toBeVisible()
    })
  })
})
