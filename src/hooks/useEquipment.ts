import { useEffect, useMemo, useState } from 'react'
import { EQUIPMENT_ITEMS } from '@/constants/character'
import { sanitizeEquippedState, readPersistedEquippedState, saveEquippedState, separateEquipmentByXP } from '@/utils/equipment'
import type { EquipmentSlot } from '@/constants/character'

export function useEquipmentManagement(xp: number) {
    const [equippedBySlot, setEquippedBySlot] = useState<Record<EquipmentSlot, string | null>>(() =>
        sanitizeEquippedState(readPersistedEquippedState(0), xp),
    )

    // Persist equipment state to localStorage
    useEffect(() => {
        saveEquippedState(equippedBySlot)
    }, [equippedBySlot])

    // Sanitize equipped items based on current XP
    const equippedWeapon = equippedBySlot.weapon && EQUIPMENT_ITEMS.find((item) => item.id === equippedBySlot.weapon && xp >= item.requiredXP) ? equippedBySlot.weapon : null
    const equippedShield = equippedBySlot.shield && EQUIPMENT_ITEMS.find((item) => item.id === equippedBySlot.shield && xp >= item.requiredXP) ? equippedBySlot.shield : null
    const equippedAccessory = equippedBySlot.accessory && EQUIPMENT_ITEMS.find((item) => item.id === equippedBySlot.accessory && xp >= item.requiredXP) ? equippedBySlot.accessory : null

    const { unlocked: unlockedItems, locked: lockedItems } = useMemo(() => {
        return separateEquipmentByXP(EQUIPMENT_ITEMS, xp)
    }, [xp])

    const equippedWeaponItem = EQUIPMENT_ITEMS.find((item) => item.id === equippedWeapon) ?? null
    const equippedShieldItem = EQUIPMENT_ITEMS.find((item) => item.id === equippedShield) ?? null
    const equippedAccessoryItem = EQUIPMENT_ITEMS.find((item) => item.id === equippedAccessory) ?? null

    const toggleEquipItem = (itemId: string) => {
        const item = EQUIPMENT_ITEMS.find((i) => i.id === itemId)
        if (!item || xp < item.requiredXP) return

        setEquippedBySlot((current) => ({
            ...current,
            [item.slot]: current[item.slot] === itemId ? null : itemId,
        }))
    }

    return {
        equippedBySlot,
        unlockedItems,
        lockedItems,
        equippedWeapon: equippedWeaponItem,
        equippedShield: equippedShieldItem,
        equippedAccessory: equippedAccessoryItem,
        toggleEquipItem,
    }
}

export function useEquipmentTabs() {
    const [activeTab, setActiveTab] = useState<'unlocked' | 'shop'>('unlocked')
    const [activeCategory, setActiveCategory] = useState<EquipmentSlot>('weapon')

    return {
        activeTab,
        setActiveTab,
        activeCategory,
        setActiveCategory,
    }
}
