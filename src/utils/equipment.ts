import type { EquipmentSlot, EquipmentItem } from '@/constants/character'
import { EQUIPMENT_BY_ID, EQUIPPED_STORAGE_KEY } from '@/constants/character'

export function sanitizeEquippedState(
    candidate: Record<EquipmentSlot, string | null>,
    xp: number,
): Record<EquipmentSlot, string | null> {
    const slots: EquipmentSlot[] = ['weapon', 'shield', 'accessory']
    const sanitized: Record<EquipmentSlot, string | null> = {
        weapon: null,
        shield: null,
        accessory: null,
    }

    for (const slot of slots) {
        const itemId = candidate[slot]
        if (!itemId) continue

        const item = EQUIPMENT_BY_ID.get(itemId)
        if (!item || item.slot !== slot || item.requiredXP > xp) continue
        sanitized[slot] = itemId
    }

    return sanitized
}

/**
 * Read persisted equipment state from localStorage with fallback
 */
export function readPersistedEquippedState(xp: number): Record<EquipmentSlot, string | null> {
    const fallback: Record<EquipmentSlot, string | null> = {
        weapon: 'weapon-pulse-blaster',
        shield: null,
        accessory: null,
    }

    if (typeof window === 'undefined') {
        return sanitizeEquippedState(fallback, xp)
    }

    const raw = window.localStorage.getItem(EQUIPPED_STORAGE_KEY)
    if (!raw) return sanitizeEquippedState(fallback, xp)

    try {
        const parsed = JSON.parse(raw) as Partial<Record<EquipmentSlot, string | null>>
        const candidate: Record<EquipmentSlot, string | null> = {
            weapon: typeof parsed.weapon === 'string' ? parsed.weapon : null,
            shield: typeof parsed.shield === 'string' ? parsed.shield : null,
            accessory: typeof parsed.accessory === 'string' ? parsed.accessory : null,
        }
        return sanitizeEquippedState(candidate, xp)
    } catch {
        return sanitizeEquippedState(fallback, xp)
    }
}

/**
 * Save equipment state to localStorage
 */
export function saveEquippedState(state: Record<EquipmentSlot, string | null>): void {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(EQUIPPED_STORAGE_KEY, JSON.stringify(state))
    } catch {
        // Ignore storage errors
    }
}

/**
 * Get equipment item by ID
 */
export function getEquipmentItemById(itemId: string) {
    return EQUIPMENT_BY_ID.get(itemId) ?? null
}

/**
 * Check if item is unlocked by XP requirement
 */
export function isItemUnlocked(requiredXP: number, currentXP: number): boolean {
    return currentXP >= requiredXP
}

/**
 * Filter equipment items by unlocked/locked status
 */
export function separateEquipmentByXP(items: EquipmentItem[], xp: number) {
    return {
        unlocked: items.filter((item) => xp >= item.requiredXP),
        locked: items.filter((item) => xp < item.requiredXP),
    }
}
