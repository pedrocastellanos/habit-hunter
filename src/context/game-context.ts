import { createContext } from 'react'
import type { CharacterProfile, Priority, Task, UnlockableItem } from '@/game/types'
import type { PlayerState } from '@/types/arena'
import type { EquipmentStatModifiers } from '@/game/equipmentStats'

type AddTaskInput = {
    title: string
    description: string
    priority: Priority
}

export type GameContextValue = {
    tasks: Task[]
    xp: number
    level: number
    levelProgress: number
    selectedCharacter: CharacterProfile
    characters: CharacterProfile[]
    items: UnlockableItem[]
    unlockedItemIds: Set<string>
    equippedItemIds: string[]
    equippedEquipmentItems: (UnlockableItem | undefined)[]
    equipmentModifiers: EquipmentStatModifiers
    completedTaskCount: number
    playerState: PlayerState
    addTask: (input: AddTaskInput) => void
    completeTask: (taskId: string) => void
    reopenTask: (taskId: string) => void
    removeTask: (taskId: string) => void
    selectCharacter: (characterId: string) => void
    toggleEquipItem: (itemId: string) => void
    addXp: (amount: number) => void
    damagePlayer: (amount: number) => void
    healPlayer: (amount: number) => void
    respawnPlayer: () => void
    resetPlayerStats: () => void
}

export const GameContext = createContext<GameContextValue | null>(null)
