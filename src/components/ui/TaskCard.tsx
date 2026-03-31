import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { Task } from '@/game/types'

export interface TaskCardProps {
    task: Task
    index: number
    variant?: Variants
    onComplete?: (taskId: string) => void
    onReopen?: (taskId: string) => void
    onDelete?: (taskId: string) => void
}

const priorityTheme = {
    low: { className: 'is-low' },
    medium: { className: 'is-medium' },
    high: { className: 'is-high' },
}

export function TaskCard({
    task,
    index,
    variant,
    onComplete,
    onReopen,
    onDelete,
}: TaskCardProps) {
    const { t } = useTranslation()

    return (
        <motion.li
            className={`stitch-mission-card hex-edge ${priorityTheme[task.priority].className} ${task.completed ? 'is-completed' : ''}`}
            layout
            variants={variant}
            whileHover={{ y: -2 }}
        >
            <div className="mission-main-copy">
                <div className="mission-meta-row">
                    <span className={`mission-priority-badge ${priorityTheme[task.priority].className}`}>
                        {t(`priority.${task.priority}`)} {t('tasks.prioritySuffix')}
                    </span>
                    <small>#{String(index + 1).padStart(4, '0')}</small>
                </div>

                <h3>{task.title}</h3>
                <p>{task.description}</p>
            </div>

            <div className="mission-side-actions">
                <div>
                    <p>{t('tasks.reward')}</p>
                    <strong>+{task.reward} XP</strong>
                </div>

                <div className="mission-action-buttons">
                    {!task.completed ? (
                        <button
                            type="button"
                            className="mission-action complete"
                            onClick={() => onComplete?.(task.id)}
                            aria-label={t('tasks.completeMissionAria')}
                        >
                            <span className="material-symbols-outlined">check_circle</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="mission-action reopen"
                            onClick={() => onReopen?.(task.id)}
                            aria-label={t('tasks.reopenMissionAria')}
                        >
                            <span className="material-symbols-outlined">history</span>
                        </button>
                    )}

                    <button
                        type="button"
                        className="mission-action delete"
                        onClick={() => onDelete?.(task.id)}
                        aria-label={t('tasks.deleteMissionAria')}
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        </motion.li>
    )
}
