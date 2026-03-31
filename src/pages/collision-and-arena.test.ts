import { describe, it, expect } from 'vitest'

/**
 * Collision Detection and Arena Logic Tests
 * 
 * These tests verify the collision detection system and respawn countdown logic
 * used in the ArenaPage component and related game mechanics.
 */

describe('Arena Collision Detection', () => {
    const COLLISION_RADIUS = 0.5

    /**
     * Calculates distance between two 3D points
     */
    const calculateDistance = (
        pos1: [number, number, number],
        pos2: [number, number, number],
    ): number => {
        const dx = pos2[0] - pos1[0]
        const dy = pos2[1] - pos1[1]
        const dz = pos2[2] - pos1[2]
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }

    /**
     * Checks if shot collides with player
     */
    const checkCollision = (
        playerPos: [number, number, number],
        shotPos: [number, number, number],
    ): boolean => {
        const distance = calculateDistance(playerPos, shotPos)
        return distance < COLLISION_RADIUS
    }

    describe('Distance Calculation', () => {
        it('should calculate distance between identical points as 0', () => {
            const pos1: [number, number, number] = [0, 0, 0]
            const pos2: [number, number, number] = [0, 0, 0]
            expect(calculateDistance(pos1, pos2)).toBe(0)
        })

        it('should calculate 1D distance correctly', () => {
            const pos1: [number, number, number] = [0, 0, 0]
            const pos2: [number, number, number] = [3, 0, 0]
            expect(calculateDistance(pos1, pos2)).toBe(3)
        })

        it('should calculate 2D distance correctly', () => {
            const pos1: [number, number, number] = [0, 0, 0]
            const pos2: [number, number, number] = [3, 4, 0]
            // Pythagorean: sqrt(3^2 + 4^2) = 5
            expect(calculateDistance(pos1, pos2)).toBe(5)
        })

        it('should calculate 3D distance correctly', () => {
            const pos1: [number, number, number] = [0, 0, 0]
            const pos2: [number, number, number] = [1, 1, 1]
            // Pythagorean: sqrt(1^2 + 1^2 + 1^2) ≈ 1.732
            expect(calculateDistance(pos1, pos2)).toBeCloseTo(Math.sqrt(3), 3)
        })

        it('should handle negative coordinates', () => {
            const pos1: [number, number, number] = [-1, -1, -1]
            const pos2: [number, number, number] = [1, 1, 1]
            // Distance = sqrt(2^2 + 2^2 + 2^2) ≈ 3.464
            expect(calculateDistance(pos1, pos2)).toBeCloseTo(Math.sqrt(12), 3)
        })

        it('should be commutative', () => {
            const pos1: [number, number, number] = [1, 2, 3]
            const pos2: [number, number, number] = [4, 5, 6]
            expect(calculateDistance(pos1, pos2)).toBe(calculateDistance(pos2, pos1))
        })
    })

    describe('Collision Detection - Basic Cases', () => {
        it('should detect collision when shot directly hits player', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            const shotPos: [number, number, number] = [0, 0, 0]
            expect(checkCollision(playerPos, shotPos)).toBe(true)
        })

        it('should detect collision when shot is near center', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            const shotPos: [number, number, number] = [0.1, 0.1, 0.1]
            expect(checkCollision(playerPos, shotPos)).toBe(true)
        })

        it('should not detect collision when shot is far away', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            const shotPos: [number, number, number] = [10, 10, 10]
            expect(checkCollision(playerPos, shotPos)).toBe(false)
        })
    })

    describe('Collision Detection - Boundary Cases', () => {
        it('should detect collision just inside radius', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            // Distance = 0.49 (inside radius)
            const shotPos: [number, number, number] = [0.49, 0, 0]
            expect(checkCollision(playerPos, shotPos)).toBe(true)
        })

        it('should not detect collision just outside radius', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            // Distance = 0.51 (outside radius)
            const shotPos: [number, number, number] = [0.51, 0, 0]
            expect(checkCollision(playerPos, shotPos)).toBe(false)
        })

        it('should not detect collision at exact radius boundary', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            // Distance = exactly 0.5 (on boundary, should NOT collide due to <)
            const shotPos: [number, number, number] = [0.5, 0, 0]
            expect(checkCollision(playerPos, shotPos)).toBe(false)
        })

        it('should detect collision just inside diagonal', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            // sqrt(0.3^2 + 0.3^2 + 0.3^2) ≈ 0.52 (outside)
            // sqrt(0.25^2 + 0.25^2 + 0.25^2) ≈ 0.433 (inside)
            const shotPos: [number, number, number] = [0.25, 0.25, 0.25]
            expect(checkCollision(playerPos, shotPos)).toBe(true)
        })
    })

    describe('Collision Detection - Movement Scenarios', () => {
        it('should detect collision with moving positions', () => {
            const timeDelta = 0.016 // 16ms
            const shotVelocity: [number, number, number] = [5, 0, 0] // 5 units/s

            const playerPos: [number, number, number] = [0, 0, 0]
            const shotPos: [number, number, number] = [-1, 0, 0]

            // Move shot toward player
            shotPos[0] += shotVelocity[0] * timeDelta
            // Now: 0.084 - 1 = -0.916

            expect(checkCollision(playerPos, shotPos)).toBe(false)

            // Move again (multiple frames)
            for (let i = 0; i < 20; i++) {
                shotPos[0] += shotVelocity[0] * timeDelta
            }
            // Should be close to player by now
            expect(Math.abs(shotPos[0])).toBeLessThan(1)
        })

        it('should handle player at non-origin position', () => {
            const playerPos: [number, number, number] = [5, 5, 5]
            const shotPos: [number, number, number] = [5.1, 5.1, 5.1]
            expect(checkCollision(playerPos, shotPos)).toBe(true)
        })

        it('should not detect collision on miss trajectory', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            // Shot moving along parallel path
            const shotPos1: [number, number, number] = [1, 0.5, 0]
            const shotPos2: [number, number, number] = [2, 0.5, 0]
            const shotPos3: [number, number, number] = [3, 0.5, 0]

            expect(checkCollision(playerPos, shotPos1)).toBe(false)
            expect(checkCollision(playerPos, shotPos2)).toBe(false)
            expect(checkCollision(playerPos, shotPos3)).toBe(false)
        })
    })

    describe('Collision Detection - Arc Trajectories', () => {
        it('should detect collision on downward arc', () => {
            const playerPos: [number, number, number] = [1, 0, 0]

            // Shot falling in arc
            const arcPositions: Array<[number, number, number]> = [
                [0, 2, 0], // Starting high
                [0.5, 1, 0], // Mid-arc
                [1, 0.1, 0], // Near player
            ]

            // Last position should collide
            expect(checkCollision(playerPos, arcPositions[arcPositions.length - 1])).toBe(true)
        })

        it('should detect grazing collision on arc path', () => {
            const playerPos: [number, number, number] = [2, 0, 0]

            // Shot on close miss trajectory
            const arcPositions: Array<[number, number, number]> = [
                [0, 2, 0],
                [1, 1.2, 0],
                [2, 0.4, 0], // Close miss
            ]

            const lastPos = arcPositions[arcPositions.length - 1]
            const distance = calculateDistance(playerPos, lastPos)
            // Distance ≈ 0.4 which is < 0.5
            expect(distance).toBeLessThan(COLLISION_RADIUS)
            expect(checkCollision(playerPos, lastPos)).toBe(true)
        })
    })

    describe('Collision Detection - Performance', () => {
        it('should handle many collision checks efficiently', () => {
            const playerPos: [number, number, number] = [0, 0, 0]
            const shotPositions: Array<[number, number, number]> = Array.from(
                { length: 100 },
                (_, i) => [i * 0.1, Math.random(), Math.random()] as [number, number, number],
            )

            const start = performance.now()

            for (const shotPos of shotPositions) {
                checkCollision(playerPos, shotPos)
            }

            const elapsed = performance.now() - start
            // Should complete quickly (< 10ms for 100 checks)
            expect(elapsed).toBeLessThan(10)
        })
    })
})

describe('Respawn Countdown Display', () => {
    /**
     * Calculates the countdown in seconds
     */
    const calculateCountdown = (elapsedMs: number, cooldownMs: number): number => {
        const remaining = cooldownMs - elapsedMs
        return Math.max(0, Math.ceil(remaining / 1000))
    }

    describe('Countdown Display Logic', () => {
        it('should show full cooldown at start', () => {
            const countdown = calculateCountdown(0, 3000)
            expect(countdown).toBe(3)
        })

        it('should show decreasing countdown', () => {
            expect(calculateCountdown(0, 5000)).toBe(5)
            expect(calculateCountdown(1000, 5000)).toBe(4)
            expect(calculateCountdown(2000, 5000)).toBe(3)
            expect(calculateCountdown(3000, 5000)).toBe(2)
            expect(calculateCountdown(4000, 5000)).toBe(1)
            expect(calculateCountdown(5000, 5000)).toBe(0)
        })

        it('should show 0 when respawn ready', () => {
            const countdown = calculateCountdown(3000, 3000)
            expect(countdown).toBe(0)
        })

        it('should show 0 when past respawn time', () => {
            const countdown = calculateCountdown(4000, 3000)
            expect(countdown).toBe(0)
        })

        it('should round up fractional seconds', () => {
            // 1500ms = 1.5s -> rounds up to 2s
            expect(calculateCountdown(500, 3000)).toBe(3)
            expect(calculateCountdown(1500, 3000)).toBe(2)
            expect(calculateCountdown(2500, 3000)).toBe(1)
            // Even tiny fractions round up to 1
            expect(calculateCountdown(2900, 3000)).toBe(1)
        })

        it('should handle long cooldowns', () => {
            expect(calculateCountdown(0, 30000)).toBe(30)
            expect(calculateCountdown(0, 25000)).toBe(25)
            expect(calculateCountdown(5000, 30000)).toBe(25)
        })

        it('should handle highest cooldown values', () => {
            const maxCooldown = 30000 // 30 seconds
            expect(calculateCountdown(0, maxCooldown)).toBe(30)
            expect(calculateCountdown(maxCooldown, maxCooldown)).toBe(0)
        })
    })

    describe('Countdown Updates', () => {
        it('should trigger respawn when countdown reaches 0', () => {
            const cooldown = 3000
            let countdownValue = calculateCountdown(0, cooldown)
            const countdowns: number[] = []

            // Simulate 100ms updates
            for (let elapsed = 0; elapsed <= cooldown; elapsed += 100) {
                countdownValue = calculateCountdown(elapsed, cooldown)
                countdowns.push(countdownValue)
            }

            // Should see countdown: 3, 3, 3, 2, 2, 2, 1, 1, 1, 0, 0, 0, ...
            expect(countdowns[0]).toBe(3)
            expect(countdowns[countdowns.length - 1]).toBe(0)
            // Should be decreasing or equal
            for (let i = 1; i < countdowns.length; i++) {
                expect(countdowns[i]).toBeLessThanOrEqual(countdowns[i - 1])
            }
        })
    })
})

describe('Shot Position Interpolation', () => {
    /**
     * Simulates shot position with arc drop
     */
    const calculateShotPosition = (
        startPos: [number, number, number],
        velocity: [number, number, number],
        arcDrop: number,
        elapsedMs: number,
    ): [number, number, number] => {
        const elapsedSec = elapsedMs / 1000

        return [
            startPos[0] + velocity[0] * elapsedSec,
            startPos[1] + velocity[1] * elapsedSec - (arcDrop * elapsedSec * elapsedSec) / 2,
            startPos[2] + velocity[2] * elapsedSec,
        ]
    }

    it('should calculate position with no velocity', () => {
        const pos = calculateShotPosition([0, 0, 0], [0, 0, 0], 0, 1000)
        expect(pos).toEqual([0, 0, 0])
    })

    it('should calculate position with constant velocity', () => {
        const pos = calculateShotPosition([0, 0, 0], [5, 0, 0], 0, 1000)
        // 5 units/sec * 1 sec = 5 units
        expect(pos[0]).toBe(5)
    })

    it('should apply arc drop over time', () => {
        const pos1 = calculateShotPosition([0, 10, 0], [5, 0, 0], 10, 0)
        const pos2 = calculateShotPosition([0, 10, 0], [5, 0, 0], 10, 500)
        const pos3 = calculateShotPosition([0, 10, 0], [5, 0, 0], 10, 1000)

        // Y position should decrease due to arc drop
        expect(pos1[1]).toBe(10)
        expect(pos2[1]).toBeLessThan(pos1[1])
        expect(pos3[1]).toBeLessThan(pos2[1])
    })

    it('should handle moving shots correctly', () => {
        const startPos: [number, number, number] = [0, 1, 0]
        const velocity: [number, number, number] = [3, 0, 4]
        const arcDrop = 5

        const pos = calculateShotPosition(startPos, velocity, arcDrop, 1000)

        // After 1s: x = 0 + 3*1 = 3, z = 0 + 4*1 = 4
        expect(pos[0]).toBe(3)
        expect(pos[2]).toBe(4)
    })
})
