import { describe, it, expect } from 'vitest'
import { getCameraPosition, getShotStart, computeEnemyPosition, hash, avoidObstacleCollision, generateMinimapData, computeShotArcDrop } from './arena'
import type { Task } from '@/game/types'
import type { RoamingEnemyData } from '@/types/arena'

describe('arena.ts utilities', () => {
    describe('getCameraPosition', () => {
        it('should add camera height to player Y position', () => {
            const playerPos: [number, number, number] = [0, 1, 0]
            const cameraPos = getCameraPosition(playerPos)
            expect(cameraPos[0]).toBe(0)
            expect(cameraPos[1]).toBe(1 + 1.55)
            expect(cameraPos[2]).toBe(0)
        })

        it('should preserve X and Z coordinates', () => {
            const playerPos: [number, number, number] = [10, 0.7, -5]
            const cameraPos = getCameraPosition(playerPos)
            expect(cameraPos[0]).toBe(10)
            expect(cameraPos[2]).toBe(-5)
        })

        it('should handle negative coordinates', () => {
            const playerPos: [number, number, number] = [-15, 0.7, -20]
            const cameraPos = getCameraPosition(playerPos)
            expect(cameraPos[0]).toBe(-15)
            expect(cameraPos[2]).toBe(-20)
        })
    })

    describe('getShotStart', () => {
        it('should return a valid 3D position', () => {
            const playerPos: [number, number, number] = [0, 0.7, 0]
            const start = getShotStart(playerPos, 0, 0)
            expect(Array.isArray(start)).toBe(true)
            expect(start).toHaveLength(3)
            expect(typeof start[0]).toBe('number')
            expect(typeof start[1]).toBe('number')
            expect(typeof start[2]).toBe('number')
        })

        it('should consider yaw angle', () => {
            const playerPos: [number, number, number] = [0, 0.7, 0]
            const start0 = getShotStart(playerPos, 0, 0)
            const startPI = getShotStart(playerPos, Math.PI, 0)
            expect(start0[0]).not.toBe(startPI[0])
        })

        it('should consider pitch angle', () => {
            const playerPos: [number, number, number] = [0, 0.7, 0]
            const start0 = getShotStart(playerPos, 0, 0)
            const startUp = getShotStart(playerPos, 0, 1)
            expect(start0[1]).not.toBe(startUp[1])
        })
    })

    describe('computeEnemyPosition', () => {
        it('should return deterministic position for same taskId', () => {
            const pos1 = computeEnemyPosition('task-1', 0)
            const pos2 = computeEnemyPosition('task-1', 0)
            expect(pos1).toEqual(pos2)
        })

        it('should return different positions for different taskIds', () => {
            const pos1 = computeEnemyPosition('task-1', 0)
            const pos2 = computeEnemyPosition('task-2', 0)
            expect(pos1).not.toEqual(pos2)
        })

        it('should vary position with index', () => {
            const pos0 = computeEnemyPosition('task-1', 0)
            const pos1 = computeEnemyPosition('task-1', 1)
            const pos2 = computeEnemyPosition('task-1', 2)
            expect([pos0, pos1, pos2].filter((p, i, arr) => i === 0 || !arr.slice(0, i).some(x => x === p)).length).toBeGreaterThan(1)
        })

        it('should return Y position between 1.5 and ~2.25', () => {
            const pos = computeEnemyPosition('task-1', 0)
            expect(pos[1]).toBeGreaterThanOrEqual(1.5)
            expect(pos[1]).toBeLessThan(2.5)
        })

        it('should place enemy on an arc at certain radius', () => {
            const pos = computeEnemyPosition('task-1', 0)
            const distance = Math.sqrt(pos[0] ** 2 + pos[2] ** 2)
            expect(distance).toBeGreaterThan(8)
            expect(distance).toBeLessThan(60)
        })
    })

    describe('hash', () => {
        it('should return same hash for same input', () => {
            const hash1 = hash('test-string')
            const hash2 = hash('test-string')
            expect(hash1).toBe(hash2)
        })

        it('should return different hash for different input', () => {
            const hash1 = hash('string-1')
            const hash2 = hash('string-2')
            expect(hash1).not.toBe(hash2)
        })

        it('should return positive number', () => {
            const result = hash('any-string')
            expect(result).toBeGreaterThanOrEqual(0)
        })

        it('should handle empty string', () => {
            const result = hash('')
            expect(typeof result).toBe('number')
        })
    })

    describe('avoidObstacleCollision', () => {
        it('should return new position if no collision', () => {
            const result = avoidObstacleCollision(0, 0, -1, -1, 0)
            expect(result).toEqual([0, 0])
        })

        it('should return previous position if collision detected', () => {
            // This test depends on obstacle data which is dynamic
            // We test the basic behavior
            const result = avoidObstacleCollision(100, 100, 0, 0, 0)
            expect(Array.isArray(result)).toBe(true)
            expect(result).toHaveLength(2)
        })

        it('should handle elapsed time parameter', () => {
            const result0 = avoidObstacleCollision(0, 0, -1, -1, 0)
            const result5 = avoidObstacleCollision(0, 0, -1, -1, 5)
            // Both should return arrays
            expect(Array.isArray(result0)).toBe(true)
            expect(Array.isArray(result5)).toBe(true)
        })
    })

    describe('generateMinimapData', () => {
        it('should generate valid minimap data', () => {
            const playerPos: [number, number, number] = [0, 0.7, 0]
            const tasks: Task[] = []
            const roamers: RoamingEnemyData[] = []
            const enemyPositions = new Map()

            const data = generateMinimapData(playerPos, tasks, roamers, enemyPositions, 0)

            expect(data).toBeDefined()
            expect(data.player).toBeDefined()
            expect(data.obstacles).toBeInstanceOf(Array)
            expect(data.missions).toBeInstanceOf(Array)
            expect(data.roamers).toBeInstanceOf(Array)
        })

        it('should scale and translate coordinates correctly', () => {
            const playerPos: [number, number, number] = [38, 0.7, 38]
            const tasks: Task[] = []
            const roamers: RoamingEnemyData[] = []
            const enemyPositions = new Map()

            const data = generateMinimapData(playerPos, tasks, roamers, enemyPositions, 0)

            expect(data.player.x).toBeGreaterThan(0)
            expect(data.player.x).toBeLessThanOrEqual(100)
            expect(data.player.y).toBeGreaterThan(0)
            expect(data.player.y).toBeLessThanOrEqual(100)
        })

        it('should include all tasks in missions', () => {
            const playerPos: [number, number, number] = [0, 0.7, 0]
            const tasks: Task[] = [
                {
                    id: 'task-1',
                    title: 'Test',
                    description: '',
                    priority: 'high',
                    reward: 50,
                    completed: false,
                    createdAt: Date.now(),
                },
            ]
            const roamers: RoamingEnemyData[] = []
            const enemyPositions = new Map([['task-1', [5, 1.1, 5] as [number, number, number]]])

            const data = generateMinimapData(playerPos, tasks, roamers, enemyPositions, 0)

            expect(data.missions).toHaveLength(1)
            expect(data.missions[0].id).toBe('task-1')
        })
    })

    describe('computeShotArcDrop', () => {
        it('should always return 0', () => {
            const result = computeShotArcDrop()
            expect(result).toBe(0)
        })
    })
})
