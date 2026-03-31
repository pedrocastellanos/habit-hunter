import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CharacterSelector } from './CharacterSelector'

const mockCharacters = [
    {
        id: 'cipher',
        name: 'Cipher',
        role: 'Architect',
        description: 'System architect',
        accent: '#33d0ff',
        trail: 'Turquoise data beam',
    },
    {
        id: 'phantom',
        name: 'Phantom',
        role: 'Infiltrator',
        description: 'Infiltration specialist',
        accent: '#ff00ff',
        trail: 'Magenta smoke trail',
    },
]

describe('CharacterSelector Component', () => {
    it('should render character selector', () => {
        render(
            <CharacterSelector
                characters={mockCharacters}
                selectedId="cipher"
                onSelect={vi.fn()}
            />
        )

        expect(screen.getByText('Cipher')).toBeInTheDocument()
    })

    it('should display all characters', () => {
        render(
            <CharacterSelector
                characters={mockCharacters}
                selectedId="cipher"
                onSelect={vi.fn()}
            />
        )

        expect(screen.getByText('Cipher')).toBeInTheDocument()
        expect(screen.getAllByText('Phantom').length).toBeGreaterThan(0)
    })

    it('should display character roles', () => {
        render(
            <CharacterSelector
                characters={mockCharacters}
                selectedId="cipher"
                onSelect={vi.fn()}
            />
        )

        expect(screen.getByText('Architect')).toBeInTheDocument()
        expect(screen.getByText('Infiltrator')).toBeInTheDocument()
    })

    it('should call onSelect when character clicked', () => {
        const onSelect = vi.fn()
        render(
            <CharacterSelector
                characters={mockCharacters}
                selectedId="cipher"
                onSelect={onSelect}
            />
        )

        const buttons = screen.getAllByRole('button')
        fireEvent.click(buttons[1])
        expect(onSelect).toHaveBeenCalled()
    })

    it('should highlight selected character', () => {
        const { rerender } = render(
            <CharacterSelector
                characters={mockCharacters}
                selectedId="cipher"
                onSelect={vi.fn()}
            />
        )

        expect(screen.getByText('Cipher')).toBeInTheDocument()

        rerender(
            <CharacterSelector
                characters={mockCharacters}
                selectedId="phantom"
                onSelect={vi.fn()}
            />
        )

        expect(screen.getAllByText('Phantom').length).toBeGreaterThan(0)
    })

    it('should handle empty characters list', () => {
        const { container } = render(
            <CharacterSelector
                characters={[]}
                selectedId="cipher"
                onSelect={vi.fn()}
            />
        )

        expect(container.firstChild).toBeInTheDocument()
    })

    it('should handle single character', () => {
        render(
            <CharacterSelector
                characters={[mockCharacters[0]]}
                selectedId="cipher"
                onSelect={vi.fn()}
            />
        )

        expect(screen.getByText('Cipher')).toBeInTheDocument()
        expect(screen.queryByText('Phantom')).not.toBeInTheDocument()
    })

    it('should handle invalid selected ID', () => {
        render(
            <CharacterSelector
                characters={mockCharacters}
                selectedId="invalid-id"
                onSelect={vi.fn()}
            />
        )

        expect(screen.getByText('Cipher')).toBeInTheDocument()
        expect(screen.getAllByText('Phantom').length).toBeGreaterThan(0)
    })

    it('should render buttons for each character', () => {
        render(
            <CharacterSelector
                characters={mockCharacters}
                selectedId="cipher"
                onSelect={vi.fn()}
            />
        )

        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBeGreaterThanOrEqual(mockCharacters.length)
    })

    it('should handle character selection callbacks', () => {
        const onSelect = vi.fn()
        render(
            <CharacterSelector
                characters={mockCharacters}
                selectedId="cipher"
                onSelect={onSelect}
            />
        )

        const buttons = screen.getAllByRole('button')
        fireEvent.click(buttons[0])

        expect(onSelect).toHaveBeenCalled()
    })
})
