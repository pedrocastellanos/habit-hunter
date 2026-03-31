import type { Priority } from '@/game/types'

export type EquipmentSlot = 'weapon' | 'shield' | 'accessory'

export type EquipmentItem = {
    id: string
    name: string
    slot: EquipmentSlot
    requiredXP: number
}

export const EQUIPMENT_ITEMS: EquipmentItem[] = [
    { id: 'weapon-pulse-blaster', name: 'Pulse Blaster', slot: 'weapon', requiredXP: 0 },
    { id: 'weapon-neon-laser-rifle', name: 'Neon Laser Rifle', slot: 'weapon', requiredXP: 150 },
    { id: 'weapon-plasma-cannon', name: 'Plasma Cannon', slot: 'weapon', requiredXP: 400 },
    { id: 'weapon-quantum-disruptor', name: 'Quantum Disruptor', slot: 'weapon', requiredXP: 800 },
    { id: 'weapon-void-annihilator', name: 'Void Annihilator', slot: 'weapon', requiredXP: 1500 },
    { id: 'shield-energy-shield-mk-i', name: 'Energy Shield Mk I', slot: 'shield', requiredXP: 100 },
    { id: 'shield-photon-barrier', name: 'Photon Barrier', slot: 'shield', requiredXP: 300 },
    { id: 'shield-plasma-deflector', name: 'Plasma Deflector', slot: 'shield', requiredXP: 600 },
    { id: 'shield-quantum-shield', name: 'Quantum Shield', slot: 'shield', requiredXP: 1000 },
    { id: 'shield-void-shield-core', name: 'Void Shield Core', slot: 'shield', requiredXP: 1800 },
    { id: 'accessory-neon-visor', name: 'Neon Visor', slot: 'accessory', requiredXP: 50 },
    { id: 'accessory-cyber-boots', name: 'Cyber Boots', slot: 'accessory', requiredXP: 250 },
    { id: 'accessory-holographic-cloak', name: 'Holographic Cloak', slot: 'accessory', requiredXP: 700 },
    { id: 'accessory-ai-companion-drone', name: 'AI Companion Drone', slot: 'accessory', requiredXP: 1200 },
    { id: 'accessory-temporal-accelerator', name: 'Temporal Accelerator', slot: 'accessory', requiredXP: 2000 },
]

export const SLOT_ICON: Record<EquipmentSlot, string> = {
    weapon: 'swords',
    shield: 'shield',
    accessory: 'auto_fix_high',
}

export const PRIORITY_HEALTH: Record<Priority, number> = {
    low: 1,
    medium: 2,
    high: 3,
}

export const EQUIPPED_STORAGE_KEY = 'habit-hunter-character-equipment-v1'

export const EQUIPMENT_BY_ID = new Map(EQUIPMENT_ITEMS.map((item) => [item.id, item]))

export const OPERATOR_AVATAR_URL =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBAtQNBzl4tuY9P2hwUlJtel71FK69lslG65Go8nQukj0mgwX4xpnq5PY1QtXcxnF6c2CjpuXW0AbbIHIeohzU3M5lt3jiwSNgIAyxG778WTGMWhk45qH656Ajc-Fv4FTpj6pzK1SIA7PhcXIFwKxBXqbBLFzuAjOudeHzJBZbe0nLH4t1ZQ5N_sG01rn--LFH0WA_1eWc9TkAcsSYWly3Cxbc4wFQ6S59vGGRPpNd5odIL-1ti-6ROCfQ8SKsPeDvafML8chxGVaw8'
