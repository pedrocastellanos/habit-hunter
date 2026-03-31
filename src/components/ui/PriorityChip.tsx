import { useTranslation } from 'react-i18next'

export interface PriorityChipProps {
    priority: 'low' | 'medium' | 'high'
    onClick?: () => void
    isActive?: boolean
}

export function PriorityChip({ priority, onClick, isActive }: PriorityChipProps) {
    const { t } = useTranslation()

    const priorityTheme = {
        low: { icon: 'low_priority', className: 'is-low' },
        medium: { icon: 'priority_high', className: 'is-medium' },
        high: { icon: 'warning', className: 'is-high' },
    }

    const theme = priorityTheme[priority]

    return (
        <button
            type="button"
            onClick={onClick}
            className={`priority-chip ${theme.className} ${isActive ? 'active' : ''}`}
        >
            <span className="material-symbols-outlined">{theme.icon}</span>
            {t(`priority.${priority}`)}
        </button>
    )
}
