import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEquipmentModifiers } from './useEquipmentModifiers'

describe('useEquipmentModifiers hook', () => {
    it('should return default modifiers for empty equipment list', () => {
        const { result } = renderHook(() => useEquipmentModifiers([]))
        expect(result.current.damageMultiplier).toBeDefined()
        expect(result.current.moveSpeedMultiplier).toBeDefined()
    })

    it('should calculate modifiers for single weapon', () => {
        const { result } = renderHook(() =>
            useEquipmentModifiers(['weapon-neon-laser-rifle']),
        )
        expect(result.current.damageMultiplier).toBeGreaterThan(1.0)
        expect(result.current.shootCooldownReduction).toBeGreaterThan(0)
    })

    it('should combine modifiers for weapon + shield', () => {
        const { result } = renderHook(() =>
            useEquipmentModifiers(['weapon-plasma-cannon', 'shield-photon-barrier']),
        )
        expect(result.current.damageMultiplier).toBeGreaterThan(1.0)
        expect(result.current.defenseMultiplier).toBeLessThan(1.0)
    })

    it('should combine modifiers for weapon + shield + accessory', () => {
        const { result } = renderHook(() =>
            useEquipmentModifiers([
                'weapon-void-annihilator',
                'shield-void-shield-core',
                'accessory-temporal-accelerator',
            ]),
        )
        // Damage: 2.0 * 1.15 * 1.3 = 2.99
        expect(result.current.damageMultiplier).toBeCloseTo(2.99, 1)
        expect(result.current.moveSpeedMultiplier).toBeGreaterThan(1.0)
        expect(result.current.healthBonus).toBeGreaterThan(0)
    })

    it('should handle invalid equipment ids gracefully', () => {
        const { result } = renderHook(() =>
            useEquipmentModifiers(['invalid-id', 'weapon-pulse-blaster']),
        )
        expect(result.current.damageMultiplier).toBeDefined()
        expect(result.current.moveSpeedMultiplier).toBeDefined()
    })

    it('should prioritize damage from weapons', () => {
        const { result: resultWeapon } = renderHook(() =>
            useEquipmentModifiers(['weapon-void-annihilator']),
        )
        const { result: resultNoWeapon } = renderHook(() =>
            useEquipmentModifiers(['shield-energy-shield-mk-i', 'accessory-neon-visor']),
        )
        expect(resultWeapon.current.damageMultiplier).toBeGreaterThan(
            resultNoWeapon.current.damageMultiplier,
        )
    })

    it('should prioritize speed from accessories', () => {
        const { result: resultWithBoots } = renderHook(() =>
            useEquipmentModifiers(['accessory-cyber-boots']),
        )
        const { result: resultWithoutBoots } = renderHook(() =>
            useEquipmentModifiers(['weapon-pulse-blaster']),
        )
        expect(resultWithBoots.current.moveSpeedMultiplier).toBeGreaterThan(
            resultWithoutBoots.current.moveSpeedMultiplier,
        )
    })

    it('should update when equipment changes', () => {
        const { result, rerender } = renderHook(
            ({ items }: { items: string[] }) => useEquipmentModifiers(items),
            { initialProps: { items: ['weapon-pulse-blaster'] } },
        )
        const initialDamage = result.current.damageMultiplier

        rerender({ items: ['weapon-void-annihilator'] })
        expect(result.current.damageMultiplier).toBeGreaterThan(initialDamage)
    })

    it('should have evasion capped at 50%', () => {
        const { result } = renderHook(() =>
            useEquipmentModifiers([
                'accessory-temporal-accelerator',
                'accessory-holographic-cloak',
            ]),
        )
        expect(result.current.evasionChance).toBeLessThanOrEqual(0.5)
    })

    it('should maintain consistent calculation for same equipment', () => {
        const equipment = ['weapon-plasma-cannon', 'shield-quantum-shield', 'accessory-ai-companion-drone']
        const { result: result1 } = renderHook(() => useEquipmentModifiers(equipment))
        const { result: result2 } = renderHook(() => useEquipmentModifiers(equipment))

        expect(result1.current.damageMultiplier).toBe(result2.current.damageMultiplier)
        expect(result1.current.moveSpeedMultiplier).toBe(result2.current.moveSpeedMultiplier)
        expect(result1.current.evasionChance).toBe(result2.current.evasionChance)
    })
})
