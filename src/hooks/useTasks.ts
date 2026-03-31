import { useMemo, useState } from 'react'
import { orderTasks, filterTasksBySearch, getActiveTasks, getTaskStats } from '@/utils/tasks'
import type { Task, Priority } from '@/game/types'

export function useTaskFiltering(tasks: Task[]) {
    const [searchTerm, setSearchTerm] = useState('')

    const orderedTasks = useMemo(() => orderTasks(tasks), [tasks])

    const filteredTasks = useMemo(
        () => filterTasksBySearch(orderedTasks, searchTerm),
        [orderedTasks, searchTerm],
    )

    const filteredActiveTasks = useMemo(
        () => getActiveTasks(filteredTasks),
        [filteredTasks],
    )

    const stats = useMemo(() => getTaskStats(orderedTasks), [orderedTasks])

    return {
        searchTerm,
        setSearchTerm,
        orderedTasks,
        filteredTasks,
        filteredActiveTasks,
        stats,
    }
}

export function useTaskForm() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<Priority>('medium')

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setPriority('medium')
    }

    return {
        title,
        setTitle,
        description,
        setDescription,
        priority,
        setPriority,
        resetForm,
    }
}
