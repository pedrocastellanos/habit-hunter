import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusCard } from './StatusCard'

describe('StatusCard Component', () => {
    it('should render status card', () => {
        render(
            <StatusCard
                label="Test Label"
                value={42}
                variant="primary"
            />
        )

        expect(screen.getByText('Test Label')).toBeInTheDocument()
        expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should display label and value', () => {
        render(
            <StatusCard
                label="Active Missions"
                value={5}
                variant="primary"
            />
        )

        expect(screen.getByText('Active Missions')).toBeInTheDocument()
        expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should support primary variant', () => {
        const { container } = render(
            <StatusCard
                label="Primary"
                value={100}
                variant="primary"
            />
        )

        expect(container.firstChild).toBeInTheDocument()
    })

    it('should support secondary variant', () => {
        const { container } = render(
            <StatusCard
                label="Secondary"
                value={50}
                variant="secondary"
            />
        )

        expect(container.firstChild).toBeInTheDocument()
    })

    it('should handle large numbers', () => {
        render(
            <StatusCard
                label="Large Number"
                value={999999}
                variant="primary"
            />
        )

        expect(screen.getByText('999999')).toBeInTheDocument()
    })

    it('should handle zero value', () => {
        render(
            <StatusCard
                label="Zero Value"
                value={0}
                variant="primary"
            />
        )

        expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle negative numbers', () => {
        render(
            <StatusCard
                label="Negative"
                value={-10}
                variant="secondary"
            />
        )

        expect(screen.getByText('-10')).toBeInTheDocument()
    })
})
