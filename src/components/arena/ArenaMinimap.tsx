import { useTranslation } from 'react-i18next'
import { RADIANS_TO_DEGREES } from '@/constants/arena'
import type { MinimapData } from '@/types/arena'

export interface ArenaMinimapProps {
    data: MinimapData
    cameraYaw: number
}

export function ArenaMinimap({ data, cameraYaw }: ArenaMinimapProps) {
    const { t } = useTranslation()

    return (
        <div className="arena-minimap" aria-label={t('arena.minimapLabel')}>
            <div className="arena-minimap-title">{t('arena.minimapTitle')}</div>
            <div className="arena-minimap-grid">
                {data.obstacles.map((obstacle) => (
                    <span
                        key={obstacle.id}
                        className="arena-minimap-point obstacle"
                        style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
                    />
                ))}
                {data.roamers.map((roamer) => (
                    <span
                        key={roamer.id}
                        className="arena-minimap-point roamer"
                        style={{ left: `${roamer.x}%`, top: `${roamer.y}%` }}
                    />
                ))}
                {data.missions.map((mission) => (
                    <span
                        key={mission.id}
                        className={`arena-minimap-point mission ${mission.completed ? 'completed' : ''} is-${mission.priority}`}
                        style={{ left: `${mission.x}%`, top: `${mission.y}%` }}
                    />
                ))}
                <span
                    className="arena-minimap-player-arrow"
                    style={{
                        left: `${data.player.x}%`,
                        top: `${data.player.y}%`,
                        transform: `translate(-50%, -50%) rotate(${-cameraYaw * RADIANS_TO_DEGREES}deg)`,
                    }}
                />
            </div>
        </div>
    )
}
