import { describe, it, expect } from 'vitest'
import { orderTasks, filterTasksBySearch, getActiveTasks, getTaskStats } from './tasks'
import type { Task } from '@/game/types'

const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Learn TypeScript',
        description: 'Master TypeScript basics',
        priority: 'high',
        reward: 100,
        completed: false,
        createdAt: Date.now() - 10000,
    },
    {
        id: '2',
        title: 'Read book',
        description: 'Read a book about testing',
        priority: 'medium',
        reward: 50,
        completed: true,
        createdAt: Date.now() - 5000,
    },
    {
        id: '3',
        title: 'Exercise',
        description: 'Go for a run',
        priority: 'low',
        reward: 25,
        completed: false,
        createdAt: Date.now() - 15000,
    },
    {
        id: '4',
        title: 'Study React',
        description: 'Learn React patterns',
        priority: 'high',
        reward: 150,
        completed: false,
        createdAt: Date.now() - 1000,
    },
]

describe('tasks.ts utilities', () => {
    describe('orderTasks', () => {
        it('should order incomplete tasks first, then by creation date', () => {
            const ordered = orderTasks(mockTasks)
            // Incomplete tasks come first (4, 3, 1), then completed (2)
            expect(ordered[0].id).toBe('4')  // Newest incomplete
            expect(ordered[1].id).toBe('1')  // Second newest incomplete
            expect(ordered[2].id).toBe('3')  // Third newest incomplete
            expect(ordered[3].id).toBe('2')  // Only completed
        })

        it('should handle empty array', () => {
            const result = orderTasks([])
            expect(result).toEqual([])
        })

        it('should not mutate original array', () => {
            const original = [...mockTasks]
            orderTasks(mockTasks)
            expect(mockTasks).toEqual(original)
        })
    })

    describe('filterTasksBySearch', () => {
        it('should filter by title (case-insensitive)', () => {
            const results = filterTasksBySearch(mockTasks, 'Learn')
            expect(results.length).toBeGreaterThan(0)
            expect(results.some(t => t.title.toLowerCase().includes('learn'))).toBe(true)
        })

        it('should filter by description', () => {
            const results = filterTasksBySearch(mockTasks, 'book')
            expect(results).toHaveLength(1)
            expect(results[0].id).toBe('2')
        })

        it('should be case insensitive', () => {
            const results1 = filterTasksBySearch(mockTasks, 'learn')
            const results2 = filterTasksBySearch(mockTasks, 'LEARN')
            expect(results1).toHaveLength(results2.length)
        })

        it('should return all tasks for empty search', () => {
            const results = filterTasksBySearch(mockTasks, '')
            expect(results).toEqual(mockTasks)
        })

        it('should return empty array for no matches', () => {
            const results = filterTasksBySearch(mockTasks, 'nonexistent')
            expect(results).toHaveLength(0)
        })

        it('should search in both title and description', () => {
            const results = filterTasksBySearch(mockTasks, 'Run')
            expect(results.length).toBeGreaterThan(0)
        })
    })

    describe('getActiveTasks', () => {
        it('should return only incomplete tasks', () => {
            const results = getActiveTasks(mockTasks)
            expect(results).toHaveLength(3)
            expect(results.every(t => !t.completed)).toBe(true)
        })

        it('should return empty array when all tasks completed', () => {
            const allCompleted = mockTasks.map(t => ({ ...t, completed: true }))
            const results = getActiveTasks(allCompleted)
            expect(results).toHaveLength(0)
        })

        it('should maintain original task order', () => {
            const results = getActiveTasks(mockTasks)
            expect(results[0].id).toBe('1')
        })

        it('should handle empty array', () => {
            const results = getActiveTasks([])
            expect(results).toHaveLength(0)
        })
    })

    describe('getTaskStats', () => {
        it('should calculate correct total and active counts', () => {
            const stats = getTaskStats(mockTasks)
            expect(stats.total).toBe(4)
            expect(stats.active).toBe(3)
            expect(stats.completed).toBe(1)
        })

        it('should calculate completed count correctly', () => {
            const stats = getTaskStats(mockTasks)
            expect(stats.completed).toBe(1)
        })

        it('should handle empty task list', () => {
            const stats = getTaskStats([])
            expect(stats.total).toBe(0)
            expect(stats.active).toBe(0)
            expect(stats.completed).toBe(0)
        })

        it('should handle all completed tasks', () => {
            const allCompleted = mockTasks.map(t => ({ ...t, completed: true }))
            const stats = getTaskStats(allCompleted)
            expect(stats.total).toBe(4)
            expect(stats.active).toBe(0)
            expect(stats.completed).toBe(4)
        })

        it('should handle all active tasks', () => {
            const allActive = mockTasks.map(t => ({ ...t, completed: false }))
            const stats = getTaskStats(allActive)
            expect(stats.total).toBe(4)
            expect(stats.active).toBe(4)
            expect(stats.completed).toBe(0)
        })
    })
})
