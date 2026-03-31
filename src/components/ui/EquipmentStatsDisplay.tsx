import type { EquipmentStatModifiers } from '@/game/equipmentStats'

interface EquipmentStatsDisplayProps {
    modifiers: EquipmentStatModifiers
}

/**
 * Component that visually displays the equipment stat modifiers
 * Shows how equipped items improve various gameplay stats
 */
export function EquipmentStatsDisplay({ modifiers }: EquipmentStatsDisplayProps) {
    const stats = [
        {
            icon: '⚔️',
            label: 'Damage',
            value: `${((modifiers.damageMultiplier - 1) * 100).toFixed(0)}%`,
            isPositive: modifiers.damageMultiplier > 1,
        },
        {
            icon: '🎯',
            label: 'Fire Rate',
            value: `${modifiers.shootCooldownReduction}ms`,
            isPositive: modifiers.shootCooldownReduction > 0,
        },
        {
            icon: '📏',
            label: 'Range',
            value: `+${modifiers.shootDistanceBonus}`,
            isPositive: modifiers.shootDistanceBonus > 0,
        },
        {
            icon: '🛡️',
            label: 'Defense',
            value: `${((1 - modifiers.defenseMultiplier) * 100).toFixed(0)}%`,
            isPositive: modifiers.defenseMultiplier < 1,
        },
        {
            icon: '💨',
            label: 'Speed',
            value: `${((modifiers.moveSpeedMultiplier - 1) * 100).toFixed(0)}%`,
            isPositive: modifiers.moveSpeedMultiplier > 1,
        },
        {
            icon: '⬆️',
            label: 'Jump',
            value: `${((modifiers.jumpBoostMultiplier - 1) * 100).toFixed(0)}%`,
            isPositive: modifiers.jumpBoostMultiplier > 1,
        },
        {
            icon: '💓',
            label: 'Health',
            value: `+${modifiers.healthBonus}`,
            isPositive: modifiers.healthBonus > 0,
        },
        {
            icon: '🎲',
            label: 'Evasion',
            value: `${(modifiers.evasionChance * 100).toFixed(0)}%`,
            isPositive: modifiers.evasionChance > 0,
        },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="relative group rounded-lg border border-[#00ffff]/20 bg-[#1a1a1a] p-3 flex flex-col items-center gap-1 hover:border-[#00ffff]/50 transition-all"
                >
                    <div className="text-2xl">{stat.icon}</div>
                    <p className="text-xs text-[#00ffff]/60 font-bold uppercase tracking-widest">
                        {stat.label}
                    </p>
                    <p
                        className={`text-sm font-bold ${stat.isPositive
                                ? 'text-[#00ff88]'
                                : stat.value.includes('0%')
                                    ? 'text-slate-400'
                                    : 'text-slate-200'
                            }`}
                    >
                        {stat.value}
                    </p>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 border border-[#00ffff]/30 rounded px-2 py-1 text-xs text-slate-300 whitespace-nowrap z-10">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    )
}
