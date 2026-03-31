import { describe, it, expect } from 'vitest'
import type { TaskFormState, FilteredTasks } from './tasks'

describe('tasks.ts types', () => {
    describe('TaskFormState type', () => {
        it('should define TaskFormState properties', () => {
            const formState: TaskFormState = {
                title: 'Test Task',
                description: 'Test Description',
                priority: 'high',
                searchTerm: '',
            }

            expect(formState.title).toBe('Test Task')
            expect(formState.description).toBe('Test Description')
            expect(formState.priority).toBe('high')
            expect(formState.searchTerm).toBe('')
        })

        it('should handle all priority levels', () => {
            const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']

            priorities.forEach(priority => {
                const formState: TaskFormState = {
                    title: 'Task',
                    description: 'Desc',
                    priority,
                    searchTerm: '',
                }

                expect(formState.priority).toBe(priority)
            })
        })

        it('should handle empty strings', () => {
            const formState: TaskFormState = {
                title: '',
                description: '',
                priority: 'medium',
                searchTerm: '',
            }

            expect(formState.title).toBe('')
            expect(formState.description).toBe('')
        })

        it('should handle long text', () => {
            const longText = 'a'.repeat(1000)
            const formState: TaskFormState = {
                title: longText,
                description: longText,
                priority: 'low',
                searchTerm: '',
            }

            expect(formState.title.length).toBe(1000)
            expect(formState.description.length).toBe(1000)
        })
    })

    describe('FilteredTasks type', () => {
        it('should define FilteredTasks properties', () => {
            const filtered: FilteredTasks = {
                ordered: [],
                filtered: [],
                active: [],
                activeCount: 0,
            }

            expect(filtered.ordered).toEqual([])
            expect(filtered.filtered).toEqual([])
            expect(filtered.activeCount).toBe(0)
        })

        it('should have results array', () => {
            const mockTask = {
                id: 'task-1',
                title: 'Task',
                description: 'Desc',
                priority: 'high' as const,
                reward: 100,
                completed: false,
                createdAt: Date.now(),
            }
            const filtered: FilteredTasks = {
                ordered: [mockTask],
                filtered: [mockTask],
                active: [mockTask],
                activeCount: 1,
            }

            expect(filtered.filtered).toHaveLength(1)
            expect(filtered.activeCount).toBe(1)
        })

        it('should track count accurately', () => {
            const mockTasks = [
                {
                    id: 'task-1',
                    title: 'Task 1',
                    description: 'Desc 1',
                    priority: 'low' as const,
                    reward: 50,
                    completed: false,
                    createdAt: Date.now(),
                },
                {
                    id: 'task-2',
                    title: 'Task 2',
                    description: 'Desc 2',
                    priority: 'medium' as const,
                    reward: 75,
                    completed: true,
                    createdAt: Date.now(),
                },
            ]
            const filtered: FilteredTasks = {
                ordered: mockTasks,
                filtered: mockTasks,
                active: mockTasks,
                activeCount: 2,
            }

            expect(filtered.activeCount).toBe(2)
            expect(filtered.active.length).toBe(2)
        })

        it('should handle empty search term', () => {
            const filtered: FilteredTasks = {
                ordered: [],
                filtered: [],
                active: [],
                activeCount: 0,
            }

            expect(filtered.filtered).toEqual([])
        })
    })
})
