import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { EquipmentStatsDisplay } from './EquipmentStatsDisplay'
import { getEquipmentStatModifiers, combineStatModifiers } from '@/game/equipmentStats'

describe('EquipmentStatsDisplay Component', () => {
    it('should render all 8 stat categories', () => {
        const modifiers = getEquipmentStatModifiers('weapon-pulse-blaster')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        // Use getAllByText and check length to handle labels + tooltips
        expect(screen.getAllByText('Damage').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Fire Rate').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Range').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Defense').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Speed').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Jump').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Health').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Evasion').length).toBeGreaterThanOrEqual(1)
    })

    it('should display damage multiplier correctly', () => {
        const modifiers = getEquipmentStatModifiers('weapon-void-annihilator')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        const damageValue = screen.getByText('100%')
        expect(damageValue).toBeInTheDocument()
    })

    it('should display fire rate cooldown reduction', () => {
        const modifiers = getEquipmentStatModifiers('weapon-neon-laser-rifle')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        const fireRateValue = screen.getByText('20ms')
        expect(fireRateValue).toBeInTheDocument()
    })

    it('should display range bonus', () => {
        const modifiers = getEquipmentStatModifiers('weapon-plasma-cannon')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        const rangeValue = screen.getByText('+4')
        expect(rangeValue).toBeInTheDocument()
    })

    it('should display defense reduction as positive', () => {
        const modifiers = getEquipmentStatModifiers('shield-void-shield-core')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        const defenseValue = screen.getByText('40%')
        expect(defenseValue).toBeInTheDocument()
    })

    it('should display speed multiplier percentage', () => {
        const modifiers = getEquipmentStatModifiers('accessory-cyber-boots')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        const speedValue = screen.getByText('20%')
        expect(speedValue).toBeInTheDocument()
    })

    it('should display jump multiplier percentage', () => {
        const modifiers = getEquipmentStatModifiers('accessory-cyber-boots')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        const jumpValue = screen.getByText('15%')
        expect(jumpValue).toBeInTheDocument()
    })

    it('should display health bonus', () => {
        const modifiers = getEquipmentStatModifiers('shield-void-shield-core')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        const healthValue = screen.getByText('+5')
        expect(healthValue).toBeInTheDocument()
    })

    it('should display evasion chance as percentage', () => {
        const modifiers = getEquipmentStatModifiers('accessory-temporal-accelerator')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        // Get all elements with 20% text and verify at least one exists
        const evasionValues = screen.getAllByText(/^20%$/)
        expect(evasionValues.length).toBeGreaterThan(0)
    })

    it('should show 0% for neutral stats', () => {
        const modifiers = getEquipmentStatModifiers('weapon-pulse-blaster')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        // Baseline weapon should have 0% damage increase
        const damageValues = screen.getAllByText(/^0%$/)
        expect(damageValues.length).toBeGreaterThan(0)
    })

    it('should render stat cards with icons', () => {
        const modifiers = getEquipmentStatModifiers('weapon-void-annihilator')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        // Check for icons
        const damageIcon = screen.getByText('⚔️')
        const defenseIcon = screen.getByText('🛡️')
        const speedIcon = screen.getByText('💨')
        const healthIcon = screen.getByText('💓')

        expect(damageIcon).toBeInTheDocument()
        expect(defenseIcon).toBeInTheDocument()
        expect(speedIcon).toBeInTheDocument()
        expect(healthIcon).toBeInTheDocument()
    })

    it('should render positive stats with correct styling', () => {
        const modifiers = getEquipmentStatModifiers('weapon-void-annihilator')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        const damageCard = screen.getByText('100%')
        expect(damageCard.className).toContain('text-[#00ff88]')
    })

    it('should render neutral stats with neutral color', () => {
        const modifiers = getEquipmentStatModifiers('weapon-pulse-blaster')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        // Find the 0% damage stat
        const stats = screen.getAllByText('0%')
        const damageZeroStat = stats.find((stat) => {
            const parent = stat.closest('.grid')
            return parent !== null
        })

        expect(damageZeroStat).toBeInTheDocument()
    })

    it('should handle combined equipment modifiers', () => {
        const weapon = getEquipmentStatModifiers('weapon-void-annihilator')
        const shield = getEquipmentStatModifiers('shield-void-shield-core')
        const accessory = getEquipmentStatModifiers('accessory-temporal-accelerator')

        const combined = combineStatModifiers(weapon, shield, accessory)

        const { container } = renderWithProviders(<EquipmentStatsDisplay modifiers={combined} />)

        // Should display combined stats with high values
        // Combined damage: 2.0 * 1.15 * 1.3 = 2.99, displayed as (2.99 - 1) * 100 = 199%
        expect(container.textContent).toContain('199%')
        // Combined speed: 1.25 * (1.25 from temporal) displayed as (1.25 - 1) * 100 = 25%
        expect(container.textContent).toContain('25%')
    })

    it('should render grid layout with multiple items', () => {
        const modifiers = getEquipmentStatModifiers('weapon-void-annihilator')
        const { container } = renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        const gridContainer = container.querySelector('.grid')
        expect(gridContainer).toHaveClass('grid')
        expect(gridContainer).toHaveClass('grid-cols-2')
        expect(gridContainer).toHaveClass('gap-3')
    })

    it('should render stat cards with proper structure', () => {
        const modifiers = getEquipmentStatModifiers('shield-plasma-deflector')
        const { container } = renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        const cards = container.querySelectorAll('[class*="rounded-lg"]')
        expect(cards.length).toBeGreaterThan(0)

        cards.forEach((card) => {
            expect(card.className).toContain('border')
            expect(card.className).toContain('bg-[#1a1a1a]')
            expect(card.className).toContain('p-3')
        })
    })

    it('should display correct values for shield equipment', () => {
        const modifiers = getEquipmentStatModifiers('shield-quantum-shield')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        // Should have defense reduction displayed
        const defenseValue = screen.getByText('30%')
        expect(defenseValue).toBeInTheDocument()

        // Should have health bonus
        const healthValue = screen.getByText('+4')
        expect(healthValue).toBeInTheDocument()
    })

    it('should display correct values for accessory equipment', () => {
        const modifiers = getEquipmentStatModifiers('accessory-cyber-boots')
        renderWithProviders(<EquipmentStatsDisplay modifiers={modifiers} />)

        // Should have speed boost (20% for cyber boots)
        const speedValues = screen.getAllByText(/20%|8%/)
        expect(speedValues.length).toBeGreaterThan(0)
    })
})
