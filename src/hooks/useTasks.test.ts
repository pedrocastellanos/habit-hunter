import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTaskFiltering, useTaskForm } from './useTasks'
import type { Task } from '@/game/types'

const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Learn React',
        description: 'Master React hooks',
        priority: 'high',
        reward: 100,
        completed: false,
        createdAt: Date.now(),
    },
    {
        id: '2',
        title: 'Read docs',
        description: 'Read TypeScript docs',
        priority: 'medium',
        reward: 50,
        completed: true,
        createdAt: Date.now() - 5000,
    },
    {
        id: '3',
        title: 'Exercise',
        description: 'Go running',
        priority: 'low',
        reward: 25,
        completed: false,
        createdAt: Date.now() - 10000,
    },
]

describe('useTasks.ts hooks', () => {
    describe('useTaskFiltering', () => {
        it('should initialize with default values', () => {
            const { result } = renderHook(() => useTaskFiltering(mockTasks))

            expect(result.current.searchTerm).toBe('')
            expect(result.current.orderedTasks).toHaveLength(3)
            expect(result.current.filteredTasks).toHaveLength(3)
        })

        it('should filter tasks by search term', () => {
            const { result } = renderHook(() => useTaskFiltering(mockTasks))

            act(() => {
                result.current.setSearchTerm('React')
            })

            expect(result.current.filteredTasks).toHaveLength(1)
            expect(result.current.filteredTasks[0].id).toBe('1')
        })

        it('should return only active tasks in filteredActiveTasks', () => {
            const { result } = renderHook(() => useTaskFiltering(mockTasks))

            expect(result.current.filteredActiveTasks).toHaveLength(2)
            expect(result.current.filteredActiveTasks.every(t => !t.completed)).toBe(true)
        })

        it('should provide stats', () => {
            const { result } = renderHook(() => useTaskFiltering(mockTasks))

            expect(result.current.stats).toBeDefined()
            expect(result.current.stats.total).toBe(3)
            expect(result.current.stats.active).toBe(2)
        })

        it('should update filtered results when search changes', () => {
            const { result } = renderHook(
                ({ tasks }: { tasks: Task[] }) => useTaskFiltering(tasks),
                { initialProps: { tasks: mockTasks } }
            )

            act(() => {
                result.current.setSearchTerm('Read')
            })

            expect(result.current.filteredTasks).toHaveLength(1)

            act(() => {
                result.current.setSearchTerm('')
            })

            expect(result.current.filteredTasks).toHaveLength(3)
        })

        it('should handle case-insensitive search', () => {
            const { result } = renderHook(() => useTaskFiltering(mockTasks))

            act(() => {
                result.current.setSearchTerm('react')
            })

            expect(result.current.filteredTasks).toHaveLength(1)
        })
    })

    describe('useTaskForm', () => {
        it('should initialize form state', () => {
            const { result } = renderHook(() => useTaskForm())

            expect(result.current.title).toBe('')
            expect(result.current.description).toBe('')
            expect(result.current.priority).toBe('medium')
        })

        it('should update title', () => {
            const { result } = renderHook(() => useTaskForm())

            act(() => {
                result.current.setTitle('New Task')
            })

            expect(result.current.title).toBe('New Task')
        })

        it('should update description', () => {
            const { result } = renderHook(() => useTaskForm())

            act(() => {
                result.current.setDescription('Task description')
            })

            expect(result.current.description).toBe('Task description')
        })

        it('should update priority', () => {
            const { result } = renderHook(() => useTaskForm())

            act(() => {
                result.current.setPriority('high')
            })

            expect(result.current.priority).toBe('high')
        })

        it('should reset form to initial state', () => {
            const { result } = renderHook(() => useTaskForm())

            act(() => {
                result.current.setTitle('Test')
                result.current.setDescription('Description')
                result.current.setPriority('high')
            })

            expect(result.current.title).toBe('Test')

            act(() => {
                result.current.resetForm()
            })

            expect(result.current.title).toBe('')
            expect(result.current.description).toBe('')
            expect(result.current.priority).toBe('medium')
        })

        it('should have valid form state for submission', () => {
            const { result } = renderHook(() => useTaskForm())

            act(() => {
                result.current.setTitle('Task Title')
                result.current.setDescription('Task Description')
            })

            expect(result.current.title.length).toBeGreaterThan(0)
            expect(result.current.priority).toBeDefined()
        })
    })
})
