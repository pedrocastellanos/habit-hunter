/**
 * Equipment Stats System
 * Define the statistical attributes that each equipment item provides
 * and how they impact gameplay mechanics
 */

export type EquipmentStatModifiers = {
    /** Damage multiplier for shots (1.0 = no change, 1.2 = 20% increase) */
    damageMultiplier: number
    /** Shoot cooldown reduction in ms (negative = faster shooting) */
    shootCooldownReduction: number
    /** Extended range for shots */
    shootDistanceBonus: number
    /** Defense/armor value - reduces incoming damage (0.9 = take 10% less damage) */
    defenseMultiplier: number
    /** Movement speed multiplier */
    moveSpeedMultiplier: number
    /** Jump power multiplier */
    jumpBoostMultiplier: number
    /** Additional max health */
    healthBonus: number
    /** Attack cooldown reduction for roaming enemies attacking this player */
    enemyAttackCooldownReduction: number
    /** Evasion chance (0.0 to 1.0) */
    evasionChance: number
    /** Description of the bonus effects */
    description: string
}

export const EQUIPMENT_STATS: Record<string, EquipmentStatModifiers> = {
    // ==================== WEAPONS ====================
    'weapon-pulse-blaster': {
        damageMultiplier: 1.0,
        shootCooldownReduction: 0,
        shootDistanceBonus: 0,
        defenseMultiplier: 1.0,
        moveSpeedMultiplier: 1.0,
        jumpBoostMultiplier: 1.0,
        healthBonus: 0,
        enemyAttackCooldownReduction: 0,
        evasionChance: 0,
        description: 'Standard weapon. Balanced stats.',
    },
    'weapon-neon-laser-rifle': {
        damageMultiplier: 1.15,
        shootCooldownReduction: 20,
        shootDistanceBonus: 2,
        defenseMultiplier: 1.0,
        moveSpeedMultiplier: 0.95,
        jumpBoostMultiplier: 1.0,
        healthBonus: 0,
        enemyAttackCooldownReduction: 0,
        evasionChance: 0,
        description: 'Increased damage and fire rate. Slightly slower.',
    },
    'weapon-plasma-cannon': {
        damageMultiplier: 1.35,
        shootCooldownReduction: 30,
        shootDistanceBonus: 4,
        defenseMultiplier: 0.95,
        moveSpeedMultiplier: 0.85,
        jumpBoostMultiplier: 0.9,
        healthBonus: 0,
        enemyAttackCooldownReduction: 0,
        evasionChance: 0,
        description: 'Heavy weapon. High damage, great range. Reduces mobility.',
    },
    'weapon-quantum-disruptor': {
        damageMultiplier: 1.5,
        shootCooldownReduction: 50,
        shootDistanceBonus: 6,
        defenseMultiplier: 1.0,
        moveSpeedMultiplier: 0.9,
        jumpBoostMultiplier: 1.0,
        healthBonus: 0,
        enemyAttackCooldownReduction: 100,
        evasionChance: 0,
        description: 'Advanced weapon. Extreme damage and range. Disrupts enemy attacks.',
    },
    'weapon-void-annihilator': {
        damageMultiplier: 2.0,
        shootCooldownReduction: 80,
        shootDistanceBonus: 8,
        defenseMultiplier: 1.0,
        moveSpeedMultiplier: 1.0,
        jumpBoostMultiplier: 1.0,
        healthBonus: 0,
        enemyAttackCooldownReduction: 200,
        evasionChance: 0.1,
        description: 'Ultimate weapon. Devastating damage. Modest evasion.',
    },

    // ==================== SHIELDS ====================
    'shield-energy-shield-mk-i': {
        damageMultiplier: 1.0,
        shootCooldownReduction: 0,
        shootDistanceBonus: 0,
        defenseMultiplier: 0.9,
        moveSpeedMultiplier: 0.98,
        jumpBoostMultiplier: 1.0,
        healthBonus: 1,
        enemyAttackCooldownReduction: 0,
        evasionChance: 0.05,
        description: 'Basic shield. Modest protection and evasion.',
    },
    'shield-photon-barrier': {
        damageMultiplier: 1.0,
        shootCooldownReduction: 0,
        shootDistanceBonus: 0,
        defenseMultiplier: 0.8,
        moveSpeedMultiplier: 0.95,
        jumpBoostMultiplier: 1.0,
        healthBonus: 2,
        enemyAttackCooldownReduction: 50,
        evasionChance: 0.1,
        description: 'Medium shield. Strong defense and evasion. Slows enemies.',
    },
    'shield-plasma-deflector': {
        damageMultiplier: 1.05,
        shootCooldownReduction: 10,
        shootDistanceBonus: 0,
        defenseMultiplier: 0.75,
        moveSpeedMultiplier: 0.92,
        jumpBoostMultiplier: 0.95,
        healthBonus: 3,
        enemyAttackCooldownReduction: 100,
        evasionChance: 0.15,
        description: 'Advanced shield. Deflects shots. Boosts offense slightly.',
    },
    'shield-quantum-shield': {
        damageMultiplier: 1.1,
        shootCooldownReduction: 20,
        shootDistanceBonus: 1,
        defenseMultiplier: 0.7,
        moveSpeedMultiplier: 0.9,
        jumpBoostMultiplier: 1.0,
        healthBonus: 4,
        enemyAttackCooldownReduction: 150,
        evasionChance: 0.2,
        description: 'High-tech shield. Excellent defense and evasion.',
    },
    'shield-void-shield-core': {
        damageMultiplier: 1.15,
        shootCooldownReduction: 35,
        shootDistanceBonus: 2,
        defenseMultiplier: 0.6,
        moveSpeedMultiplier: 1.0,
        jumpBoostMultiplier: 1.05,
        healthBonus: 5,
        enemyAttackCooldownReduction: 200,
        evasionChance: 0.25,
        description: 'Legendary shield. Maximum protection. Nullifies enemy attacks.',
    },

    // ==================== ACCESSORIES ====================
    'accessory-neon-visor': {
        damageMultiplier: 1.05,
        shootCooldownReduction: 5,
        shootDistanceBonus: 1,
        defenseMultiplier: 1.0,
        moveSpeedMultiplier: 1.02,
        jumpBoostMultiplier: 1.0,
        healthBonus: 0,
        enemyAttackCooldownReduction: 0,
        evasionChance: 0.02,
        description: 'Enhanced targeting. Slight boost to all stats.',
    },
    'accessory-cyber-boots': {
        damageMultiplier: 1.0,
        shootCooldownReduction: 0,
        shootDistanceBonus: 0,
        defenseMultiplier: 1.0,
        moveSpeedMultiplier: 1.2,
        jumpBoostMultiplier: 1.15,
        healthBonus: 0,
        enemyAttackCooldownReduction: 0,
        evasionChance: 0.08,
        description: 'Enhanced mobility. Faster movement and jumping.',
    },
    'accessory-holographic-cloak': {
        damageMultiplier: 1.0,
        shootCooldownReduction: 15,
        shootDistanceBonus: 0,
        defenseMultiplier: 0.85,
        moveSpeedMultiplier: 1.1,
        jumpBoostMultiplier: 1.0,
        healthBonus: 1,
        enemyAttackCooldownReduction: 75,
        evasionChance: 0.15,
        description: 'Invisibility tech. High evasion and stealth.',
    },
    'accessory-ai-companion-drone': {
        damageMultiplier: 1.2,
        shootCooldownReduction: 25,
        shootDistanceBonus: 2,
        defenseMultiplier: 0.9,
        moveSpeedMultiplier: 1.0,
        jumpBoostMultiplier: 1.0,
        healthBonus: 2,
        enemyAttackCooldownReduction: 100,
        evasionChance: 0.1,
        description: 'AI assistant. Boosts damage and defense. Distracts enemies.',
    },
    'accessory-temporal-accelerator': {
        damageMultiplier: 1.3,
        shootCooldownReduction: 60,
        shootDistanceBonus: 2,
        defenseMultiplier: 0.8,
        moveSpeedMultiplier: 1.25,
        jumpBoostMultiplier: 1.2,
        healthBonus: 3,
        enemyAttackCooldownReduction: 150,
        evasionChance: 0.2,
        description: 'Time manipulation. Massive attack speed. Ultimate mobility.',
    },
}

/**
 * Get stat modifiers for a single equipment item
 */
export function getEquipmentStatModifiers(itemId: string): EquipmentStatModifiers {
    return (
        EQUIPMENT_STATS[itemId] || {
            damageMultiplier: 1.0,
            shootCooldownReduction: 0,
            shootDistanceBonus: 0,
            defenseMultiplier: 1.0,
            moveSpeedMultiplier: 1.0,
            jumpBoostMultiplier: 1.0,
            healthBonus: 0,
            enemyAttackCooldownReduction: 0,
            evasionChance: 0,
            description: 'Unknown item',
        }
    )
}

/**
 * Combine multiple equipment stat modifiers
 */
export function combineStatModifiers(...modifiers: EquipmentStatModifiers[]): EquipmentStatModifiers {
    if (modifiers.length === 0) {
        return getEquipmentStatModifiers('')
    }

    return {
        damageMultiplier: modifiers.reduce((acc, mod) => acc * mod.damageMultiplier, 1.0),
        shootCooldownReduction: modifiers.reduce((acc, mod) => acc + mod.shootCooldownReduction, 0),
        shootDistanceBonus: modifiers.reduce((acc, mod) => acc + mod.shootDistanceBonus, 0),
        defenseMultiplier: modifiers.reduce((acc, mod) => acc * mod.defenseMultiplier, 1.0),
        moveSpeedMultiplier: modifiers.reduce((acc, mod) => acc * mod.moveSpeedMultiplier, 1.0),
        jumpBoostMultiplier: modifiers.reduce((acc, mod) => acc * mod.jumpBoostMultiplier, 1.0),
        healthBonus: modifiers.reduce((acc, mod) => acc + mod.healthBonus, 0),
        enemyAttackCooldownReduction: modifiers.reduce(
            (acc, mod) => acc + mod.enemyAttackCooldownReduction,
            0,
        ),
        evasionChance: Math.min(modifiers.reduce((acc, mod) => acc + mod.evasionChance, 0), 0.5),
        description: 'Combined modifiers',
    }
}
