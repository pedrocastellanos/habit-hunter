import type { CharacterProfile, Difficulty, Priority, Task, UnlockableItem } from './types'

export const LEVEL_STEP = 100

export const PRIORITY_LABEL: Record<Priority, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
}

export const PRIORITY_REWARD: Record<Priority, number> = {
    low: 25,
    medium: 50,
    high: 90,
}

export const PRIORITY_TO_DIFFICULTY: Record<Priority, Difficulty> = {
    low: 'easy',
    medium: 'medium',
    high: 'hard',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
    low: '#2bff9b',
    medium: '#facc15',
    high: '#ff406f',
}

export const CHARACTERS: CharacterProfile[] = [
    {
        id: 'cipher',
        name: 'Cipher',
        role: 'Arquitecta del sistema',
        description: 'Especialista en estabilizar nodos de enfoque.',
        accent: '#33d0ff',
        trail: 'Haz de datos turquesa',
    },
    {
        id: 'vanta',
        name: 'Vanta',
        role: 'Estratega tactica',
        description: 'Convierte tareas complejas en objetivos medibles.',
        accent: '#fb74ff',
        trail: 'Resplandor violeta segmentado',
    },
]

export const UNLOCKABLE_ITEMS: UnlockableItem[] = [
    // Weapons
    {
        id: 'weapon-pulse-blaster',
        name: 'Pulse Blaster',
        description: 'Standard weapon. Balanced stats.',
        slot: 'weapon',
        unlockLevel: 1,
        accent: '#00ffff',
    },
    {
        id: 'weapon-neon-laser-rifle',
        name: 'Neon Laser Rifle',
        description: 'Increased damage and fire rate.',
        slot: 'weapon',
        unlockLevel: 2,
        accent: '#36d7ff',
    },
    {
        id: 'weapon-plasma-cannon',
        name: 'Plasma Cannon',
        description: 'Heavy weapon. High damage, great range.',
        slot: 'weapon',
        unlockLevel: 4,
        accent: '#ff6b35',
    },
    {
        id: 'weapon-quantum-disruptor',
        name: 'Quantum Disruptor',
        description: 'Advanced weapon. Extreme damage.',
        slot: 'weapon',
        unlockLevel: 8,
        accent: '#9d4edd',
    },
    {
        id: 'weapon-void-annihilator',
        name: 'Void Annihilator',
        description: 'Ultimate weapon. Devastating damage.',
        slot: 'weapon',
        unlockLevel: 15,
        accent: '#3a0ca3',
    },

    // Shields
    {
        id: 'shield-energy-shield-mk-i',
        name: 'Energy Shield Mk I',
        description: 'Basic shield. Modest protection.',
        slot: 'shield',
        unlockLevel: 1,
        accent: '#7af86f',
    },
    {
        id: 'shield-photon-barrier',
        name: 'Photon Barrier',
        description: 'Medium shield. Strong defense.',
        slot: 'shield',
        unlockLevel: 3,
        accent: '#b786ff',
    },
    {
        id: 'shield-plasma-deflector',
        name: 'Plasma Deflector',
        description: 'Advanced shield. Deflects damage.',
        slot: 'shield',
        unlockLevel: 6,
        accent: '#06ffa5',
    },
    {
        id: 'shield-quantum-shield',
        name: 'Quantum Shield',
        description: 'High-tech shield. Excellent defense.',
        slot: 'shield',
        unlockLevel: 10,
        accent: '#ffbe0b',
    },
    {
        id: 'shield-void-shield-core',
        name: 'Void Shield Core',
        description: 'Legendary shield. Maximum protection.',
        slot: 'shield',
        unlockLevel: 18,
        accent: '#fb5607',
    },

    // Accessories
    {
        id: 'accessory-neon-visor',
        name: 'Neon Visor',
        description: 'Enhanced targeting. Sight boost.',
        slot: 'accessory',
        unlockLevel: 1,
        accent: '#facc15',
    },
    {
        id: 'accessory-cyber-boots',
        name: 'Cyber Boots',
        description: 'Enhanced mobility. Faster movement.',
        slot: 'accessory',
        unlockLevel: 3,
        accent: '#2bff9b',
    },
    {
        id: 'accessory-holographic-cloak',
        name: 'Holographic Cloak',
        description: 'Invisibility tech. High evasion.',
        slot: 'accessory',
        unlockLevel: 7,
        accent: '#ff406f',
    },
    {
        id: 'accessory-ai-companion-drone',
        name: 'AI Companion Drone',
        description: 'AI assistant. Boosts damage and defense.',
        slot: 'accessory',
        unlockLevel: 12,
        accent: '#00d9ff',
    },
    {
        id: 'accessory-temporal-accelerator',
        name: 'Temporal Accelerator',
        description: 'Time manipulation. Ultimate mobility.',
        slot: 'accessory',
        unlockLevel: 20,
        accent: '#ff006e',
    },
]

export const DEFAULT_TASKS: Task[] = [
    {
        id: 'task-water',
        title: 'Tomar 2L de agua',
        description: 'Mantener hidratacion diaria.',
        priority: 'low',
        reward: PRIORITY_REWARD.low,
        completed: false,
        createdAt: Date.now() - 1000 * 60 * 60 * 8,
    },
    {
        id: 'task-workout',
        title: 'Entrenar 30 minutos',
        description: 'Bloque principal de energia.',
        priority: 'medium',
        reward: PRIORITY_REWARD.medium,
        completed: false,
        createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
    {
        id: 'task-reading',
        title: 'Leer 20 paginas',
        description: 'Sesion de foco profundo.',
        priority: 'high',
        reward: PRIORITY_REWARD.high,
        completed: false,
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
    },
]

export function getLevelFromXp(xp: number): number {
    return Math.floor(xp / LEVEL_STEP) + 1
}

export function getLevelProgress(xp: number): number {
    return (xp % LEVEL_STEP) / LEVEL_STEP
}

export function getAttackDistanceMultiplier(level: number): number {
    // Aumenta un 15% por cada nivel (mínimo 1, máximo 2.5x)
    // Mismo que el factor de escala de enemigos para consistencia
    return Math.min(2.5, 1 + (Math.max(0, level - 1) * 0.15))
}

export function makeTaskId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }
    return `task-${Date.now()}-${Math.floor(Math.random() * 9999)}`
}
