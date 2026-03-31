import { useContext } from 'react'
import { GameContext, type GameContextValue } from './game-context'

export function useGame(): GameContextValue {
    const context = useContext(GameContext)
    if (!context) {
        throw new Error('useGame debe usarse dentro de GameProvider')
    }
    return context
}
