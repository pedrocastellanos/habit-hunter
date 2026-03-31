import type { CharacterProfile } from '@/game/types'
import { getCharacterArtworkPath, getCharacterArtworkAlt } from '@/utils/characterArtwork'

export interface CharacterAvatarDisplayProps {
    character: CharacterProfile
    size?: 'small' | 'medium' | 'large'
    showName?: boolean
    showRole?: boolean
    className?: string
}

export function CharacterAvatarDisplay({
    character,
    size = 'medium',
    showName = false,
    showRole = false,
    className = '',
}: CharacterAvatarDisplayProps) {
    const artworkPath = getCharacterArtworkPath(character.id)
    const artworkAlt = getCharacterArtworkAlt(character.id)

    const sizeClasses = {
        small: 'w-32 h-32',
        medium: 'w-48 h-48',
        large: 'w-64 h-64',
    }

    const imageSizeClasses = {
        small: 'w-28 h-28',
        medium: 'w-44 h-44',
        large: 'w-60 h-60',
    }

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            <div
                className={`${sizeClasses[size]} flex items-center justify-center rounded-lg border-2 border-[${character.accent}]/40 bg-[${character.accent}]/5 overflow-hidden`}
                style={{
                    borderColor: `${character.accent}40`,
                    backgroundColor: `${character.accent}05`,
                    boxShadow: `0 0 15px ${character.accent}40`,
                }}
            >
                {artworkPath ? (
                    <img
                        src={artworkPath}
                        alt={artworkAlt}
                        className={`${imageSizeClasses[size]} object-contain drop-shadow-lg`}
                        style={{
                            filter: `drop-shadow(0 0 8px ${character.accent}60)`,
                        }}
                    />
                ) : (
                    <span className="material-symbols-outlined text-4xl" style={{ color: character.accent }}>
                        person
                    </span>
                )}
            </div>
            {showName && (
                <p className="text-sm font-bold text-slate-100">{character.name}</p>
            )}
            {showRole && (
                <p className="text-xs text-slate-400">{character.role}</p>
            )}
        </div>
    )
}
