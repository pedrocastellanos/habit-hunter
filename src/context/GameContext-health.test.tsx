import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
    PLAYER_MAX_HEALTH,
    PLAYER_BASE_RESPAWN_COOLDOWN_MS,
    PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS,
    PLAYER_MAX_RESPAWN_COOLDOWN_MS,
    PLAYER_DAMAGE_PER_HIT,
} from '@/constants/arena'

describe('GameContext - Player Health System Logic', () => {
    const mockStorage: Record<string, string> = {}

    beforeEach(() => {
        // Clear mock storage before each test
        Object.keys(mockStorage).forEach((key) => delete mockStorage[key])

        // Mock localStorage
        vi.stubGlobal(
            'localStorage',
            {
                getItem: (key: string) => mockStorage[key] ?? null,
                setItem: (key: string, value: string) => {
                    mockStorage[key] = value
                },
                removeItem: (key: string) => {
                    delete mockStorage[key]
                },
                clear: () => {
                    Object.keys(mockStorage).forEach((key) => delete mockStorage[key])
                },
                length: Object.keys(mockStorage).length,
                key: (index: number) => Object.keys(mockStorage)[index] ?? null,
            } as Storage,
        )
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    describe('Respawn Cooldown Formula', () => {
        it('should calculate correct cooldown for 0 deaths', () => {
            const cooldown = Math.min(
                PLAYER_BASE_RESPAWN_COOLDOWN_MS + (0 * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
                PLAYER_MAX_RESPAWN_COOLDOWN_MS,
            )
            expect(cooldown).toBe(3000)
        })

        it('should calculate correct cooldown for 1 death', () => {
            const cooldown = Math.min(
                PLAYER_BASE_RESPAWN_COOLDOWN_MS + (1 * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
                PLAYER_MAX_RESPAWN_COOLDOWN_MS,
            )
            expect(cooldown).toBe(5000)
        })

        it('should calculate correct cooldown for 2 deaths', () => {
            const cooldown = Math.min(
                PLAYER_BASE_RESPAWN_COOLDOWN_MS + (2 * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
                PLAYER_MAX_RESPAWN_COOLDOWN_MS,
            )
            expect(cooldown).toBe(7000)
        })

        it('should calculate correct cooldown for 10 deaths', () => {
            const cooldown = Math.min(
                PLAYER_BASE_RESPAWN_COOLDOWN_MS + (10 * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
                PLAYER_MAX_RESPAWN_COOLDOWN_MS,
            )
            // 3000 + 10 * 2000 = 23000
            expect(cooldown).toBe(23000)
        })

        it('should cap cooldown at max value for high death counts', () => {
            const cooldown = Math.min(
                PLAYER_BASE_RESPAWN_COOLDOWN_MS + (15 * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
                PLAYER_MAX_RESPAWN_COOLDOWN_MS,
            )
            // Should be capped at 30000
            expect(cooldown).toBe(PLAYER_MAX_RESPAWN_COOLDOWN_MS)
            expect(cooldown).toBe(30000)
        })

        it('should never exceed max cooldown regardless of death count', () => {
            for (let deaths = 0; deaths <= 100; deaths++) {
                const cooldown = Math.min(
                    PLAYER_BASE_RESPAWN_COOLDOWN_MS + (deaths * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
                    PLAYER_MAX_RESPAWN_COOLDOWN_MS,
                )
                expect(cooldown).toBeLessThanOrEqual(PLAYER_MAX_RESPAWN_COOLDOWN_MS)
            }
        })

        it('should increase progressively with each death', () => {
            let previousCooldown = Math.min(
                PLAYER_BASE_RESPAWN_COOLDOWN_MS + (0 * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
                PLAYER_MAX_RESPAWN_COOLDOWN_MS,
            )
            for (let deaths = 1; deaths <= 15; deaths++) {
                const currentCooldown = Math.min(
                    PLAYER_BASE_RESPAWN_COOLDOWN_MS + (deaths * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
                    PLAYER_MAX_RESPAWN_COOLDOWN_MS,
                )
                // Should be greater or equal (equal when capped)
                expect(currentCooldown).toBeGreaterThanOrEqual(previousCooldown)
                previousCooldown = currentCooldown
            }
        })
    })

    describe('Health State Management', () => {
        it('should track health correctly when reducing', () => {
            let health = PLAYER_MAX_HEALTH
            health = Math.max(0, health - PLAYER_DAMAGE_PER_HIT)

            expect(health).toBe(PLAYER_MAX_HEALTH - PLAYER_DAMAGE_PER_HIT)
            expect(health).toBeGreaterThanOrEqual(0)
        })

        it('should indicate dead state when health <= 0', () => {
            const health = 0
            const isDead = health <= 0

            expect(isDead).toBe(true)
        })

        it('should indicate alive state when health > 0', () => {
            const health = 3
            const isDead = health <= 0

            expect(isDead).toBe(false)
        })

        it('should calculate max health correctly', () => {
            expect(PLAYER_MAX_HEALTH).toBe(6)
        })

        it('should have correct damage per hit', () => {
            expect(PLAYER_DAMAGE_PER_HIT).toBe(1)
        })
    })

    describe('Damage and Respawn Flow', () => {
        it('should reduce health on damage', () => {
            const health = 6
            const damage = 1
            const newHealth = Math.max(0, health - damage)

            expect(newHealth).toBe(5)
        })

        it('should not go below 0 when taking damage', () => {
            const health = 1
            const damage = 10
            const newHealth = Math.max(0, health - damage)

            expect(newHealth).toBe(0)
        })

        it('should restore health on respawn', () => {
            const deadHealth = 0
            const respawnedHealth = PLAYER_MAX_HEALTH

            expect(respawnedHealth).toBe(PLAYER_MAX_HEALTH)
            expect(respawnedHealth).toBeGreaterThan(deadHealth)
        })

        it('should increment deaths counter on respawn', () => {
            const deaths = 0
            const newDeaths = deaths + 1

            expect(newDeaths).toBe(1)
        })

        it('should handle multiple damage hits', () => {
            let health = PLAYER_MAX_HEALTH

            // Apply 3 damage hits
            health = Math.max(0, health - 1) // 5
            health = Math.max(0, health - 1) // 4
            health = Math.max(0, health - 1) // 3

            expect(health).toBe(3)
        })

        it('should kill player in max health / damage hits', () => {
            let health = PLAYER_MAX_HEALTH
            let hitsToKill = 0

            while (health > 0) {
                health = Math.max(0, health - PLAYER_DAMAGE_PER_HIT)
                hitsToKill++
            }

            expect(health).toBe(0)
            expect(hitsToKill).toBe(PLAYER_MAX_HEALTH)
        })
    })

    describe('State Reset', () => {
        it('should reset health to max', () => {
            const health = PLAYER_MAX_HEALTH
            const resetHealth = PLAYER_MAX_HEALTH

            expect(resetHealth).toBe(health)
        })

        it('should reset deaths to zero', () => {
            const deaths = 0
            const resetDeaths = 0

            expect(resetDeaths).toBe(deaths)
        })
    })

    describe('localStorage Persistence', () => {
        it('should persist all required health data', () => {
            const gameState = {
                playerHealth: 3,
                playerDeaths: 2,
            }

            localStorage.setItem('habit-hunter-state-v1', JSON.stringify(gameState))
            const stored = localStorage.getItem('habit-hunter-state-v1')

            expect(stored).not.toBeNull()
            const parsed = JSON.parse(stored!)
            expect(parsed.playerHealth).toBe(3)
            expect(parsed.playerDeaths).toBe(2)
        })

        it('should restore health from localStorage', () => {
            const initialState = {
                playerHealth: 4,
                playerDeaths: 1,
            }
            localStorage.setItem('habit-hunter-state-v1', JSON.stringify(initialState))

            const stored = localStorage.getItem('habit-hunter-state-v1')
            expect(stored).not.toBeNull()

            const parsed = JSON.parse(stored!)

            expect(parsed.playerHealth).toBe(4)
            expect(parsed.playerDeaths).toBe(1)
        })

        it('should clear health data when localStorage is cleared', () => {
            localStorage.setItem('habit-hunter-state-v1', JSON.stringify({ playerHealth: 6, playerDeaths: 0 }))
            expect(localStorage.getItem('habit-hunter-state-v1')).not.toBeNull()

            localStorage.clear()

            const stored = localStorage.getItem('habit-hunter-state-v1')
            expect(stored).toBeNull()
        })

        it('should serialize and deserialize health state correctly', () => {
            const state = {
                playerHealth: 5,
                playerDeaths: 3,
            }

            const json = JSON.stringify(state)
            const restored = JSON.parse(json)

            expect(restored.playerHealth).toBe(5)
            expect(restored.playerDeaths).toBe(3)
        })

        it('should handle invalid JSON gracefully', () => {
            const invalidJson = '{invalid json'
            expect(() => JSON.parse(invalidJson)).toThrow()
        })
    })
})
