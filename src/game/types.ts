export type Priority = 'low' | 'medium' | 'high'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Task = {
    id: string
    title: string
    description: string
    priority: Priority
    reward: number
    completed: boolean
    createdAt: number
}

export type CharacterProfile = {
    id: string
    name: string
    role: string
    description: string
    accent: string
    trail: string
}

export type ItemSlot = 'weapon' | 'shield' | 'accessory'

export type UnlockableItem = {
    id: string
    name: string
    description: string
    slot: ItemSlot
    unlockLevel: number
    accent: string
}
