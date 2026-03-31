import { useTranslation } from 'react-i18next'
import type { EquipmentItem } from '@/constants/character'
import { SLOT_ICON } from '@/constants/character'

export interface EquipmentSlotDisplayProps {
    item: EquipmentItem | null
    slotType: 'weapon' | 'shield' | 'accessory'
    onToggle: (item: EquipmentItem) => void
    onSelectTab: (slot: 'weapon' | 'shield' | 'accessory') => void
    isFilled: boolean
}

export function EquipmentSlotDisplay({
    item,
    slotType,
    onToggle,
    onSelectTab,
    isFilled,
}: EquipmentSlotDisplayProps) {
    const { t } = useTranslation()

    const slotLabelKey = `character.${slotType}Slot`

    if (isFilled && item) {
        return (
            <>
                <div className="absolute -inset-1 bg-[#00ffff]/20 blur-md rounded-xl group-hover:bg-[#00ffff]/40 transition-all"></div>
                <div className="relative flex items-center gap-6 p-4 rounded-xl border-2 border-[#00ffff]/50 bg-[#1a1a1a]" style={{ boxShadow: '0 0 25px rgba(0, 255, 255, 0.5)' }}>
                    <div className="w-20 h-20 bg-[#273a3a] rounded-lg flex items-center justify-center border border-[#00ffff]/30">
                        <span className="material-symbols-outlined text-[#00ffff] text-5xl">{SLOT_ICON[slotType]}</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-[#00ffff]/60 uppercase font-bold mb-1">{t(slotLabelKey)}</p>
                        <h4 className="text-slate-100 text-xl font-bold tracking-wide">{item.name}</h4>
                        <p className="text-slate-400 text-xs italic">{t('character.requiredXp', { xp: item.requiredXP })}</p>
                    </div>
                    <button onClick={() => onToggle(item)} className="material-symbols-outlined text-[#00ffff]/40 hover:text-[#00ffff] transition-colors">
                        close
                    </button>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="absolute -inset-1 bg-slate-800/50 blur-sm rounded-xl group-hover:bg-[#00ffff]/20 transition-all"></div>
            <div
                className="relative flex items-center gap-6 p-4 rounded-xl border-2 border-dashed border-slate-700 bg-[#1a1a1a]/50 hover:border-[#00ffff]/50 transition-all cursor-pointer"
                onClick={() => onSelectTab(slotType)}
            >
                <div className="w-20 h-20 bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700 group-hover:border-[#00ffff]/30">
                    <span className="material-symbols-outlined text-slate-600 group-hover:text-[#00ffff] text-4xl">{SLOT_ICON[slotType]}</span>
                </div>
                <div className="flex-1">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">{t(slotLabelKey)}</p>
                    <h4 className="text-slate-500 group-hover:text-[#00ffff]/80 text-xl font-bold tracking-wide italic">{t('character.emptySlot')}</h4>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-[#00ffff]">add_circle</span>
            </div>
        </>
    )
}
