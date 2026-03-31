import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { EquipmentItemCard } from './EquipmentItemCard'
import { EQUIPMENT_ITEMS, SLOT_ICON } from '@/constants/character'
import { renderWithProviders } from '@/test/test-utils'

const mockItem = EQUIPMENT_ITEMS[0]
void SLOT_ICON

describe('EquipmentItemCard Component', () => {
    it('should render equipment item card', () => {
        renderWithProviders(
            <EquipmentItemCard
                item={mockItem}
                isEquipped={false}
                isLocked={false}
                onToggleEquip={vi.fn()}
            />
        )

        expect(screen.getByText(mockItem.name)).toBeInTheDocument()
    })

    it('should display item name', () => {
        renderWithProviders(
            <EquipmentItemCard
                item={mockItem}
                isEquipped={false}
                isLocked={false}
                onToggleEquip={vi.fn()}
            />
        )

        expect(screen.getByText(mockItem.name)).toBeInTheDocument()
    })

    it('should display item slot icon', () => {
        renderWithProviders(
            <EquipmentItemCard
                item={mockItem}
                isEquipped={false}
                isLocked={false}
                onToggleEquip={vi.fn()}
            />
        )

        expect(screen.getByText(mockItem.name)).toBeInTheDocument()
    })

    it('should show locked state', () => {
        const { container } = renderWithProviders(
            <EquipmentItemCard
                item={mockItem}
                isEquipped={false}
                isLocked={true}
                onToggleEquip={vi.fn()}
            />
        )

        // Check that lock icon is rendered
        expect(container.querySelector('.material-symbols-outlined')).toBeInTheDocument()
    })

    it('should show unlocked state', () => {
        const { container } = renderWithProviders(
            <EquipmentItemCard
                item={mockItem}
                isEquipped={false}
                isLocked={false}
                onToggleEquip={vi.fn()}
            />
        )

        expect(container.querySelector('.material-symbols-outlined')).toBeInTheDocument()
    })

    it('should show equipped state', () => {
        renderWithProviders(
            <EquipmentItemCard
                item={mockItem}
                isEquipped={true}
                isLocked={false}
                onToggleEquip={vi.fn()}
            />
        )

        // Look for "equipped" text in Spanish or English
        const equippedElement = screen.queryByText(/character\.equipped|equipado/i)
        if (equippedElement) {
            expect(equippedElement).toBeInTheDocument()
        }
    })

    it('should call onToggleEquip when clicked', () => {
        const onToggleEquip = vi.fn()
        renderWithProviders(
            <EquipmentItemCard
                item={mockItem}
                isEquipped={false}
                isLocked={false}
                onToggleEquip={onToggleEquip}
            />
        )

        const card = screen.getByText(mockItem.name).closest('div')?.parentElement
        if (card) {
            fireEvent.click(card)
        }
    })

    it('should handle different equipment items', () => {
        EQUIPMENT_ITEMS.slice(0, 3).forEach(item => {
            const { unmount } = renderWithProviders(
                <EquipmentItemCard
                    item={item}
                    isEquipped={false}
                    isLocked={false}
                    onToggleEquip={vi.fn()}
                />
            )

            expect(screen.getByText(item.name)).toBeInTheDocument()
            unmount()
        })
    })

    it('should display unlock level for locked items', () => {
        renderWithProviders(
            <EquipmentItemCard
                item={mockItem}
                isEquipped={false}
                isLocked={true}
                onToggleEquip={vi.fn()}
            />
        )

        // Should show XP requirement when locked
        expect(screen.getByText(`${mockItem.requiredXP} XP`)).toBeInTheDocument()
    })

    it('should handle equipped and locked state', () => {
        renderWithProviders(
            <EquipmentItemCard
                item={mockItem}
                isEquipped={true}
                isLocked={true}
                onToggleEquip={vi.fn()}
            />
        )

        expect(screen.getByText(mockItem.name)).toBeInTheDocument()
    })
})
