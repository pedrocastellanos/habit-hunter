import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ROAMER_SPAWN_INTERVAL, ROAMER_MAX_COUNT, ROAMER_SPAWN_INNER_RADIUS, ROAMER_SPAWN_OUTER_RADIUS, SHOT_LIFETIME_MS, MOUSE_SENSITIVITY_X, MOUSE_SENSITIVITY_Y, MAX_PITCH_ANGLE, ARENA_CANVAS_SELECTOR } from '@/constants/arena'
import type { EnergyShot, RoamingEnemyData, XpPopupData } from '@/types/arena'

export function useArenaMovement() {
    const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0.7, 0])
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const activeKeys = useRef<Record<string, boolean>>({})
    const elapsedSecondsRef = useRef(0)
    const lastTickRef = useRef<number | null>(null)
    const verticalVelocityRef = useRef(0)
    const isGroundedRef = useRef(true)
    const wasSpacePressedRef = useRef(false)

    const cameraYawRef = useRef(0)
    const cameraPitchRef = useRef(0)

    // Keyboard input setup
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                event.preventDefault()
            }
            activeKeys.current[event.key.toLowerCase()] = true
            activeKeys.current[event.code.toLowerCase()] = true
        }
        const onKeyUp = (event: KeyboardEvent) => {
            activeKeys.current[event.key.toLowerCase()] = false
            activeKeys.current[event.code.toLowerCase()] = false
        }

        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
        }
    }, [])

    return {
        playerPosition,
        setPlayerPosition,
        elapsedSeconds,
        setElapsedSeconds,
        activeKeys,
        elapsedSecondsRef,
        lastTickRef,
        verticalVelocityRef,
        isGroundedRef,
        wasSpacePressedRef,
        cameraYawRef,
        cameraPitchRef,
    }
}

export function useArenaMouse() {
    const [cameraYaw, setCameraYaw] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const arenaCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const arenaRootRef = useRef<HTMLElement | null>(null)
    const cameraYawRef = useRef(0)
    const cameraPitchRef = useRef(0)

    const requestPointerLock = useCallback(() => {
        const canvas = arenaCanvasRef.current ?? document.querySelector<HTMLCanvasElement>(ARENA_CANVAS_SELECTOR)
        if (!canvas) return
        arenaCanvasRef.current = canvas
        canvas.requestPointerLock()
    }, [])

    useEffect(() => {
        const onFullscreenChange = () => {
            const fullscreen = document.fullscreenElement === arenaRootRef.current
            setIsFullscreen(fullscreen)
            document.body.classList.toggle('arena-fullscreen-active', fullscreen)
            if (fullscreen) {
                requestPointerLock()
            }
        }
        const onMouseMove = (event: MouseEvent) => {
            if (document.pointerLockElement !== arenaCanvasRef.current) return
            cameraYawRef.current -= event.movementX * MOUSE_SENSITIVITY_X
            setCameraYaw(cameraYawRef.current)
            cameraPitchRef.current = THREE.MathUtils.clamp(
                cameraPitchRef.current - event.movementY * MOUSE_SENSITIVITY_Y,
                -MAX_PITCH_ANGLE,
                MAX_PITCH_ANGLE,
            )
        }

        document.addEventListener('fullscreenchange', onFullscreenChange)
        window.addEventListener('mousemove', onMouseMove)

        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange)
            window.removeEventListener('mousemove', onMouseMove)
            document.body.classList.remove('arena-fullscreen-active')
        }
    }, [requestPointerLock])

    // Escape key to exit fullscreen
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return
            if (document.fullscreenElement === arenaRootRef.current) {
                void document.exitFullscreen()
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    return {
        cameraYaw,
        isFullscreen,
        arenaCanvasRef,
        arenaRootRef,
        cameraYawRef,
        cameraPitchRef,
        requestPointerLock,
    }
}

export function useRoamingEnemies() {
    const [roamingEnemies, setRoamingEnemies] = useState<RoamingEnemyData[]>([])
    const roamerLastShotRef = useRef<Record<string, number>>({})

    // Spawn roaming enemies at intervals
    useEffect(() => {
        const interval = setInterval(() => {
            setRoamingEnemies((current) => {
                if (current.length >= ROAMER_MAX_COUNT) return current

                const angle = Math.random() * Math.PI * 2
                const radius = ROAMER_SPAWN_INNER_RADIUS + Math.random() * (ROAMER_SPAWN_OUTER_RADIUS - ROAMER_SPAWN_INNER_RADIUS)
                const x = Number((Math.cos(angle) * radius).toFixed(2))
                const z = Number((Math.sin(angle) * radius).toFixed(2))

                const newEnemy: RoamingEnemyData = {
                    id: `roamer-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    position: [x, 1.1, z],
                    health: 2,
                }
                return [...current, newEnemy]
            })
        }, ROAMER_SPAWN_INTERVAL)

        return () => clearInterval(interval)
    }, [])

    return { roamingEnemies, setRoamingEnemies, roamerLastShotRef }
}

export function useEnergyShots() {
    const [shots, setShots] = useState<EnergyShot[]>([])

    const addShot = useCallback((shot: EnergyShot) => {
        setShots((current) => [...current, shot])
        window.setTimeout(() => {
            setShots((current) => current.filter((s) => s.id !== shot.id))
        }, SHOT_LIFETIME_MS)
    }, [])

    return { shots, setShots, addShot }
}

export function useXpPopups() {
    const [xpPopups, setXpPopups] = useState<XpPopupData[]>([])

    const addPopup = useCallback((popup: Omit<XpPopupData, 'id'>) => {
        const id = `popup-${Date.now()}-${Math.random()}`
        const newPopup: XpPopupData = { ...popup, id }
        setXpPopups((current) => [...current, newPopup])
        window.setTimeout(() => {
            setXpPopups((current) => current.filter((p) => p.id !== id))
        }, 1000)
    }, [])

    return { xpPopups, setXpPopups, addPopup }
}

export function useArenaRaycast() {
    const shotRaycasterRef = useRef(new THREE.Raycaster())
    const enemyObjectsRef = useRef(new Map<string, THREE.Object3D>())
    const deadEntitiesRef = useRef(new Set<string>())

    const handleEnemyObjectReady = useCallback((taskId: string, object: THREE.Object3D | null) => {
        if (object) {
            enemyObjectsRef.current.set(taskId, object)
            return
        }
        enemyObjectsRef.current.delete(taskId)
    }, [])

    return {
        shotRaycasterRef,
        enemyObjectsRef,
        deadEntitiesRef,
        handleEnemyObjectReady,
    }
}
