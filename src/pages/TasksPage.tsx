import { motion } from 'framer-motion'
import { PRIORITY_REWARD } from '@/game/catalog'
import type { Priority } from '@/game/types'
import { useGame } from '@/context/useGame'
import { useTranslation } from 'react-i18next'
import { getFormattedUTCTime } from '@/utils/common'
import { useTaskFiltering, useTaskForm } from '@/hooks/useTasks'
import { tasksPageVariants, tasksFadeUpVariants, tasksCardVariants } from '@/constants/animations'
import { PriorityChip } from '@/components/ui/PriorityChip'
import { TaskCard } from '@/components/ui/TaskCard'
import { OPERATOR_AVATAR_URL } from '@/constants/character'

const priorityOptions: Priority[] = ['low', 'medium', 'high']

export function TasksPage() {
    const { t, i18n } = useTranslation()
    const { tasks, addTask, completeTask, reopenTask, removeTask, level } = useGame()

    const { searchTerm, setSearchTerm, filteredActiveTasks, stats } = useTaskFiltering(tasks)
    const { title, setTitle, description, setDescription, priority, setPriority, resetForm } = useTaskForm()
    const rewardPreview = PRIORITY_REWARD[priority]
    const utcNow = getFormattedUTCTime(i18n.language)

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const cleanTitle = title.trim()
        if (!cleanTitle) return

        addTask({
            title: cleanTitle,
            description: description.trim() || t('tasks.noDescription'),
            priority,
        })

        resetForm()
    }

    return (
        <motion.section
            className="page page-tasks stitch-tasks-page"
            initial="hidden"
            animate="visible"
            variants={tasksPageVariants}
        >
            <motion.div className="stitch-task-shell" variants={tasksPageVariants}>
                <motion.div className="tasks-heading-band" variants={tasksFadeUpVariants}>
                    <div className="tasks-heading-copy">
                        <span>{t('tasks.taskManagementSystem')}</span>
                        <h1>{t('tasks.missionConfig')}</h1>
                        <p>{t('tasks.missionConfigDescription')}</p>
                    </div>

                    <motion.div className="tasks-heading-meta" variants={tasksFadeUpVariants}>
                        <div>
                            <p>{t('tasks.currentLevel')}</p>
                            <strong>{t('tasks.levelHunter', { level })}</strong>
                        </div>
                        <div className="tasks-operator-avatar">
                            <span style={{ backgroundImage: `url(${OPERATOR_AVATAR_URL})` }} />
                        </div>
                    </motion.div>
                </motion.div>

                <div className="tasks-workspace-grid">
                    <motion.article className="stitch-create-panel" variants={tasksFadeUpVariants}>
                        <div className="stitch-panel-title">
                            <span className="material-symbols-outlined">add_circle</span>
                            <h2>{t('tasks.createNewMission')}</h2>
                        </div>

                        <form className="stitch-mission-form" onSubmit={handleSubmit}>
                            <label>
                                <span>{t('tasks.missionTitle')}</span>
                                <div className="stitch-input-shell neon-border">
                                    <input
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        placeholder={t('tasks.missionTitlePlaceholder')}
                                        required
                                    />
                                    <i className="material-symbols-outlined">target</i>
                                </div>
                            </label>

                            <label>
                                <span>{t('tasks.description')}</span>
                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    rows={3}
                                    placeholder={t('tasks.descriptionPlaceholder')}
                                />
                            </label>

                            <div className="stitch-priority-block">
                                <p>{t('tasks.priorityLevel')}</p>
                                <div className="stitch-priority-grid">
                                    {priorityOptions.map((option) => (
                                        <PriorityChip
                                            key={option}
                                            priority={option}
                                            isActive={priority === option}
                                            onClick={() => setPriority(option)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="stitch-reward-panel">
                                <div>
                                    <p>{t('tasks.calculatedReward')}</p>
                                    <strong>+{rewardPreview} XP</strong>
                                </div>
                                <span className="material-symbols-outlined">database</span>
                            </div>

                            <button type="submit" className="stitch-submit-btn">
                                <span className="material-symbols-outlined">rocket_launch</span>
                                {t('tasks.launchMission')}
                            </button>
                        </form>
                    </motion.article>

                    <motion.article className="stitch-missions-panel" variants={tasksFadeUpVariants}>
                        <div className="stitch-missions-header">
                            <div>
                                <span className="material-symbols-outlined">data_usage</span>
                                <h2>{t('tasks.activeMissions')}</h2>
                            </div>

                            <div className="stitch-missions-right">
                                <label className="stitch-search-shell" aria-label={t('tasks.searchMissionsAria')}>
                                    <span className="material-symbols-outlined">search</span>
                                    <input
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        placeholder={t('tasks.searchDatabase')}
                                    />
                                </label>

                                <div className="stitch-signal-dots" aria-hidden="true">
                                    <span className="is-on" />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        </div>

                        <motion.ul className="stitch-mission-list" variants={tasksPageVariants}>
                            {filteredActiveTasks.map((task, index) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    variant={tasksCardVariants}
                                    onComplete={completeTask}
                                    onReopen={reopenTask}
                                    onDelete={removeTask}
                                />
                            ))}
                        </motion.ul>
                    </motion.article>
                </div>

                <motion.footer className="stitch-task-footer" variants={tasksFadeUpVariants}>
                    <div>
                        <span>
                            <i /> {t('tasks.uplinkStable')}
                        </span>
                        <span>{t('tasks.active')}: {stats.active}</span>
                        <span>{t('tasks.total')}: {stats.total}</span>
                    </div>
                    <div>
                        <span>HABIT_HUNTER_V2.0.4</span>
                        <span>{utcNow} UTC</span>
                    </div>
                </motion.footer>
            </motion.div>
        </motion.section>
    )
}
