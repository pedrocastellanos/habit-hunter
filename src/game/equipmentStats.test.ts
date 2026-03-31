import { describe, it, expect, beforeEach } from 'vitest'
import {
    getEquipmentStatModifiers,
    combineStatModifiers,
    EQUIPMENT_STATS,
    type EquipmentStatModifiers,
} from '@/game/equipmentStats'

describe('equipmentStats', () => {
    describe('getEquipmentStatModifiers', () => {
        it('should return modifiers for weapon-pulse-blaster', () => {
            const modifiers = getEquipmentStatModifiers('weapon-pulse-blaster')
            expect(modifiers.damageMultiplier).toBe(1.0)
            expect(modifiers.shootCooldownReduction).toBe(0)
            expect(modifiers.defenseMultiplier).toBe(1.0)
        })

        it('should return modifiers for weapon-neon-laser-rifle', () => {
            const modifiers = getEquipmentStatModifiers('weapon-neon-laser-rifle')
            expect(modifiers.damageMultiplier).toBeGreaterThan(1.0)
            expect(modifiers.shootCooldownReduction).toBeGreaterThan(0)
            expect(modifiers.shootDistanceBonus).toBeGreaterThan(0)
        })

        it('should return modifiers for weapon-void-annihilator', () => {
            const modifiers = getEquipmentStatModifiers('weapon-void-annihilator')
            expect(modifiers.damageMultiplier).toBe(2.0)
            expect(modifiers.shootCooldownReduction).toBe(80)
            expect(modifiers.shootDistanceBonus).toBe(8)
        })

        it('should return modifiers for shield-energy-shield-mk-i', () => {
            const modifiers = getEquipmentStatModifiers('shield-energy-shield-mk-i')
            expect(modifiers.defenseMultiplier).toBeLessThan(1.0)
            expect(modifiers.healthBonus).toBeGreaterThanOrEqual(0)
            expect(modifiers.evasionChance).toBeGreaterThanOrEqual(0)
        })

        it('should return modifiers for accessory-cyber-boots', () => {
            const modifiers = getEquipmentStatModifiers('accessory-cyber-boots')
            expect(modifiers.moveSpeedMultiplier).toBeGreaterThan(1.0)
            expect(modifiers.jumpBoostMultiplier).toBeGreaterThan(1.0)
        })

        it('should return default modifiers for unknown equipment', () => {
            const modifiers = getEquipmentStatModifiers('unknown-item')
            expect(modifiers.damageMultiplier).toBe(1.0)
            expect(modifiers.shootCooldownReduction).toBe(0)
            expect(modifiers.shootDistanceBonus).toBe(0)
            expect(modifiers.defenseMultiplier).toBe(1.0)
            expect(modifiers.moveSpeedMultiplier).toBe(1.0)
            expect(modifiers.jumpBoostMultiplier).toBe(1.0)
            expect(modifiers.healthBonus).toBe(0)
            expect(modifiers.evasionChance).toBe(0)
        })

        it('should return modifiers with description property', () => {
            const modifiers = getEquipmentStatModifiers('weapon-plasma-cannon')
            expect(modifiers.description).toBeDefined()
            expect(typeof modifiers.description).toBe('string')
            expect(modifiers.description.length).toBeGreaterThan(0)
        })
    })

    describe('combineStatModifiers', () => {
        let weaponModifiers: EquipmentStatModifiers

        beforeEach(() => {
            weaponModifiers = getEquipmentStatModifiers('weapon-neon-laser-rifle')
        })

        it('should combine empty array to return default modifiers', () => {
            const combined = combineStatModifiers()
            expect(combined.damageMultiplier).toBe(1.0)
            expect(combined.shootCooldownReduction).toBe(0)
        })

        it('should combine single modifier to return itself', () => {
            const combined = combineStatModifiers(weaponModifiers)
            expect(combined.damageMultiplier).toBe(weaponModifiers.damageMultiplier)
            expect(combined.shootCooldownReduction).toBe(weaponModifiers.shootCooldownReduction)
        })

        it('should multiply damage multipliers', () => {
            const mod1: EquipmentStatModifiers = {
                damageMultiplier: 1.2,
                shootCooldownReduction: 0,
                shootDistanceBonus: 0,
                defenseMultiplier: 1.0,
                moveSpeedMultiplier: 1.0,
                jumpBoostMultiplier: 1.0,
                healthBonus: 0,
                enemyAttackCooldownReduction: 0,
                evasionChance: 0,
                description: '',
            }
            const mod2: EquipmentStatModifiers = {
                damageMultiplier: 1.1,
                shootCooldownReduction: 0,
                shootDistanceBonus: 0,
                defenseMultiplier: 1.0,
                moveSpeedMultiplier: 1.0,
                jumpBoostMultiplier: 1.0,
                healthBonus: 0,
                enemyAttackCooldownReduction: 0,
                evasionChance: 0,
                description: '',
            }
            const combined = combineStatModifiers(mod1, mod2)
            expect(combined.damageMultiplier).toBeCloseTo(1.32)
        })

        it('should add cooldown reductions', () => {
            const mod1: EquipmentStatModifiers = {
                damageMultiplier: 1.0,
                shootCooldownReduction: 20,
                shootDistanceBonus: 0,
                defenseMultiplier: 1.0,
                moveSpeedMultiplier: 1.0,
                jumpBoostMultiplier: 1.0,
                healthBonus: 0,
                enemyAttackCooldownReduction: 0,
                evasionChance: 0,
                description: '',
            }
            const mod2: EquipmentStatModifiers = {
                damageMultiplier: 1.0,
                shootCooldownReduction: 15,
                shootDistanceBonus: 0,
                defenseMultiplier: 1.0,
                moveSpeedMultiplier: 1.0,
                jumpBoostMultiplier: 1.0,
                healthBonus: 0,
                enemyAttackCooldownReduction: 0,
                evasionChance: 0,
                description: '',
            }
            const combined = combineStatModifiers(mod1, mod2)
            expect(combined.shootCooldownReduction).toBe(35)
        })

        it('should cap evasion chance at 50%', () => {
            const mod1: EquipmentStatModifiers = {
                damageMultiplier: 1.0,
                shootCooldownReduction: 0,
                shootDistanceBonus: 0,
                defenseMultiplier: 1.0,
                moveSpeedMultiplier: 1.0,
                jumpBoostMultiplier: 1.0,
                healthBonus: 0,
                enemyAttackCooldownReduction: 0,
                evasionChance: 0.4,
                description: '',
            }
            const mod2: EquipmentStatModifiers = {
                damageMultiplier: 1.0,
                shootCooldownReduction: 0,
                shootDistanceBonus: 0,
                defenseMultiplier: 1.0,
                moveSpeedMultiplier: 1.0,
                jumpBoostMultiplier: 1.0,
                healthBonus: 0,
                enemyAttackCooldownReduction: 0,
                evasionChance: 0.3,
                description: '',
            }
            const combined = combineStatModifiers(mod1, mod2)
            expect(combined.evasionChance).toBeLessThanOrEqual(0.5)
        })

        it('should correctly combine weapon + shield + accessory', () => {
            const weapon = getEquipmentStatModifiers('weapon-void-annihilator')
            const shield = getEquipmentStatModifiers('shield-void-shield-core')
            const accessory = getEquipmentStatModifiers('accessory-temporal-accelerator')

            const combined = combineStatModifiers(weapon, shield, accessory)

            expect(combined.damageMultiplier).toBeGreaterThan(1.0)
            expect(combined.shootCooldownReduction).toBeGreaterThan(0)
            expect(combined.moveSpeedMultiplier).toBeGreaterThan(1.0)
            expect(combined.healthBonus).toBeGreaterThan(0)
        })
    })

    describe('EQUIPMENT_STATS constant', () => {
        it('should have 15 equipment items defined', () => {
            const itemCount = Object.keys(EQUIPMENT_STATS).length
            expect(itemCount).toBe(15)
        })

        it('should have 5 weapons defined', () => {
            const weapons = Object.keys(EQUIPMENT_STATS).filter((key) => key.startsWith('weapon-'))
            expect(weapons).toHaveLength(5)
        })

        it('should have 5 shields defined', () => {
            const shields = Object.keys(EQUIPMENT_STATS).filter((key) => key.startsWith('shield-'))
            expect(shields).toHaveLength(5)
        })

        it('should have 5 accessories defined', () => {
            const accessories = Object.keys(EQUIPMENT_STATS).filter((key) =>
                key.startsWith('accessory-'),
            )
            expect(accessories).toHaveLength(5)
        })

        it('all stats should have valid multiplier range', () => {
            Object.values(EQUIPMENT_STATS).forEach((stat) => {
                expect(stat.damageMultiplier).toBeGreaterThan(0.5)
                expect(stat.damageMultiplier).toBeLessThan(2.1)
                expect(stat.defenseMultiplier).toBeGreaterThan(0.5)
                expect(stat.defenseMultiplier).toBeLessThan(1.1)
                expect(stat.moveSpeedMultiplier).toBeGreaterThan(0.8)
                expect(stat.moveSpeedMultiplier).toBeLessThan(1.3)
                expect(stat.jumpBoostMultiplier).toBeGreaterThan(0.8)
                expect(stat.jumpBoostMultiplier).toBeLessThan(1.3)
            })
        })
    })
})
