export type EnergyShot = {
    id: string
    start: [number, number, number]
    end: [number, number, number]
    createdAt: number
    arcDrop: number
}

export type PlayerState = {
    health: number
    maxHealth: number
    deaths: number
    respawnCooldownMs: number
    isDead: boolean
    lastDeathTime: number | null
}

export type RoamingEnemyData = {
    id: string
    position: [number, number, number]
    health: number
}

export type HealthItemData = {
    id: string
    position: [number, number, number]
    amount: number
}

export type XpPopupData = {
    id: string
    amount: number
    position: [number, number, number]
    createdAt: number
}

export type MinimapPoint = {
    x: number
    y: number
}

export type MinimapMission = MinimapPoint & {
    id: string
    completed: boolean
    priority: 'low' | 'medium' | 'high'
}

export type MinimapObstacle = MinimapPoint & {
    id: string
}

export type MinimapRoamer = MinimapPoint & {
    id: string
}

export type MinimapData = {
    obstacles: MinimapObstacle[]
    missions: MinimapMission[]
    roamers: MinimapRoamer[]
    player: MinimapPoint
}
