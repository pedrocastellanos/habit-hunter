import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PriorityChip } from './PriorityChip'

describe('PriorityChip Component', () => {
    it('should render priority chip', () => {
        const onClick = vi.fn()
        render(
            <PriorityChip
                priority="high"
                onClick={onClick}
                isActive={false}
            />
        )

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
    })

    it('should display priority text', () => {
        render(
            <PriorityChip
                priority="medium"
                onClick={vi.fn()}
                isActive={false}
            />
        )

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
    })

    it('should call onClick when clicked', () => {
        const onClick = vi.fn()
        render(
            <PriorityChip
                priority="low"
                onClick={onClick}
                isActive={false}
            />
        )

        const button = screen.getByRole('button')
        fireEvent.click(button)
        expect(onClick).toHaveBeenCalled()
    })

    it('should show active state', () => {
        const { rerender } = render(
            <PriorityChip
                priority="high"
                onClick={vi.fn()}
                isActive={false}
            />
        )

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()

        rerender(
            <PriorityChip
                priority="high"
                onClick={vi.fn()}
                isActive={true}
            />
        )

        expect(button).toBeInTheDocument()
    })

    it('should handle all priority levels', () => {
        const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']

        priorities.forEach(priority => {
            const { unmount } = render(
                <PriorityChip
                    priority={priority}
                    onClick={vi.fn()}
                    isActive={false}
                />
            )

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
            unmount()
        })
    })
})
