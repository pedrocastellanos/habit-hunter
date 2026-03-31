import { useTranslation } from 'react-i18next'
import type { CharacterProfile } from '@/game/types'
import { getCharacterArtworkPath, getCharacterArtworkAlt } from '@/utils/characterArtwork'

export interface CharacterSelectorProps {
    characters: CharacterProfile[]
    selectedId: string
    onSelect: (characterId: string) => void
}

export function CharacterSelector({
    characters,
    selectedId,
    onSelect,
}: CharacterSelectorProps) {
    const { t } = useTranslation()

    return (
        <div className="mt-4 space-y-2">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">{t('character.selectCharacter')}</h3>
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                {characters.map((character) => {
                    const isSelected = selectedId === character.id
                    const artworkPath = getCharacterArtworkPath(character.id)
                    const artworkAlt = getCharacterArtworkAlt(character.id)

                    return (
                        <button
                            key={character.id}
                            onClick={() => onSelect(character.id)}
                            className={`relative flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 transition-all duration-300 ${isSelected
                                ? 'border-[#00ffff] bg-[#00ffff]/5'
                                : 'border-slate-700 bg-[#1a1a1a] hover:border-slate-500'
                                }`}
                            style={isSelected ? {
                                boxShadow: `0 0 20px ${character.accent}, inset 0 0 15px ${character.accent}20`
                            } : {}}
                        >
                            {/* SVG Artwork */}
                            {artworkPath ? (
                                <div className="relative w-full h-56 flex items-center justify-center">
                                    <img
                                        src={artworkPath}
                                        alt={artworkAlt}
                                        className="w-44 h-44 object-contain drop-shadow-lg"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-56 flex items-center justify-center bg-slate-800 rounded">
                                    <span className="text-slate-400 text-xs">{character.name}</span>
                                </div>
                            )}

                            {/* Character Info */}
                            <div className="w-full px-3 py-3 bg-gradient-to-t from-[#0a0a0a] to-transparent">
                                <p className="text-sm font-bold text-slate-100 truncate">{character.name}</p>
                                <p className="text-sm text-slate-500 truncate">
                                    {t(`character.profile.${character.id}.role`, {
                                        defaultValue: character.role,
                                    })}
                                </p>
                            </div>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-3 h-3 rounded-full"
                                    style={{ backgroundColor: character.accent, boxShadow: `0 0 8px ${character.accent}` }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
