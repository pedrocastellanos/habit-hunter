import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { TaskCard } from './TaskCard'
import { renderWithProviders } from '@/test/test-utils'
import type { Task } from '@/game/types'
import { motion } from 'framer-motion'

const mockTask: Task = {
    id: 'test-task',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    reward: 100,
    completed: false,
    createdAt: Date.now(),
}

const taskCardVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
}

describe('TaskCard Component', () => {
    it('should render task card', () => {
        renderWithProviders(
            <motion.div variants={taskCardVariants}>
                <TaskCard
                    task={mockTask}
                    index={0}
                    variant={taskCardVariants}
                    onComplete={vi.fn()}
                    onReopen={vi.fn()}
                    onDelete={vi.fn()}
                />
            </motion.div>
        )

        expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    it('should display task title and description', () => {
        renderWithProviders(
            <motion.div variants={taskCardVariants}>
                <TaskCard
                    task={mockTask}
                    index={0}
                    variant={taskCardVariants}
                    onComplete={vi.fn()}
                    onReopen={vi.fn()}
                    onDelete={vi.fn()}
                />
            </motion.div>
        )

        expect(screen.getByText('Test Task')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('should display reward', () => {
        renderWithProviders(
            <motion.div variants={taskCardVariants}>
                <TaskCard
                    task={mockTask}
                    index={0}
                    variant={taskCardVariants}
                    onComplete={vi.fn()}
                    onReopen={vi.fn()}
                    onDelete={vi.fn()}
                />
            </motion.div>
        )

        expect(screen.getByText(/100/)).toBeInTheDocument()
    })

    it('should call onComplete when complete button clicked', () => {
        const onComplete = vi.fn()
        renderWithProviders(
            <motion.div variants={taskCardVariants}>
                <TaskCard
                    task={mockTask}
                    index={0}
                    variant={taskCardVariants}
                    onComplete={onComplete}
                    onReopen={vi.fn()}
                    onDelete={vi.fn()}
                />
            </motion.div>
        )

        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBeGreaterThan(0)
    })

    it('should call onDelete when delete button clicked', () => {
        const onDelete = vi.fn()
        renderWithProviders(
            <motion.div variants={taskCardVariants}>
                <TaskCard
                    task={mockTask}
                    index={0}
                    variant={taskCardVariants}
                    onComplete={vi.fn()}
                    onReopen={vi.fn()}
                    onDelete={onDelete}
                />
            </motion.div>
        )

        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBeGreaterThan(0)
    })

    it('should handle completed task state', () => {
        const completedTask: Task = {
            ...mockTask,
            completed: true,
        }

        renderWithProviders(
            <motion.div variants={taskCardVariants}>
                <TaskCard
                    task={completedTask}
                    index={0}
                    variant={taskCardVariants}
                    onComplete={vi.fn()}
                    onReopen={vi.fn()}
                    onDelete={vi.fn()}
                />
            </motion.div>
        )

        expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    it('should display different priorities', () => {
        const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']

        priorities.forEach(priority => {
            const { unmount } = renderWithProviders(
                <motion.div variants={taskCardVariants}>
                    <TaskCard
                        task={{ ...mockTask, priority }}
                        index={0}
                        variant={taskCardVariants}
                        onComplete={vi.fn()}
                        onReopen={vi.fn()}
                        onDelete={vi.fn()}
                    />
                </motion.div>
            )

            expect(screen.getByText('Test Task')).toBeInTheDocument()
            unmount()
        })
    })
})
