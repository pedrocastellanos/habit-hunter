import { Link } from 'react-router-dom'
import { useGame } from '@/context/useGame'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { homeContainerVariants, homeFadeInUpVariants, homeScaleInVariants, homeCardHoverVariants } from '@/constants/animations'
import { StatusCard } from '@/components/ui/StatusCard'
import { FeatureCard } from '@/components/ui/FeatureCard'

export function HomePage() {
    const { t } = useTranslation()
    const {
        xp,
        level,
        levelProgress,
        completedTaskCount,
        tasks,
    } = useGame()

    const pendingCount = tasks.filter((task) => !task.completed).length
    const currentXp = xp % 100
    const nextLevelXp = 100
    const xpPercent = Math.round(levelProgress * 100)

    return (
        <motion.main
            className="flex-1 flex flex-col items-center"
            initial="hidden"
            animate="visible"
            variants={homeContainerVariants}
        >
            {/* Hero Section */}
            <motion.section
                className="w-full max-w-[1200px] px-6 py-16 md:py-24 flex flex-col items-center text-center gap-8"
                variants={homeFadeInUpVariants}
            >
                <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8b5cf6]/50 bg-[#8b5cf6]/10 text-[#8b5cf6] text-[10px] font-bold tracking-widest uppercase mb-4"
                    variants={homeScaleInVariants}
                >
                    <motion.span
                        className="size-2 rounded-full bg-[#8b5cf6]"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.7, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                    {t('home.systemOnline')}
                </motion.div>

                <motion.h1
                    className="text-slate-100 text-5xl md:text-8xl font-black leading-tight tracking-tighter uppercase"
                    style={{
                        fontFamily: 'Orbitron, sans-serif',
                        textShadow: '0 0 10px rgba(0, 255, 255, 0.7)'
                    }}
                    variants={homeFadeInUpVariants}
                >
                    HABIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#8b5cf6]">HUNTER</span>
                </motion.h1>

                <motion.p
                    className="max-w-2xl text-[#00ffff]/60 text-lg md:text-xl font-medium leading-relaxed"
                    variants={homeFadeInUpVariants}
                >
                    {t('home.heroDescription')}
                </motion.p>

                <motion.div
                    className="flex flex-wrap gap-4 mt-8 justify-center"
                    variants={homeFadeInUpVariants}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/tareas"
                            className="min-w-[200px] py-4 px-8 bg-[#00ffff] text-[#010409] font-black tracking-wider rounded-sm uppercase inline-block text-center"
                            style={{
                                fontFamily: 'Orbitron, sans-serif',
                                boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
                                border: '1px solid rgba(0, 255, 255, 0.5)'
                            }}
                        >
                            {t('home.configureTasks')}
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/personaje"
                            className="min-w-[200px] py-4 px-8 border border-[#8b5cf6]/50 text-[#8b5cf6] font-black tracking-wider rounded-sm uppercase inline-block text-center backdrop-blur-sm"
                            style={{
                                fontFamily: 'Orbitron, sans-serif',
                                background: 'rgba(139, 92, 246, 0.1)'
                            }}
                        >
                            {t('home.customizeOperator')}
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* HUD Status Section */}
            <motion.section
                className="w-full max-w-[1000px] px-6 py-12"
                variants={homeScaleInVariants}
            >
                <div
                    className="bg-[#030815]/40 border border-[#00ffff]/20 rounded-xl p-8 backdrop-blur-xl relative overflow-hidden"
                    style={{
                        backgroundImage: 'linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                >
                    <div className="absolute top-0 right-0 p-4">
                        <span
                            className="text-[10px] text-[#00ffff]/30 tracking-widest uppercase"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            HUD_STATUS_v04
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <h4
                                        className="text-[#00ffff] font-bold text-xs tracking-widest"
                                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                                    >
                                        {t('home.operatorEvolution')}
                                    </h4>
                                    <span
                                        className="text-[#00ffff] text-xs"
                                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                                    >
                                        LVL {level}
                                    </span>
                                </div>
                                <div className="h-4 bg-[#00ffff]/10 rounded-full border border-[#00ffff]/20 p-0.5 overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full bg-gradient-to-r from-[#00ffff] to-[#8b5cf6]"
                                        style={{
                                            width: `${xpPercent}%`,
                                            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
                                            border: '1px solid rgba(0, 255, 255, 0.5)'
                                        }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${xpPercent}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    />
                                </div>
                                <p
                                    className="text-[10px] text-[#00ffff]/50 mt-2 tracking-widest text-right uppercase"
                                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                                >
                                    {t('home.xpToNextSync', { currentXp, nextLevelXp })}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <StatusCard
                                    label={t('home.anomaliesHunted')}
                                    value={completedTaskCount}
                                    variant="primary"
                                />
                                <StatusCard
                                    label={t('home.activeMissions')}
                                    value={pendingCount}
                                    variant="secondary"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center relative">
                            <div className="size-48 rounded-full border-[10px] border-[#00ffff]/10 flex items-center justify-center relative">
                                <motion.div
                                    className="absolute inset-0 border-t-[10px] border-[#00ff88] rounded-full"
                                    style={{
                                        boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
                                        border: '1px solid rgba(0, 255, 255, 0.5)'
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'linear'
                                    }}
                                />
                                <div className="text-center z-10">
                                    <motion.div
                                        className="text-5xl mb-2"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            opacity: [0.7, 1, 0.7]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut'
                                        }}
                                    >
                                        🎯
                                    </motion.div>
                                    <p
                                        className="text-[#00ff88] text-[10px] font-black tracking-widest uppercase"
                                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                                    >
                                        {t('home.scanning')}
                                    </p>
                                </div>
                            </div>
                            <div
                                className="absolute -bottom-2 px-4 py-1 bg-[#010409] border border-[#00ff88]/50 text-[#00ff88] text-[10px]"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                ACTIVE_SYNC_ESTABLISHED
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Feature Cards Section */}
            <motion.section
                className="w-full max-w-[1200px] px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={homeContainerVariants}
            >
                <FeatureCard
                    icon="🔬"
                    title="Focus Scanner"
                    description="Advanced algorithmic detection of your active habits. Automatically tracks engagement and identifies environmental triggers."
                    accentColor="cyan"
                    variant={homeCardHoverVariants}
                    style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(8px)',
                        borderLeft: '2px solid #00ffff',
                        borderTop: '2px solid #8b5cf6'
                    }}
                />

                <FeatureCard
                    icon="⚡"
                    title="Execution Pulse"
                    description="Real-time reward circuitry providing immediate neuro-feedback as you neutralize tasks. Feel the surge of synthetic dopamine."
                    accentColor="green"
                    variant={homeCardHoverVariants}
                    style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(8px)',
                        borderLeft: '2px solid #00ff88',
                        borderTop: '2px solid #00ff88'
                    }}
                />

                <FeatureCard
                    icon="📡"
                    title="Operator Evolution"
                    description="Progress through the ranks, unlock encrypted gear, and specialize your operator class to master specific life domains."
                    accentColor="purple"
                    variant={homeCardHoverVariants}
                    style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(8px)',
                        borderLeft: '2px solid #8b5cf6',
                        borderTop: '2px solid #8b5cf6'
                    }}
                />
            </motion.section>

            {/* Initialize Sequence Section */}
            <motion.section
                className="w-full px-6 py-24 border-y border-[#00ffff]/10"
                style={{
                    background: 'rgba(0, 255, 255, 0.05)'
                }}
                variants={homeFadeInUpVariants}
            >
                <div className="max-w-[1200px] mx-auto">
                    <h2
                        className="text-3xl md:text-4xl font-black text-slate-100 text-center mb-16 tracking-widest uppercase"
                        style={{
                            fontFamily: 'Orbitron, sans-serif',
                            textShadow: '0 0 10px rgba(0, 255, 255, 0.7)'
                        }}
                    >
                        INITIALIZE_SEQUENCE
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <motion.div
                            className="relative flex flex-col items-center text-center"
                            variants={homeFadeInUpVariants}
                        >
                            <div
                                className="text-8xl font-black text-[#00ffff]/10 absolute -top-10 left-1/2 -translate-x-1/2"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                01
                            </div>
                            <div className="size-16 rounded-full border border-[#00ffff]/50 bg-[#010409] flex items-center justify-center z-10 mb-6">
                                <span className="text-2xl">💻</span>
                            </div>
                            <h4
                                className="text-[#00ffff] font-bold mb-2 tracking-widest"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                MAP PROTOCOLS
                            </h4>
                            <p className="text-[#00ffff]/50 text-sm">
                                Define your habits as targets in the simulation.
                            </p>
                        </motion.div>

                        <motion.div
                            className="relative flex flex-col items-center text-center"
                            variants={homeFadeInUpVariants}
                        >
                            <div
                                className="text-8xl font-black text-[#8b5cf6]/10 absolute -top-10 left-1/2 -translate-x-1/2"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                02
                            </div>
                            <div className="size-16 rounded-full border border-[#8b5cf6]/50 bg-[#010409] flex items-center justify-center z-10 mb-6">
                                <span className="text-2xl">⚔️</span>
                            </div>
                            <h4
                                className="text-[#8b5cf6] font-bold mb-2 tracking-widest"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                EXECUTE HUNT
                            </h4>
                            <p className="text-[#00ffff]/50 text-sm">
                                Track your progress and eliminate daily tasks.
                            </p>
                        </motion.div>

                        <motion.div
                            className="relative flex flex-col items-center text-center"
                            variants={homeFadeInUpVariants}
                        >
                            <div
                                className="text-8xl font-black text-[#00ff88]/10 absolute -top-10 left-1/2 -translate-x-1/2"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                03
                            </div>
                            <div className="size-16 rounded-full border border-[#00ff88]/50 bg-[#010409] flex items-center justify-center z-10 mb-6">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <h4
                                className="text-[#00ff88] font-bold mb-2 tracking-widest"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                ASCEND
                            </h4>
                            <p className="text-[#00ffff]/50 text-sm">
                                Level up and customize your operator dashboard.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Launch Mission CTA */}
            <motion.section
                className="w-full max-w-[1200px] px-6 py-16 text-center"
                variants={homeFadeInUpVariants}
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        boxShadow: [
                            '0 0 0px rgba(0, 255, 255, 0)',
                            '0 0 30px rgba(0, 255, 255, 0.5)',
                            '0 0 0px rgba(0, 255, 255, 0)',
                        ],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="inline-block"
                >
                    <Link
                        to="/arena"
                        className="min-w-[250px] py-5 px-12 bg-[#00ffff] text-[#010409] font-black tracking-wider rounded-sm uppercase inline-block text-center text-xl"
                        style={{
                            fontFamily: 'Orbitron, sans-serif',
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                            border: '2px solid rgba(0, 255, 255, 0.8)'
                        }}
                    >
                        🚀 LAUNCH MISSION
                    </Link>
                </motion.div>
            </motion.section>
        </motion.main>
    )
}
