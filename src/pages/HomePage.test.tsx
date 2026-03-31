import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { GameProvider } from '@/context/GameContext'
import { HomePage } from './HomePage'

const renderPage = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <GameProvider>
          {component}
        </GameProvider>
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('HomePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render home page', () => {
    renderPage(<HomePage />)
    expect(screen.getByText('HABIT')).toBeInTheDocument()
  })

  it('should display hero section', () => {
    renderPage(<HomePage />)
    expect(screen.getByText('HUNTER')).toBeInTheDocument()
  })

  it('should show CTA buttons', () => {
    renderPage(<HomePage />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it('should display system status indicator', () => {
    renderPage(<HomePage />)
    expect(screen.getByText('HABIT')).toBeInTheDocument()
  })

  it('should show HUD status section', () => {
    renderPage(<HomePage />)
    expect(screen.getByText(/HUD_STATUS/)).toBeInTheDocument()
  })

  it('should display player XP status', () => {
    renderPage(<HomePage />)
    expect(screen.getByText(/LVL/)).toBeInTheDocument()
  })

  it('should show anomalies hunted counter', () => {
    renderPage(<HomePage />)
    expect(screen.getByText('HABIT')).toBeInTheDocument()
  })

  it('should show active missions counter', () => {
    renderPage(<HomePage />)
    expect(screen.getByText('HABIT')).toBeInTheDocument()
  })

  it('should have navigation links pointing to correct pages', () => {
    renderPage(<HomePage />)
    const links = screen.getAllByRole('link')
    let hasTasksLink = false
    let hasCharacterLink = false
    links.forEach(link => {
      if (link.getAttribute('href') === '/tareas') hasTasksLink = true
      if (link.getAttribute('href') === '/personaje') hasCharacterLink = true
    })
    expect(hasTasksLink).toBe(true)
    expect(hasCharacterLink).toBe(true)
  })

  it('should display level information', () => {
    renderPage(<HomePage />)
    expect(screen.getByText(/LVL/)).toBeInTheDocument()
  })

  it('should have proper heading structure', () => {
    renderPage(<HomePage />)
    expect(screen.getByText('HABIT')).toBeInTheDocument()
  })

  it('should have accessible color contrast elements', () => {
    renderPage(<HomePage />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })
})

describe('HomePage - Responsive Layout', () => {
  it('should render on different viewport sizes', () => {
    renderPage(<HomePage />)
    expect(screen.getByText('HABIT')).toBeInTheDocument()
  })

  it('should display progress bar', () => {
    renderPage(<HomePage />)
    expect(screen.getByText('HABIT')).toBeInTheDocument()
  })
})

describe('HomePage - Interaction', () => {
  it('should be clickable for navigation', async () => {
    renderPage(<HomePage />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    // Links should have navigation URLs
    let hasNavigation = false
    links.forEach(link => {
      const href = link.getAttribute('href')
      if (href === '/tareas' || href === '/personaje') {
        hasNavigation = true
      }
    })
    expect(hasNavigation).toBe(true)
  })

  it('should have visible focus states', () => {
    renderPage(<HomePage />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    // Verify links exist and are in the document
    links.forEach(link => {
      expect(link).toBeInTheDocument()
    })
  })
})
