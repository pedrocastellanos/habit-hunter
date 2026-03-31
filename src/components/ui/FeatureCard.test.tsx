import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureCard } from './FeatureCard'
import type { Variants } from 'framer-motion'

const mockVariant: Variants = {
    initial: { opacity: 0 },
    hover: { opacity: 1 },
}

describe('FeatureCard Component', () => {
    it('should render feature card', () => {
        render(
            <FeatureCard
                icon="🎯"
                title="Test Feature"
                description="Test Description"
                accentColor="cyan"
                variant={mockVariant}
            />
        )

        expect(screen.getByText('Test Feature')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('should display icon', () => {
        render(
            <FeatureCard
                icon="🚀"
                title="Rocket Feature"
                description="Test Description"
                accentColor="cyan"
                variant={mockVariant}
            />
        )

        expect(screen.getByText('🚀')).toBeInTheDocument()
    })

    it('should display title', () => {
        render(
            <FeatureCard
                icon="🎯"
                title="My Feature"
                description="Test Description"
                accentColor="cyan"
                variant={mockVariant}
            />
        )

        expect(screen.getByText('My Feature')).toBeInTheDocument()
    })

    it('should display description', () => {
        render(
            <FeatureCard
                icon="🎯"
                title="Feature"
                description="This is my feature description"
                accentColor="cyan"
                variant={mockVariant}
            />
        )

        expect(screen.getByText('This is my feature description')).toBeInTheDocument()
    })

    it('should support different accent colors', () => {
        const colors: ('cyan' | 'purple' | 'green')[] = ['cyan', 'purple', 'green']

        colors.forEach(color => {
            const { unmount } = render(
                <FeatureCard
                    icon="🎯"
                    title="Feature"
                    description="Description"
                    accentColor={color}
                    variant={mockVariant}
                />
            )

            expect(screen.getByText('Feature')).toBeInTheDocument()
            unmount()
        })
    })

    it('should handle long title', () => {
        const longTitle = 'This is a very long feature title that might wrap to multiple lines'
        render(
            <FeatureCard
                icon="🎯"
                title={longTitle}
                description="Description"
                accentColor="cyan"
                variant={mockVariant}
            />
        )

        expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('should handle long description', () => {
        const longDesc = 'This is a very long description that contains lots of information about the feature and what it does'
        render(
            <FeatureCard
                icon="🎯"
                title="Feature"
                description={longDesc}
                accentColor="cyan"
                variant={mockVariant}
            />
        )

        expect(screen.getByText(longDesc)).toBeInTheDocument()
    })

    it('should handle different emoji icons', () => {
        const icons = ['🎯', '🚀', '⚡', '🔬', '📡']

        icons.forEach(icon => {
            const { unmount } = render(
                <FeatureCard
                    icon={icon}
                    title="Feature"
                    description="Description"
                    accentColor="cyan"
                    variant={mockVariant}
                />
            )

            expect(screen.getByText(icon)).toBeInTheDocument()
            unmount()
        })
    })
})
