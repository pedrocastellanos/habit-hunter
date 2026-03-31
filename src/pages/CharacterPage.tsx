import { useTranslation } from 'react-i18next'
import type { EquipmentItem } from '@/constants/character'
import { useEquipmentManagement, useEquipmentTabs } from '@/hooks/useEquipment'
import { CharacterSelector } from '@/components/ui/CharacterSelector'
import { EquipmentSlotDisplay } from '@/components/ui/EquipmentSlotDisplay'
import { EquipmentItemCard } from '@/components/ui/EquipmentItemCard'
import { useGame } from '@/context/useGame'
import { getCharacterArtworkPath } from '@/utils/characterArtwork'

export function CharacterPage() {
    const { t } = useTranslation()
    const { characters, selectedCharacter, selectCharacter, level, xp } = useGame()

    const selectedCharacterRole = t(`character.profile.${selectedCharacter.id}.role`, {
        defaultValue: selectedCharacter.role,
    })
    const selectedCharacterDescription = t(`character.profile.${selectedCharacter.id}.description`, {
        defaultValue: selectedCharacter.description,
    })

    const { activeTab, setActiveTab, activeCategory, setActiveCategory } = useEquipmentTabs()
    const {
        unlockedItems,
        lockedItems,
        equippedWeapon,
        equippedShield,
        equippedAccessory,
        toggleEquipItem,
    } = useEquipmentManagement(xp)

    const sourceItems = activeTab === 'unlocked' ? unlockedItems : lockedItems
    const displayItems = sourceItems.filter((item) => item.slot === activeCategory)

    // Adapter function to convert EquipmentItem to itemId for toggleEquipItem
    const handleToggleEquip = (item: EquipmentItem) => {
        toggleEquipItem(item.id)
    }

    return (
        <main className="flex-1 p-6 md:p-10 flex flex-col lg:flex-row gap-8 min-h-screen bg-[#0a0a0a]">
            {/* Left Section: Character Preview */}
            <section className="w-full lg:w-[30%] flex flex-col gap-4">
                <div className="flex flex-col mb-4">
                    <h1 className="text-slate-100 text-3xl font-bold leading-tight uppercase tracking-widest" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.6)' }}>
                        {t('character.hunterProfile')}
                    </h1>
                    <p className="text-[#00ffff]/70 text-sm font-medium tracking-widest uppercase">
                        {t('character.levelRole', { level, role: selectedCharacterRole })}
                    </p>
                </div>

                <div className="relative flex-1 min-h-125 rounded-xl border border-[#00ffff]/20 bg-[#1a1a1a] overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>

                    {/* Character Display */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center space-y-4">
                            {/* Character Artwork or Placeholder */}
                            {(() => {
                                const artworkPath = getCharacterArtworkPath(selectedCharacter.id)
                                if (artworkPath) {
                                    return (
                                        <div className="w-80 h-full mx-auto flex items-center justify-center">
                                            <img
                                                src={artworkPath}
                                                alt={selectedCharacter.name}
                                                className="w-auto h-80 drop-shadow-2xl"
                                                style={{
                                                    filter: `drop-shadow(0 0 30px ${selectedCharacter.accent}50)`,
                                                }}
                                            />
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className="w-48 h-48 mx-auto rounded-full border-4 border-[#00ffff]/40 bg-[#00ffff]/10 flex items-center justify-center" style={{ boxShadow: '0 0 25px rgba(0, 255, 255, 0.5)' }}>
                                            <span className="material-symbols-outlined text-[#00ffff] text-8xl">person</span>
                                        </div>
                                    )
                                }
                            })()}
                            <h2 className="text-3xl font-bold text-slate-100">{selectedCharacter.name}</h2>
                            <p className="text-slate-400 text-base">{selectedCharacterDescription}</p>
                        </div>
                    </div>

                    {/* Overlay Stats */}
                    <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-3">
                        <div className="flex justify-between items-end">
                            <div className="flex-1">
                                <p className="text-xs text-[#00ffff]/60 uppercase font-bold">{t('character.experience')}</p>
                                <div className="w-full h-2 bg-slate-800 rounded-full mt-1 overflow-hidden border border-slate-700">
                                    <div className="h-full bg-[#00ffff]" style={{ width: `${(xp % 1000) / 10}%`, boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}></div>
                                </div>
                            </div>
                            <span className="text-[#00ffff] font-bold ml-4">{xp} XP</span>
                        </div>
                    </div>
                </div>

                <CharacterSelector
                    characters={characters}
                    selectedId={selectedCharacter.id}
                    onSelect={selectCharacter}
                />
            </section>

            {/* Center Section: Equipment Slots */}
            <section className="w-full lg:w-[40%] flex flex-col items-center gap-12">
                <div className="flex flex-col mb-4 w-full items-center">
                    <h1 className="text-slate-100 text-3xl font-bold leading-tight uppercase tracking-widest text-center" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.6)' }}>
                        {t('character.loadout')}
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-10 w-full max-w-md">
                    {/* Weapon Slot */}
                    <div className="relative group cursor-pointer w-full">
                        <EquipmentSlotDisplay
                            item={equippedWeapon}
                            slotType="weapon"
                            isFilled={!!equippedWeapon}
                            onToggle={handleToggleEquip}
                            onSelectTab={setActiveCategory}
                        />
                    </div>

                    {/* Shield Slot */}
                    <div className="relative group cursor-pointer w-full">
                        <EquipmentSlotDisplay
                            item={equippedShield}
                            slotType="shield"
                            isFilled={!!equippedShield}
                            onToggle={handleToggleEquip}
                            onSelectTab={setActiveCategory}
                        />
                    </div>

                    {/* Accessory Slot */}
                    <div className="relative group cursor-pointer w-full">
                        <EquipmentSlotDisplay
                            item={equippedAccessory}
                            slotType="accessory"
                            isFilled={!!equippedAccessory}
                            onToggle={handleToggleEquip}
                            onSelectTab={setActiveCategory}
                        />
                    </div>
                </div>

            </section>

            {/* Right Section: Inventory & Shop Tabs */}
            <section className="w-full lg:w-[30%] flex flex-col gap-6">
                <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 border border-[#273a3a]">
                    <button
                        onClick={() => setActiveTab('unlocked')}
                        className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'unlocked'
                            ? 'bg-[#00ffff] text-[#0a0a0a]'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {t('character.unlockedTab')}
                    </button>
                    <button
                        onClick={() => setActiveTab('shop')}
                        className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'shop'
                            ? 'bg-[#00ffff] text-[#0a0a0a]'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {t('character.shopTab')}
                    </button>
                </div>

                {/* Items Grid */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[700px]">
                    {displayItems.length === 0 && (
                        <div className="rounded-lg border border-slate-700 bg-[#1a1a1a] p-4 text-center text-sm text-slate-400">
                            {t('character.noItemsInTabForCategory', {
                                tab: activeTab === 'unlocked' ? t('character.unlockedTab') : t('character.shopTab'),
                                category: t(`character.category.${activeCategory}`),
                            })}
                        </div>
                    )}
                    {displayItems.map((item) => {
                        const isEquipped = activeTab === 'unlocked' && displayItems.some(i => i.id === item.id && (
                            (item.slot === 'weapon' && equippedWeapon?.id === item.id) ||
                            (item.slot === 'shield' && equippedShield?.id === item.id) ||
                            (item.slot === 'accessory' && equippedAccessory?.id === item.id)
                        ))
                        const isLocked = xp < item.requiredXP

                        return (
                            <EquipmentItemCard
                                key={item.id}
                                item={item}
                                isEquipped={isEquipped}
                                isLocked={isLocked}
                                onToggleEquip={handleToggleEquip}
                            />
                        )
                    })}
                </div>
            </section>
        </main>
    )
}
