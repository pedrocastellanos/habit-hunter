import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { EquipmentItem } from '@/constants/character'
import { SLOT_ICON } from '@/constants/character'

export interface EquipmentItemCardProps {
    item: EquipmentItem
    isEquipped: boolean
    isLocked: boolean
    onToggleEquip: (item: EquipmentItem) => void
}

export function EquipmentItemCard({
    item,
    isEquipped,
    isLocked,
    onToggleEquip,
}: EquipmentItemCardProps) {
    const { t } = useTranslation()

    return (
        <motion.div
            className={`border rounded-lg p-3 flex gap-4 transition-colors ${isLocked
                ? 'bg-[#273a3a]/20 border-slate-800/50 grayscale'
                : 'bg-[#273a3a]/40 border-slate-700 hover:border-[#00ffff]/40'
                }`}
            whileHover={!isLocked ? { y: -2 } : {}}
        >
            <div className={`size-16 shrink-0 rounded-lg flex items-center justify-center border relative ${isLocked
                ? 'bg-[#1a1a1a]/50 border-slate-800'
                : 'bg-[#1a1a1a] border-slate-700'
                }`}>
                <span className={`material-symbols-outlined text-3xl ${isLocked ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                    {SLOT_ICON[item.slot]}
                </span>
                {isLocked && (
                    <div className="absolute inset-0 bg-[#0a0a0a]/60 flex items-center justify-center rounded-lg">
                        <span className="material-symbols-outlined text-slate-400 text-xl">lock</span>
                    </div>
                )}
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h5 className={`font-bold text-sm ${isLocked ? 'text-slate-500' : 'text-slate-100'}`}>
                        {item.name}
                    </h5>
                    {isEquipped && (
                        <span className="text-[10px] text-[#00ffff] bg-[#00ffff]/10 px-2 py-0.5 rounded border border-[#00ffff]/30">
                            {t('character.equipped')}
                        </span>
                    )}
                    {isLocked && (
                        <span className="text-[10px] text-[#00ffff]/60 font-bold">
                            {item.requiredXP} XP
                        </span>
                    )}
                </div>

                <p className={`text-xs mt-1 ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t('character.tierEquipment', {
                        slot: t(`character.slotName.${item.slot}`),
                    })}
                </p>

                {!isLocked ? (
                    <button
                        onClick={() => onToggleEquip(item)}
                        className={`mt-2 w-full py-1.5 text-[10px] uppercase font-bold tracking-widest rounded transition-all ${isEquipped
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/30 hover:bg-[#00ffff] hover:text-[#0a0a0a]'
                            }`}
                    >
                        {isEquipped ? t('character.unequip') : t('character.equipItem')}
                    </button>
                ) : (
                    <button
                        disabled
                        className="mt-2 w-full py-1.5 text-[10px] uppercase font-bold tracking-widest rounded flex items-center justify-center gap-1 bg-[#273a3a] text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        {t('character.insufficientXp')}
                    </button>
                )}
            </div>
        </motion.div>
    )
}
