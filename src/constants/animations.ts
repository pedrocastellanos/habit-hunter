import { type Variants } from 'framer-motion'

// Arena Page
export const arenaPageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
}

export const arenaFadeInVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: 'easeOut',
        },
    },
}

// Tasks Page
export const tasksPageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.08,
        },
    },
}

export const tasksFadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: 'easeOut',
        },
    },
}

export const tasksCardVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: 'easeOut',
        },
    },
}

// Home Page
export const homeContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
}

export const homeFadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
}

export const homeScaleInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
}

export const homeCardHoverVariants: Variants = {
    initial: { y: 0 },
    hover: {
        y: -8,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
}
