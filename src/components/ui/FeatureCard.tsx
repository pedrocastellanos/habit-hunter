import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { HTMLProps } from 'react'

export interface FeatureCardProps extends HTMLProps<HTMLDivElement> {
    icon?: string | React.ReactNode
    title: string
    description: string
    accentColor?: 'cyan' | 'green' | 'purple'
    variant?: Variants
}

const accentMap = {
    cyan: {
        border: 'border-[#00ffff]',
        bg: 'bg-[#00ffff]/20',
        borderBg: 'border-[#00ffff]/40',
        text: 'text-[#00ffff]',
        line: 'bg-[#00ffff]',
    },
    green: {
        border: 'border-[#00ff88]',
        bg: 'bg-[#00ff88]/20',
        borderBg: 'border-[#00ff88]/40',
        text: 'text-[#00ff88]',
        line: 'bg-[#00ff88]',
    },
    purple: {
        border: 'border-[#8b5cf6]',
        bg: 'bg-[#8b5cf6]/20',
        borderBg: 'border-[#8b5cf6]/40',
        text: 'text-[#8b5cf6]',
        line: 'bg-[#8b5cf6]',
    },
}

export function FeatureCard({
    icon,
    title,
    description,
    accentColor = 'cyan',
    variant,
    style,
}: FeatureCardProps) {
    const accent = accentMap[accentColor]

    return (
        <motion.div
            className="p-8 group"
            style={style}
            variants={variant}
            initial="initial"
            whileHover="hover"
        >
            <div className={`size-14 ${accent.bg} flex items-center justify-center mb-6 rounded-sm border ${accent.borderBg}`}>
                {typeof icon === 'string' ? (
                    <span className="text-3xl">{icon}</span>
                ) : (
                    icon
                )}
            </div>
            <h3 className="text-xl font-black text-slate-100 mb-4 tracking-tighter uppercase" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {title}
            </h3>
            <p className="text-[#00ffff]/60 text-sm leading-relaxed mb-6">
                {description}
            </p>
            <motion.div
                className={`h-1 ${accent.line}`}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            />
        </motion.div>
    )
}
