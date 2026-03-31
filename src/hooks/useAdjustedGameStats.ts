import { useMemo } from 'react'
import {
    MOVE_SPEED,
    JUMP_FORCE,
    MAX_SHOT_DISTANCE,
    ROAMER_ATTACK_COOLDOWN,
    PLAYER_DAMAGE_PER_HIT,
} from '@/constants/arena'
import type { EquipmentStatModifiers } from '@/game/equipmentStats'

/**
 * Hook that provides adjusted game constants based on equipment modifiers
 * This ensures equipment choices have meaningful impact on gameplay
 */
export function useAdjustedGameStats(equipmentModifiers: EquipmentStatModifiers | null) {
    return useMemo(() => {
        if (!equipmentModifiers) {
            return {
                moveSpeed: MOVE_SPEED,
                jumpForce: JUMP_FORCE,
                maxShotDistance: MAX_SHOT_DISTANCE,
                shootCooldown: 80, // Default milliseconds between shots
                playerDamagePerHit: PLAYER_DAMAGE_PER_HIT,
                roamerAttackCooldown: ROAMER_ATTACK_COOLDOWN,
                evasionChance: 0,
                defenseMultiplier: 1.0,
            }
        }

        return {
            // Movement stats
            moveSpeed: MOVE_SPEED * equipmentModifiers.moveSpeedMultiplier,
            jumpForce: JUMP_FORCE * equipmentModifiers.jumpBoostMultiplier,

            // Shooting stats
            maxShotDistance: MAX_SHOT_DISTANCE + equipmentModifiers.shootDistanceBonus,
            shootCooldown: Math.max(20, 80 - equipmentModifiers.shootCooldownReduction),

            // Damage stats
            playerDamagePerHit: PLAYER_DAMAGE_PER_HIT * equipmentModifiers.damageMultiplier,

            // Enemy attack stats
            roamerAttackCooldown: Math.max(
                300,
                ROAMER_ATTACK_COOLDOWN - equipmentModifiers.enemyAttackCooldownReduction,
            ),

            // Evasion & Defense
            evasionChance: equipmentModifiers.evasionChance,
            defenseMultiplier: equipmentModifiers.defenseMultiplier,
        }
    }, [equipmentModifiers])
}
