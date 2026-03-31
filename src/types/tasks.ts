import type { Task, Priority } from '@/game/types'

export type OrderedTask = Task

export type FilteredTasks = {
    ordered: OrderedTask[]
    filtered: OrderedTask[]
    active: OrderedTask[]
    activeCount: number
    lockedItems?: unknown[]
    unlockedItems?: unknown[]
}

export type TaskFormState = {
    title: string
    description: string
    priority: Priority
    searchTerm: string
}
