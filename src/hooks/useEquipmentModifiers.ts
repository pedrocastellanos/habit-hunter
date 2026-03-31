import { useMemo } from 'react'
import { EQUIPMENT_ITEMS } from '@/constants/character'
import { combineStatModifiers, getEquipmentStatModifiers, type EquipmentStatModifiers } from '@/game/equipmentStats'

/**
 * Hook to calculate cumulative equipment stat modifiers
 * Takes into account all equipped items (weapon, shield, accessory)
 */
export function useEquipmentModifiers(equippedItemIds: string[]): EquipmentStatModifiers {
    return useMemo(() => {
        const validItemIds = equippedItemIds.filter((id) =>
            EQUIPMENT_ITEMS.some((item) => item.id === id),
        )

        if (validItemIds.length === 0) {
            return getEquipmentStatModifiers('weapon-pulse-blaster')
        }

        const modifiers = validItemIds.map((id) => getEquipmentStatModifiers(id))
        return combineStatModifiers(...modifiers)
    }, [equippedItemIds])
}
