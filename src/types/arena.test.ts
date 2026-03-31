import { describe, it, expect } from 'vitest'
import type { EnergyShot, XpPopupData, MinimapData } from '@/types/arena'

describe('Arena Components Types', () => {
    describe('EnergyShot type', () => {
        it('should define EnergyShot properties', () => {
            const shot: EnergyShot = {
                id: 'shot-1',
                start: [0, 1, 0],
                end: [10, 1, 10],
                createdAt: Date.now(),
                arcDrop: 0,
            }

            expect(shot.id).toBe('shot-1')
            expect(shot.start[0]).toBe(0)
            expect(shot.end[0]).toBe(10)
            expect(typeof shot.createdAt).toBe('number')
            expect(typeof shot.arcDrop).toBe('number')
        })

        it('should have valid coordinate arrays', () => {
            const shot: EnergyShot = {
                id: 'shot-1',
                start: [1.5, 2.5, 3.5],
                end: [4.5, 5.5, 6.5],
                createdAt: Date.now(),
                arcDrop: 1.2,
            }

            expect(shot.start.length).toBe(3)
            expect(shot.end.length).toBe(3)
        })
    })

    describe('XpPopupData type', () => {
        it('should define XpPopupData properties', () => {
            const popup: XpPopupData = {
                id: 'popup-1',
                amount: 50,
                position: [0, 1, 0],
                createdAt: Date.now(),
            }

            expect(popup.id).toBe('popup-1')
            expect(popup.amount).toBe(50)
            expect(popup.position[1]).toBe(1)
        })

        it('should handle different XP amounts', () => {
            const amounts = [1, 10, 100, 1000]
            amounts.forEach(amount => {
                const popup: XpPopupData = {
                    id: `popup-${amount}`,
                    amount,
                    position: [0, 0, 0],
                    createdAt: Date.now(),
                }
                expect(popup.amount).toBe(amount)
            })
        })
    })

    describe('MinimapData type', () => {
        it('should define MinimapData structure', () => {
            const minimapData: MinimapData = {
                obstacles: [
                    { id: 'obs-1', x: 50, y: 50 },
                ],
                missions: [
                    { id: 'task-1', x: 60, y: 40, completed: false, priority: 'high' },
                ],
                roamers: [
                    { id: 'roamer-1', x: 55, y: 55 },
                ],
                player: { x: 50, y: 50 },
            }

            expect(minimapData.obstacles).toBeDefined()
            expect(minimapData.missions).toBeDefined()
            expect(minimapData.roamers).toBeDefined()
            expect(minimapData.player).toBeDefined()
        })

        it('should have valid coordinates (0-100)', () => {
            const minimapData: MinimapData = {
                obstacles: [{ id: 'obs-1', x: 25, y: 75 }],
                missions: [{ id: 'task-1', x: 50, y: 50, completed: false, priority: 'medium' }],
                roamers: [{ id: 'roamer-1', x: 0, y: 100 }],
                player: { x: 50, y: 50 },
            }

            const allPoints = [
                ...minimapData.obstacles,
                ...minimapData.missions,
                ...minimapData.roamers,
                minimapData.player,
            ]

            allPoints.forEach(point => {
                expect(point.x).toBeGreaterThanOrEqual(0)
                expect(point.x).toBeLessThanOrEqual(100)
                expect(point.y).toBeGreaterThanOrEqual(0)
                expect(point.y).toBeLessThanOrEqual(100)
            })
        })

        it('should track mission completion', () => {
            const minimapData: MinimapData = {
                obstacles: [],
                missions: [
                    { id: 'task-1', x: 50, y: 50, completed: false, priority: 'high' },
                    { id: 'task-2', x: 60, y: 60, completed: true, priority: 'low' },
                ],
                roamers: [],
                player: { x: 50, y: 50 },
            }

            const completed = minimapData.missions.filter(m => m.completed)
            expect(completed).toHaveLength(1)
        })
    })
})
