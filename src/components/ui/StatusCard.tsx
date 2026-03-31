import { motion } from 'framer-motion'

export interface StatusCardProps {
    label: string
    value: string | number
    icon?: string
    isAnimated?: boolean
    variant?: 'primary' | 'secondary'
    className?: string
}

export function StatusCard({
    label,
    value,
    variant = 'primary',
    className,
}: StatusCardProps) {
    const variants = {
        primary: 'bg-[#00ffff]/5 border-[#00ffff]/10 hover:border-[#00ffff]/30',
        secondary: 'bg-[#8b5cf6]/5 border-[#8b5cf6]/10 hover:border-[#8b5cf6]/30',
    }

    const textColors = {
        primary: 'text-[#00ffff]/60',
        secondary: 'text-[#8b5cf6]/60',
    }

    return (
        <motion.div
            className={`border p-4 rounded transition-all ${variants[variant]} ${className || ''}`}
            whileHover={{ scale: 1.05 }}
        >
            <p className={`text-[10px] tracking-widest uppercase mb-1 font-medium ${textColors[variant]}`}>
                {label}
            </p>
            <p className="text-2xl font-black text-slate-100">
                {value}
            </p>
        </motion.div>
    )
}
