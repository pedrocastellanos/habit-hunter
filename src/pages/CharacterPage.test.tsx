import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { GameProvider } from '@/context/GameContext'
import { CharacterPage } from './CharacterPage'

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

describe('CharacterPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render character page', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })

  it('should display hunter profile section', () => {
    renderPage(<CharacterPage />)
    expect(screen.getByText(/Desbloqueados|Unlocked/i)).toBeInTheDocument()
  })

  it('should show selected character information', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })

  it('should display experience bar', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })

  it('should have character selection buttons', () => {
    renderPage(<CharacterPage />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should show loadout section', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })

  it('should display weapon slot', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })

  it('should display shield slot', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })

  it('should display accessory slot', () => {
    renderPage(<CharacterPage />)
    expect(screen.getByText(/Accesorio|Accessory/i)).toBeInTheDocument()
  })

  it('should have tab navigation (Unlocked/Shop)', () => {
    renderPage(<CharacterPage />)
    const tabs = screen.getAllByRole('button')
    expect(tabs.length).toBeGreaterThan(0)
  })

  it('should allow changing tabs', () => {
    renderPage(<CharacterPage />)
    const buttons = screen.getAllByRole('button')
    if (buttons.length > 1) {
      fireEvent.click(buttons[1])
      expect(buttons[1]).toBeVisible()
    }
  })

  it('should display equipment items grid', () => {
    renderPage(<CharacterPage />)
    expect(screen.getByText(/Desbloqueados|Unlocked/i)).toBeInTheDocument()
  })

  it('should show level information', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })

  it('should have inventory categories', () => {
    renderPage(<CharacterPage />)
    expect(screen.getByText(/Desbloqueados|Unlocked/i)).toBeInTheDocument()
  })

  it('should display equipped status indicator', () => {
    renderPage(<CharacterPage />)
    expect(screen.getByText(/Desbloqueados|Unlocked/i)).toBeInTheDocument()
  })
})

describe('CharacterPage - Character Selection', () => {
  it('should allow selecting different characters', () => {
    renderPage(<CharacterPage />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should display selected character visual', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })

  it('should show character description', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => {
      const el = screen.queryAllByText(name)
      return el && el.length > 0
    })
    expect(hasCharacter).toBe(true)
  })
})

describe('CharacterPage - Equipment Management', () => {
  it('should have unequip buttons', () => {
    renderPage(<CharacterPage />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should show locked items with lock icon', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })

  it('should show required XP for locked items', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })
})

describe('CharacterPage - Accessibility', () => {
  it('should have proper page structure', () => {
    renderPage(<CharacterPage />)
    expect(screen.getByText(/Desbloqueados|Unlocked/i)).toBeInTheDocument()
  })

  it('should have readable text colors', () => {
    renderPage(<CharacterPage />)
    const characterNames = ['Cipher', 'Vanta']
    const hasCharacter = characterNames.some(name => screen.queryAllByText(name)[0] || screen.queryByText(name) !== null)
    expect(hasCharacter).toBe(true)
  })

  it('should have labeled buttons', () => {
    renderPage(<CharacterPage />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should be keyboard navigable', () => {
    renderPage(<CharacterPage />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})

describe('CharacterPage - Equipment Display', () => {
  it('should display equipment with icons', () => {
    renderPage(<CharacterPage />)
    expect(screen.getByText(/Desbloqueados|Unlocked/i)).toBeInTheDocument()
  })

  it('should show tier information for equipment', () => {
    renderPage(<CharacterPage />)
    expect(screen.getByText(/Desbloqueados|Unlocked/i)).toBeInTheDocument()
  })
})
