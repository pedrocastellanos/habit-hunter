import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAdjustedGameStats } from './useAdjustedGameStats'
import { getEquipmentStatModifiers } from '@/game/equipmentStats'
import {
    MOVE_SPEED,
    JUMP_FORCE,
    MAX_SHOT_DISTANCE,
    ROAMER_ATTACK_COOLDOWN,
    PLAYER_DAMAGE_PER_HIT,
} from '@/constants/arena'

describe('useAdjustedGameStats hook', () => {
    it('should return base values when modifiers are null', () => {
        const { result } = renderHook(() => useAdjustedGameStats(null))

        expect(result.current.moveSpeed).toBe(MOVE_SPEED)
        expect(result.current.jumpForce).toBe(JUMP_FORCE)
        expect(result.current.maxShotDistance).toBe(MAX_SHOT_DISTANCE)
        expect(result.current.shootCooldown).toBe(80)
        expect(result.current.playerDamagePerHit).toBe(PLAYER_DAMAGE_PER_HIT)
        expect(result.current.roamerAttackCooldown).toBe(ROAMER_ATTACK_COOLDOWN)
        expect(result.current.evasionChance).toBe(0)
    })

    it('should apply weapon damage multiplier', () => {
        const modifiers = getEquipmentStatModifiers('weapon-neon-laser-rifle')
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        const expectedDamage = PLAYER_DAMAGE_PER_HIT * modifiers.damageMultiplier
        expect(result.current.playerDamagePerHit).toBe(expectedDamage)
    })

    it('should apply movement speed multiplier', () => {
        const modifiers = getEquipmentStatModifiers('accessory-cyber-boots')
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        const expectedSpeed = MOVE_SPEED * modifiers.moveSpeedMultiplier
        expect(result.current.moveSpeed).toBe(expectedSpeed)
        expect(result.current.moveSpeed).toBeGreaterThan(MOVE_SPEED)
    })

    it('should apply jump boost multiplier', () => {
        const modifiers = getEquipmentStatModifiers('accessory-cyber-boots')
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        const expectedJump = JUMP_FORCE * modifiers.jumpBoostMultiplier
        expect(result.current.jumpForce).toBe(expectedJump)
        expect(result.current.jumpForce).toBeGreaterThan(JUMP_FORCE)
    })

    it('should apply shoot cooldown reduction', () => {
        const modifiers = getEquipmentStatModifiers('weapon-void-annihilator')
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        const expectedCooldown = Math.max(
            20,
            80 - modifiers.shootCooldownReduction,
        )
        expect(result.current.shootCooldown).toBe(expectedCooldown)
        expect(result.current.shootCooldown).toBeLessThan(80)
    })

    it('should apply shoot distance bonus', () => {
        const modifiers = getEquipmentStatModifiers('weapon-plasma-cannon')
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        const expectedDistance = MAX_SHOT_DISTANCE + modifiers.shootDistanceBonus
        expect(result.current.maxShotDistance).toBe(expectedDistance)
        expect(result.current.maxShotDistance).toBeGreaterThan(MAX_SHOT_DISTANCE)
    })

    it('should apply enemy attack cooldown reduction', () => {
        const modifiers = getEquipmentStatModifiers('shield-void-shield-core')
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        const expectedCooldown = Math.max(
            300,
            ROAMER_ATTACK_COOLDOWN - modifiers.enemyAttackCooldownReduction,
        )
        expect(result.current.roamerAttackCooldown).toBe(expectedCooldown)
        expect(result.current.roamerAttackCooldown).toBeLessThan(ROAMER_ATTACK_COOLDOWN)
    })

    it('should apply evasion chance', () => {
        const modifiers = getEquipmentStatModifiers('accessory-temporal-accelerator')
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        expect(result.current.evasionChance).toBe(modifiers.evasionChance)
        expect(result.current.evasionChance).toBeGreaterThan(0)
    })

    it('should have minimum shoot cooldown of 20ms', () => {
        const modifiers = getEquipmentStatModifiers('weapon-void-annihilator')
        modifiers.shootCooldownReduction = 100 // Try to exceed limit
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        expect(result.current.shootCooldown).toBeGreaterThanOrEqual(20)
    })

    it('should have minimum roamer attack cooldown of 300ms', () => {
        const modifiers = getEquipmentStatModifiers('shield-void-shield-core')
        modifiers.enemyAttackCooldownReduction = 5000 // Try to exceed limit
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        expect(result.current.roamerAttackCooldown).toBeGreaterThanOrEqual(300)
    })

    it('should combine multiple modifiers from equipment', () => {
        const modifiers = getEquipmentStatModifiers('weapon-void-annihilator')
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        // Should have high damage
        expect(result.current.playerDamagePerHit).toBeGreaterThan(PLAYER_DAMAGE_PER_HIT)
        // Should have extended range
        expect(result.current.maxShotDistance).toBeGreaterThan(MAX_SHOT_DISTANCE)
        // Should have fast attack
        expect(result.current.shootCooldown).toBeLessThan(80)
    })

    it('should update when modifiers change', () => {
        const { result, rerender } = renderHook(
            ({ mod }) => useAdjustedGameStats(mod),
            { initialProps: { mod: getEquipmentStatModifiers('weapon-pulse-blaster') } },
        )
        const initialDamage = result.current.playerDamagePerHit

        rerender({ mod: getEquipmentStatModifiers('weapon-void-annihilator') })
        expect(result.current.playerDamagePerHit).toBeGreaterThan(initialDamage)
    })

    it('should maintain reasonable stat values', () => {
        const modifiers = getEquipmentStatModifiers('weapon-void-annihilator')
        const { result } = renderHook(() => useAdjustedGameStats(modifiers))

        expect(result.current.moveSpeed).toBeGreaterThan(0)
        expect(result.current.jumpForce).toBeGreaterThan(0)
        expect(result.current.maxShotDistance).toBeGreaterThan(0)
        expect(result.current.shootCooldown).toBeGreaterThan(0)
        expect(result.current.playerDamagePerHit).toBeGreaterThan(0)
        expect(result.current.roamerAttackCooldown).toBeGreaterThan(0)
        expect(result.current.evasionChance).toBeGreaterThanOrEqual(0)
        expect(result.current.evasionChance).toBeLessThanOrEqual(1)
    })
})
