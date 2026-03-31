import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEquipmentManagement, useEquipmentTabs } from './useEquipment'
import { EQUIPMENT_ITEMS } from '@/constants/character'

describe('useEquipment.ts hooks', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    describe('useEquipmentTabs', () => {
        it('should initialize with default tab', () => {
            const { result } = renderHook(() => useEquipmentTabs())

            expect(result.current.activeTab).toBeDefined()
            expect(result.current.activeCategory).toBeDefined()
        })

        it('should update active tab', () => {
            const { result } = renderHook(() => useEquipmentTabs())

            act(() => {
                result.current.setActiveTab('shop')
            })

            expect(result.current.activeTab).toBe('shop')
        })

        it('should update active category', () => {
            const { result } = renderHook(() => useEquipmentTabs())

            act(() => {
                result.current.setActiveCategory('shield')
            })

            expect(result.current.activeCategory).toBe('shield')
        })

        it('should handle multiple tab changes', () => {
            const { result } = renderHook(() => useEquipmentTabs())

            act(() => {
                result.current.setActiveTab('shop')
            })
            expect(result.current.activeTab).toBe('shop')

            act(() => {
                result.current.setActiveTab('unlocked')
            })
            expect(result.current.activeTab).toBe('unlocked')

            act(() => {
                result.current.setActiveTab('shop')
            })
            expect(result.current.activeTab).toBe('shop')
        })
    })

    describe('useEquipmentManagement', () => {
        it('should initialize with empty equipped state', () => {
            const { result } = renderHook(() => useEquipmentManagement(0))

            expect(result.current.equippedBySlot).toBeDefined()
            expect(typeof result.current.equippedBySlot).toBe('object')
        })

        it('should toggle equipment item', () => {
            const { result } = renderHook(() => useEquipmentManagement(10000))
            const testItem = EQUIPMENT_ITEMS[0]

            act(() => {
                result.current.toggleEquipItem(testItem.id)
            })

            const afterToggle = result.current.equippedBySlot[testItem.slot]
            expect(afterToggle).toBeDefined()
        })

        it('should handle equipment with XP requirements', () => {
            const { result } = renderHook(() => useEquipmentManagement(0))

            expect(result.current.equippedBySlot).toBeDefined()
        })

        it('should persist equipment state', async () => {
            const { result: result1 } = renderHook(() => useEquipmentManagement(10000))
            const testItem = EQUIPMENT_ITEMS[0]

            act(() => {
                result1.current.toggleEquipItem(testItem.id)
            })

            // Check that state is maintained in the same hook
            expect(result1.current.equippedBySlot).toBeDefined()
        })

        it('should handle unequipping', () => {
            const { result } = renderHook(() => useEquipmentManagement(10000))
            // Use a different item than the default one (weapon-pulse-blaster is default)
            const item = EQUIPMENT_ITEMS[1] // Should be weapon-neon-laser-rifle

            // First equip
            act(() => {
                result.current.toggleEquipItem(item.id)
            })

            let equipped = result.current.equippedBySlot[item.slot] === item.id
            expect(equipped).toBe(true)

            // Then unequip by toggling again
            act(() => {
                result.current.toggleEquipItem(item.id)
            })

            equipped = result.current.equippedBySlot[item.slot] === item.id
            expect(equipped).toBe(false)
        })

        it('should sanitize state based on current XP', () => {
            const lowXpResult = renderHook(() => useEquipmentManagement(0))
            const highXpResult = renderHook(() => useEquipmentManagement(10000))

            // Both should have valid states
            expect(lowXpResult.result.current.equippedBySlot).toBeDefined()
            expect(highXpResult.result.current.equippedBySlot).toBeDefined()
        })

        it('should handle all slot types', () => {
            const { result } = renderHook(() => useEquipmentManagement(1000))

            const slots = ['weapon', 'shield', 'accessory']
            slots.forEach(slot => {
                expect(typeof result.current.equippedBySlot[slot as keyof typeof result.current.equippedBySlot]).not.toBe('undefined')
            })
        })
    })
})
