import type { Task } from '@/game/types'

/**
 * Order tasks: incomplete first (by creation date), then completed
 */
export function orderTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed)
        return b.createdAt - a.createdAt
    })
}

/**
 * Filter tasks by search term (title and description)
 */
export function filterTasksBySearch(tasks: Task[], searchTerm: string): Task[] {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return tasks

    return tasks.filter((task) => {
        return (
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query)
        )
    })
}

/**
 * Get active (incomplete) tasks
 */
export function getActiveTasks(tasks: Task[]): Task[] {
    return tasks.filter((task) => !task.completed)
}

/**
 * Get task count by completion status
 */
export function getTaskStats(tasks: Task[]): { active: number; total: number; completed: number } {
    const active = getActiveTasks(tasks).length
    return {
        active,
        completed: tasks.length - active,
        total: tasks.length,
    }
}
