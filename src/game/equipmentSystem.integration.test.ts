import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEquipmentModifiers } from '@/hooks/useEquipmentModifiers'
import { useAdjustedGameStats } from '@/hooks/useAdjustedGameStats'
import { getEquipmentStatModifiers, combineStatModifiers } from '@/game/equipmentStats'
import {
    MOVE_SPEED,
    JUMP_FORCE,
    MAX_SHOT_DISTANCE,
    PLAYER_DAMAGE_PER_HIT,
} from '@/constants/arena'

describe('Equipment System Integration', () => {
    describe('Full Equipment Flow', () => {
        it('should flow from raw equipment IDs to adjusted game stats', () => {
            // Step 1: Get equipment modifiers from IDs
            const { result: equipmentResult } = renderHook(() =>
                useEquipmentModifiers([
                    'weapon-void-annihilator',
                    'shield-void-shield-core',
                    'accessory-temporal-accelerator',
                ]),
            )

            // Step 2: Convert to adjusted game stats
            const { result: statsResult } = renderHook(() =>
                useAdjustedGameStats(equipmentResult.current),
            )

            // Verify final stats are adjusted
            expect(statsResult.current.playerDamagePerHit).toBeGreaterThan(PLAYER_DAMAGE_PER_HIT)
            expect(statsResult.current.moveSpeed).toBeGreaterThan(MOVE_SPEED)
            expect(statsResult.current.jumpForce).toBeGreaterThan(JUMP_FORCE)
            expect(statsResult.current.maxShotDistance).toBeGreaterThan(MAX_SHOT_DISTANCE)
        })

        it('should handle offensive build correctly', () => {
            const { result: equipmentResult } = renderHook(() =>
                useEquipmentModifiers(['weapon-void-annihilator', 'accessory-temporal-accelerator']),
            )

            const { result: statsResult } = renderHook(() =>
                useAdjustedGameStats(equipmentResult.current),
            )

            // Offensive build should have high damage and fast attacks
            expect(statsResult.current.playerDamagePerHit).toBeGreaterThan(
                PLAYER_DAMAGE_PER_HIT * 1.8,
            )
            expect(statsResult.current.shootCooldown).toBeLessThan(40)
        })

        it('should handle defensive build correctly', () => {
            const { result: equipmentResult } = renderHook(() =>
                useEquipmentModifiers(['shield-void-shield-core', 'accessory-holographic-cloak']),
            )

            const { result: statsResult } = renderHook(() =>
                useAdjustedGameStats(equipmentResult.current),
            )

            // Defensive build should have high evasion
            expect(statsResult.current.evasionChance).toBeGreaterThan(0.25)
        })

        it('should handle balanced build correctly', () => {
            const { result: equipmentResult } = renderHook(() =>
                useEquipmentModifiers([
                    'weapon-plasma-cannon',
                    'shield-photon-barrier',
                    'accessory-temporal-accelerator',
                ]),
            )

            const { result: statsResult } = renderHook(() =>
                useAdjustedGameStats(equipmentResult.current),
            )

            // Balanced build should have decent offense and defense
            expect(statsResult.current.playerDamagePerHit).toBeGreaterThan(PLAYER_DAMAGE_PER_HIT)
            expect(statsResult.current.moveSpeed).toBeGreaterThan(MOVE_SPEED)
            expect(statsResult.current.evasionChance).toBeGreaterThan(0)
        })
    })

    describe('Equipment Progression', () => {
        it('should show progression from early to late game equipment', () => {
            // Early game
            const { result: earlyResult } = renderHook(() =>
                useEquipmentModifiers(['weapon-pulse-blaster']),
            )

            // Mid game
            const { result: midResult } = renderHook(() =>
                useEquipmentModifiers(['weapon-plasma-cannon', 'shield-plasma-deflector']),
            )

            // Late game
            const { result: lateResult } = renderHook(() =>
                useEquipmentModifiers([
                    'weapon-void-annihilator',
                    'shield-void-shield-core',
                    'accessory-temporal-accelerator',
                ]),
            )

            // Verify progression
            expect(earlyResult.current.damageMultiplier).toBeLessThan(
                midResult.current.damageMultiplier,
            )
            expect(midResult.current.damageMultiplier).toBeLessThan(
                lateResult.current.damageMultiplier,
            )
        })
    })

    describe('Manual Equipment Combination', () => {
        it('should combine modifiers manually like the system does', () => {
            const weapon = getEquipmentStatModifiers('weapon-quantum-disruptor')
            const shield = getEquipmentStatModifiers('shield-quantum-shield')
            const accessory = getEquipmentStatModifiers('accessory-ai-companion-drone')

            const combined = combineStatModifiers(weapon, shield, accessory)

            // Verify combinations work correctly
            expect(combined.damageMultiplier).toBeGreaterThan(1.0)
            expect(combined.defenseMultiplier).toBeLessThan(1.0)
            expect(combined.healthBonus).toBeGreaterThan(0)
            expect(combined.evasionChance).toBeGreaterThanOrEqual(0)
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty equipment array', () => {
            const { result: equipmentResult } = renderHook(() => useEquipmentModifiers([]))

            const { result: statsResult } = renderHook(() =>
                useAdjustedGameStats(equipmentResult.current),
            )

            // Should have base stats
            expect(statsResult.current.moveSpeed).toBe(MOVE_SPEED)
            expect(statsResult.current.playerDamagePerHit).toBe(PLAYER_DAMAGE_PER_HIT)
        })

        it('should handle single equipment item', () => {
            const { result: equipmentResult } = renderHook(() =>
                useEquipmentModifiers(['weapon-neon-laser-rifle']),
            )

            const { result: statsResult } = renderHook(() =>
                useAdjustedGameStats(equipmentResult.current),
            )

            // Should have modified stats from single item
            expect(statsResult.current.playerDamagePerHit).toBeGreaterThan(PLAYER_DAMAGE_PER_HIT)
        })

        it('should handle all three equipment slots filled', () => {
            const { result: equipmentResult } = renderHook(() =>
                useEquipmentModifiers([
                    'weapon-void-annihilator',
                    'shield-void-shield-core',
                    'accessory-temporal-accelerator',
                ]),
            )

            const { result: statsResult } = renderHook(() =>
                useAdjustedGameStats(equipmentResult.current),
            )

            // All slots filled should provide cumulative bonuses
            expect(statsResult.current.playerDamagePerHit).toBeGreaterThan(
                PLAYER_DAMAGE_PER_HIT * 1.5,
            )
            expect(statsResult.current.moveSpeed).toBeGreaterThan(MOVE_SPEED)
            expect(statsResult.current.jumpForce).toBeGreaterThan(JUMP_FORCE)
        })

        it('should maintain balance with extreme combinations', () => {
            const { result: modifiersResult } = renderHook(() =>
                useEquipmentModifiers([
                    'weapon-void-annihilator',
                    'shield-void-shield-core',
                    'accessory-temporal-accelerator',
                ]),
            )

            const { result: statsResult } = renderHook(() =>
                useAdjustedGameStats(modifiersResult.current),
            )

            // Even extreme builds should have reasonable limits
            expect(statsResult.current.shootCooldown).toBeGreaterThanOrEqual(20)
            expect(statsResult.current.evasionChance).toBeLessThanOrEqual(0.5)
        })
    })

    describe('Stat Consistency', () => {
        it('should produce consistent results for same equipment', () => {
            const equipment = ['weapon-plasma-cannon', 'shield-quantum-shield', 'accessory-ai-companion-drone']

            // First time
            const { result: modifiersResult1 } = renderHook(() =>
                useEquipmentModifiers(equipment)
            )

            // Second time with same equipment
            const { result: modifiersResult2 } = renderHook(() =>
                useEquipmentModifiers(equipment)
            )

            // Results should be identical
            expect(modifiersResult1.current.damageMultiplier).toBe(modifiersResult2.current.damageMultiplier)
            expect(modifiersResult1.current.moveSpeedMultiplier).toBe(modifiersResult2.current.moveSpeedMultiplier)
        })

        it('should maintain monotonic progression', () => {
            const { result: baseResult } = renderHook(() =>
                useAdjustedGameStats(getEquipmentStatModifiers('weapon-pulse-blaster')),
            )
            const { result: improvedResult } = renderHook(() =>
                useAdjustedGameStats(getEquipmentStatModifiers('weapon-void-annihilator')),
            )

            // Better equipment should generally provide better or equal stats
            expect(improvedResult.current.playerDamagePerHit).toBeGreaterThanOrEqual(
                baseResult.current.playerDamagePerHit,
            )
        })
    })
})
