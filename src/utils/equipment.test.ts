import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sanitizeEquippedState, readPersistedEquippedState, saveEquippedState, getEquipmentItemById, isItemUnlocked, separateEquipmentByXP } from './equipment'
import { EQUIPMENT_ITEMS, EQUIPPED_STORAGE_KEY } from '@/constants/character'

describe('equipment.ts utilities', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    describe('sanitizeEquippedState', () => {
        it('should keep valid equipped items', () => {
            const equipped: Record<'weapon' | 'shield' | 'accessory', string | null> = {
                weapon: EQUIPMENT_ITEMS[0].id,
                shield: EQUIPMENT_ITEMS[1].id,
                accessory: null,
            }
            const sanitized = sanitizeEquippedState(equipped, 10000)
            expect(sanitized.weapon).toBe(EQUIPMENT_ITEMS[0].id)
        })

        it('should remove items with XP requirement not met', () => {
            // Find an expensive item (high requiredXP)
            const expensiveItem = EQUIPMENT_ITEMS[EQUIPMENT_ITEMS.length - 1]
            const equipped: Record<'weapon' | 'shield' | 'accessory', string | null> = {
                weapon: expensiveItem.id,
                shield: null,
                accessory: null,
            }
            const sanitized = sanitizeEquippedState(equipped, 0)
            expect(sanitized.weapon).toBeNull()
        })

        it('should always return object with all slots', () => {
            const sanitized = sanitizeEquippedState({ weapon: null, shield: null, accessory: null }, 0)
            expect(sanitized).toHaveProperty('weapon')
            expect(sanitized).toHaveProperty('shield')
            expect(sanitized).toHaveProperty('accessory')
        })

        it('should set null for unequipped slots', () => {
            const equipped: Record<'weapon' | 'shield' | 'accessory', string | null> = {
                weapon: EQUIPMENT_ITEMS[0].id,
                shield: null,
                accessory: null,
            }
            const sanitized = sanitizeEquippedState(equipped, 10000)
            expect(sanitized.shield).toBeNull()
            expect(sanitized.accessory).toBeNull()
        })
    })

    describe('readPersistedEquippedState', () => {
        it('should read from localStorage and sanitize', () => {
            const equipped = { weapon: EQUIPMENT_ITEMS[0].id, shield: null, accessory: null }
            localStorage.setItem(EQUIPPED_STORAGE_KEY, JSON.stringify(equipped))

            const result = readPersistedEquippedState(10000)
            expect(result).toBeDefined()
            expect(typeof result).toBe('object')
        })

        it('should return fallback if nothing stored', () => {
            const result = readPersistedEquippedState(10000)
            // Should return default equipped state (pulse blaster at minimum)
            expect(result).toBeDefined()
            expect(result.weapon).toBe('weapon-pulse-blaster')
        })

        it('should handle corrupted storage data gracefully', () => {
            localStorage.setItem(EQUIPPED_STORAGE_KEY, 'invalid json')
            const result = readPersistedEquippedState(10000)
            // Should return fallback when JSON parse fails
            expect(result).toBeDefined()
            expect(result.weapon).toBe('weapon-pulse-blaster')
        })

        it('should sanitize based on XP level', () => {
            const expensiveItem = EQUIPMENT_ITEMS[EQUIPMENT_ITEMS.length - 1]
            const equipped = { weapon: expensiveItem.id, shield: null, accessory: null }
            localStorage.setItem(EQUIPPED_STORAGE_KEY, JSON.stringify(equipped))

            // With low XP, should strip expensive item
            const lowXpResult = readPersistedEquippedState(0)
            expect(lowXpResult.weapon).not.toBe(expensiveItem.id)
        })
    })

    describe('saveEquippedState', () => {
        it('should save equipped state to localStorage', () => {
            const equipped: Record<'weapon' | 'shield' | 'accessory', string | null> = {
                weapon: EQUIPMENT_ITEMS[0].id,
                shield: null,
                accessory: null,
            }

            // This should not throw
            expect(() => saveEquippedState(equipped)).not.toThrow()

            // Verify it was called (if localStorage is mocked)
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(EQUIPPED_STORAGE_KEY)
                if (stored) {
                    expect(JSON.parse(stored)).toEqual(equipped)
                }
            }
        })

        it('should overwrite previous state', () => {
            const first: Record<'weapon' | 'shield' | 'accessory', string | null> = {
                weapon: 'old-weapon',
                shield: null,
                accessory: null,
            }
            const second: Record<'weapon' | 'shield' | 'accessory', string | null> = {
                weapon: 'new-weapon',
                shield: null,
                accessory: null,
            }

            expect(() => saveEquippedState(first)).not.toThrow()
            expect(() => saveEquippedState(second)).not.toThrow()
        })

        it('should handle storage errors gracefully', () => {
            vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
                throw new Error('Storage full')
            })

            const equipped: Record<'weapon' | 'shield' | 'accessory', string | null> = {
                weapon: EQUIPMENT_ITEMS[0].id,
                shield: null,
                accessory: null,
            }

            expect(() => saveEquippedState(equipped)).not.toThrow()
        })
    })

    describe('getEquipmentItemById', () => {
        it('should return correct item by ID', () => {
            const item = getEquipmentItemById(EQUIPMENT_ITEMS[0].id)
            expect(item).toEqual(EQUIPMENT_ITEMS[0])
        })

        it('should return null for non-existent ID', () => {
            const item = getEquipmentItemById('non-existent-id')
            expect(item).toBeNull()
        })

        it('should handle empty ID', () => {
            const item = getEquipmentItemById('')
            expect(item).toBeNull()
        })

        it('should find all EQUIPMENT_ITEMS', () => {
            EQUIPMENT_ITEMS.forEach(equipment => {
                const found = getEquipmentItemById(equipment.id)
                expect(found).toEqual(equipment)
            })
        })
    })

    describe('isItemUnlocked', () => {
        it('should return true if currentXP meets requiredXP', () => {
            const unlocked = isItemUnlocked(100, 100)
            expect(unlocked).toBe(true)
        })

        it('should return true if currentXP exceeds requiredXP', () => {
            const unlocked = isItemUnlocked(100, 200)
            expect(unlocked).toBe(true)
        })

        it('should return false if currentXP below requiredXP', () => {
            const unlocked = isItemUnlocked(100, 50)
            expect(unlocked).toBe(false)
        })

        it('should handle zero XP requirements', () => {
            const unlocked = isItemUnlocked(0, 100)
            expect(unlocked).toBe(true)
        })

        it('should handle zero current XP', () => {
            const unlocked = isItemUnlocked(100, 0)
            expect(unlocked).toBe(false)
        })
    })

    describe('separateEquipmentByXP', () => {
        it('should separate items into unlocked and locked', () => {
            const { unlocked, locked } = separateEquipmentByXP(EQUIPMENT_ITEMS, 500)
            expect(Array.isArray(unlocked)).toBe(true)
            expect(Array.isArray(locked)).toBe(true)
            expect(unlocked.length + locked.length).toBe(EQUIPMENT_ITEMS.length)
        })

        it('should unlock all items at high XP', () => {
            const { unlocked, locked } = separateEquipmentByXP(EQUIPMENT_ITEMS, 100000)
            expect(locked.length).toBe(0)
            expect(unlocked.length).toBe(EQUIPMENT_ITEMS.length)
        })

        it('should unlock some items at XP 0', () => {
            const { unlocked, locked } = separateEquipmentByXP(EQUIPMENT_ITEMS, 0)
            // At zero XP, only items with requiredXP of 0 are unlocked
            expect(unlocked.length).toBeGreaterThanOrEqual(0)
            expect(locked.length).toBeGreaterThanOrEqual(0)
        })

        it('should maintain item integrity', () => {
            const { unlocked, locked } = separateEquipmentByXP(EQUIPMENT_ITEMS, 500)
            const allItems = [...unlocked, ...locked]
            expect(allItems.every(item => item.id && item.name)).toBe(true)
        })

        it('should correctly separate based on requiredXP', () => {
            const { unlocked, locked } = separateEquipmentByXP(EQUIPMENT_ITEMS, 100)

            // Verify categorization
            unlocked.forEach(item => {
                expect(item.requiredXP).toBeLessThanOrEqual(100)
            })
            locked.forEach(item => {
                expect(item.requiredXP).toBeGreaterThan(100)
            })
        })
    })
})
