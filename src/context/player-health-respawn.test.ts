import { describe, it, expect } from 'vitest'
import {
    PLAYER_MAX_HEALTH,
    PLAYER_BASE_RESPAWN_COOLDOWN_MS,
    PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS,
    PLAYER_MAX_RESPAWN_COOLDOWN_MS,
} from '@/constants/arena'
import type { PlayerState } from '@/types/arena'

describe('Player Health and Respawn System', () => {
    describe('Health System Constants', () => {
        it('should have correct max health value', () => {
            expect(PLAYER_MAX_HEALTH).toBe(6)
        })

        it('should have correct base respawn cooldown', () => {
            expect(PLAYER_BASE_RESPAWN_COOLDOWN_MS).toBe(3000)
        })

        it('should have correct respawn cooldown increment', () => {
            expect(PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS).toBe(2000)
        })

        it('should have correct max respawn cooldown', () => {
            expect(PLAYER_MAX_RESPAWN_COOLDOWN_MS).toBe(30000)
        })
    })

    describe('Respawn Cooldown Calculation', () => {
        const calculateRespawnCooldown = (deaths: number): number => {
            return Math.min(
                PLAYER_BASE_RESPAWN_COOLDOWN_MS + (deaths * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
                PLAYER_MAX_RESPAWN_COOLDOWN_MS,
            )
        }

        it('should calculate correct cooldown for first death', () => {
            const cooldown = calculateRespawnCooldown(0)
            // Base: 3000ms (3 seconds)
            expect(cooldown).toBe(3000)
        })

        it('should calculate correct cooldown for second death', () => {
            const cooldown = calculateRespawnCooldown(1)
            // Base (3000) + increment (2000) = 5000ms (5 seconds)
            expect(cooldown).toBe(5000)
        })

        it('should calculate correct cooldown for third death', () => {
            const cooldown = calculateRespawnCooldown(2)
            // Base (3000) + 2 * increment (2000) = 7000ms (7 seconds)
            expect(cooldown).toBe(7000)
        })

        it('should calculate correct cooldown for tenth death', () => {
            const cooldown = calculateRespawnCooldown(9)
            // Base (3000) + 9 * increment (2000) = 21000ms (21 seconds)
            expect(cooldown).toBe(21000)
        })

        it('should cap cooldown at maximum value', () => {
            const cooldown = calculateRespawnCooldown(20)
            // Should be capped at PLAYER_MAX_RESPAWN_COOLDOWN_MS
            expect(cooldown).toBe(PLAYER_MAX_RESPAWN_COOLDOWN_MS)
            expect(cooldown).toBe(30000)
        })

        it('should never exceed max cooldown regardless of death count', () => {
            for (let deaths = 0; deaths <= 100; deaths++) {
                const cooldown = calculateRespawnCooldown(deaths)
                expect(cooldown).toBeLessThanOrEqual(PLAYER_MAX_RESPAWN_COOLDOWN_MS)
            }
        })

        it('should increase progressively with each death up to max', () => {
            let previousCooldown = calculateRespawnCooldown(0)
            for (let deaths = 1; deaths <= 15; deaths++) {
                const currentCooldown = calculateRespawnCooldown(deaths)
                // Should be greater or equal (equal when capped)
                expect(currentCooldown).toBeGreaterThanOrEqual(previousCooldown)
                previousCooldown = currentCooldown
            }
        })
    })

    describe('Player State Transitions', () => {
        const createPlayerState = (health: number, deaths: number): PlayerState => {
            const respawnCooldownMs = Math.min(
                PLAYER_BASE_RESPAWN_COOLDOWN_MS + (deaths * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
                PLAYER_MAX_RESPAWN_COOLDOWN_MS,
            )
            return {
                health,
                maxHealth: PLAYER_MAX_HEALTH,
                deaths,
                respawnCooldownMs,
                isDead: health <= 0,
                lastDeathTime: null,
            }
        }

        it('should be not dead when health > 0', () => {
            const state = createPlayerState(3, 0)
            expect(state.isDead).toBe(false)
            expect(state.health).toBe(3)
        })

        it('should be dead when health === 0', () => {
            const state = createPlayerState(0, 0)
            expect(state.isDead).toBe(true)
            expect(state.health).toBe(0)
        })

        it('should be dead when health < 0', () => {
            const state = createPlayerState(-1, 1)
            expect(state.isDead).toBe(true)
        })

        it('should have correct health at max', () => {
            const state = createPlayerState(PLAYER_MAX_HEALTH, 0)
            expect(state.health).toBe(PLAYER_MAX_HEALTH)
            expect(state.maxHealth).toBe(PLAYER_MAX_HEALTH)
        })

        it('should transition from alive to dead when health reaches 0', () => {
            const aliveState = createPlayerState(1, 0)
            const deadState = createPlayerState(0, 1)

            expect(aliveState.isDead).toBe(false)
            expect(deadState.isDead).toBe(true)
            expect(deadState.deaths).toBe(1)
        })
    })

    describe('Damage System', () => {
        const applyDamage = (health: number, damage: number): number => {
            return Math.max(health - damage, 0)
        }

        it('should reduce health correctly', () => {
            const newHealth = applyDamage(6, 1)
            expect(newHealth).toBe(5)
        })

        it('should not go below 0', () => {
            const newHealth = applyDamage(1, 5)
            expect(newHealth).toBe(0)
        })

        it('should apply multiple damage hits correctly', () => {
            let health = PLAYER_MAX_HEALTH
            health = applyDamage(health, 1) // 5
            health = applyDamage(health, 1) // 4
            health = applyDamage(health, 1) // 3
            expect(health).toBe(3)
        })

        it('should handle 0 damage', () => {
            const newHealth = applyDamage(3, 0)
            expect(newHealth).toBe(3)
        })

        it('should kill player in max health / 1 damage hits', () => {
            let health = PLAYER_MAX_HEALTH
            let hitsToKill = 0
            while (health > 0) {
                health = applyDamage(health, 1)
                hitsToKill++
            }
            expect(hitsToKill).toBe(PLAYER_MAX_HEALTH)
        })
    })

    describe('Respawn Logic', () => {
        const simulateRespawn = (
            _currentHealth: number,
            currentDeaths: number,
        ): { health: number; deaths: number } => {
            // Respawn sets health to max and increments deaths
            return {
                health: PLAYER_MAX_HEALTH,
                deaths: currentDeaths + 1,
            }
        }

        it('should restore health to max on respawn', () => {
            const result = simulateRespawn(0, 0)
            expect(result.health).toBe(PLAYER_MAX_HEALTH)
        })

        it('should increment death counter on respawn', () => {
            const result = simulateRespawn(0, 0)
            expect(result.deaths).toBe(1)
        })

        it('should correctly handle multiple respawns', () => {
            let health = PLAYER_MAX_HEALTH
            let deaths = 0

            // First death
            health = 0
            const result1 = simulateRespawn(health, deaths)
            health = result1.health
            deaths = result1.deaths
            expect(health).toBe(PLAYER_MAX_HEALTH)
            expect(deaths).toBe(1)

            // Second death  
            health = 0
            const result2 = simulateRespawn(health, deaths)
            health = result2.health
            deaths = result2.deaths
            expect(health).toBe(PLAYER_MAX_HEALTH)
            expect(deaths).toBe(2)
        })
    })

    describe('Countdown Logic', () => {
        const calculateCountdown = (elapsedMs: number, cooldownMs: number): number => {
            const remaining = cooldownMs - elapsedMs
            return Math.max(0, Math.ceil(remaining / 1000))
        }

        it('should show correct countdown at start', () => {
            const countdown = calculateCountdown(0, 3000)
            expect(countdown).toBe(3) // 3000ms = 3 seconds
        })

        it('should show correct countdown mid-respawn', () => {
            const countdown = calculateCountdown(1500, 3000)
            // (3000 - 1500) / 1000 = 1.5s, ceil = 2s
            expect(countdown).toBe(2)
        })

        it('should show correct countdown near end', () => {
            const countdown = calculateCountdown(2900, 3000)
            // (3000 - 2900) / 1000 = 0.1s, ceil = 1s
            expect(countdown).toBe(1)
        })

        it('should show 0 when respawn time reached', () => {
            const countdown = calculateCountdown(3000, 3000)
            expect(countdown).toBe(0)
        })

        it('should show 0 when past respawn time', () => {
            const countdown = calculateCountdown(4000, 3000)
            expect(countdown).toBe(0)
        })

        it('should handle long cooldowns', () => {
            const countdown = calculateCountdown(0, 30000)
            expect(countdown).toBe(30) // 30 seconds
        })

        it('should round up fractional seconds', () => {
            // 500ms remaining = 0.5s, should ceil to 1s
            const countdown1 = calculateCountdown(2500, 3000)
            expect(countdown1).toBe(1)

            // 100ms remaining = 0.1s, should ceil to 1s
            const countdown2 = calculateCountdown(2900, 3000)
            expect(countdown2).toBe(1)

            // 1100ms remaining = 1.1s, should ceil to 2s
            const countdown3 = calculateCountdown(1900, 3000)
            expect(countdown3).toBe(2)
        })
    })

    describe('Collision Detection', () => {
        const checkCollision = (playerPos: [number, number, number], shotPos: [number, number, number]): boolean => {
            const dx = shotPos[0] - playerPos[0]
            const dy = shotPos[1] - playerPos[1]
            const dz = shotPos[2] - playerPos[2]
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
            return distance < 0.5 // Collision radius
        }

        it('should detect collision when shot hits player', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            const shotPos: [number, number, number] = [0.2, 0.1, 0.1]
            expect(checkCollision(playerPos, shotPos)).toBe(true)
        })

        it('should not detect collision when shot misses', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            const shotPos: [number, number, number] = [1.0, 1.0, 1.0]
            expect(checkCollision(playerPos, shotPos)).toBe(false)
        })

        it('should detect collision at boundary', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            // Distance exactly 0.49 (just inside)
            const shotPos: [number, number, number] = [0.49, 0, 0]
            expect(checkCollision(playerPos, shotPos)).toBe(true)
        })

        it('should not detect collision just outside boundary', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            // Distance exactly 0.51 (just outside)
            const shotPos: [number, number, number] = [0.51, 0, 0]
            expect(checkCollision(playerPos, shotPos)).toBe(false)
        })

        it('should handle 3D distance correctly', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            // Test Pythagorean theorem: sqrt(0.3^2 + 0.3^2 + 0.3^2) ≈ 0.52
            const shotPos: [number, number, number] = [0.3, 0.3, 0.3]
            expect(checkCollision(playerPos, shotPos)).toBe(false)
        })

        it('should handle shot from different positions', () => {
            const playerPos: [number, number, number] = [5, 2, 3]
            const shotPos: [number, number, number] = [5.1, 2.1, 3.1]
            expect(checkCollision(playerPos, shotPos)).toBe(true)
        })
    })

    describe('Health Bar Percentage', () => {
        const calculateHealthPercentage = (health: number, maxHealth: number): number => {
            return (health / maxHealth) * 100
        }

        it('should show 100% at full health', () => {
            const percentage = calculateHealthPercentage(6, 6)
            expect(percentage).toBe(100)
        })

        it('should show 50% at half health', () => {
            const percentage = calculateHealthPercentage(3, 6)
            expect(percentage).toBe(50)
        })

        it('should show 0% at no health', () => {
            const percentage = calculateHealthPercentage(0, 6)
            expect(percentage).toBe(0)
        })

        it('should calculate correct percentages', () => {
            // 1/6 ≈ 16.67%
            const p1 = calculateHealthPercentage(1, 6)
            expect(p1).toBeCloseTo(16.67, 1)

            // 5/6 ≈ 83.33%
            const p5 = calculateHealthPercentage(5, 6)
            expect(p5).toBeCloseTo(83.33, 1)
        })
    })
})
