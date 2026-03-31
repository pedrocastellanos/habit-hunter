import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type MutableRefObject,
} from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useGame } from '@/context/useGame'
import { useAdjustedGameStats } from '@/hooks/useAdjustedGameStats'
import type { Task } from '@/game/types'
import { getAttackDistanceMultiplier } from '@/game/catalog'
import { EnhancedPlayer } from '@/components/EnhancedPlayer'
import { EnhancedEnemy } from '@/components/EnhancedEnemy'
import { EnhancedEnvironment } from '@/components/EnhancedEnvironment'
import { DynamicObstacles } from '@/components/DynamicObstacles'
import { useTranslation } from 'react-i18next'
import shootSoundUrl from '@/assets/sounds/shoot.mp3'
import explosionSoundUrl from '@/assets/sounds/explosion.mp3'
import {
    GRAVITY,
    GROUND_LEVEL,
    CLAMP,
    MAX_SHOT_DISTANCE,
    SHOT_LIFETIME_MS,
    MOUSE_SENSITIVITY_X,
    MOUSE_SENSITIVITY_Y,
    MAX_PITCH_ANGLE,
    ARENA_CANVAS_SELECTOR,
    ROAMER_ATTACK_DISTANCE,
    PRIORITY_HEALTH,
} from '@/constants/arena'
import type { EnergyShot, RoamingEnemyData, XpPopupData, HealthItemData } from '@/types/arena'
import { arenaPageVariants, arenaFadeInVariants } from '@/constants/animations'
import { getCameraPosition, getShotStart, computeEnemyPosition, avoidObstacleCollision, computeShotArcDrop, generateMinimapData } from '@/utils/arena'
import { PulseBeam } from '@/components/arena/PulseBeam'
import { XpPopupEffect } from '@/components/arena/XpPopupEffect'
import { HealthItem } from '@/components/arena/HealthItem'
import { ArenaMinimap } from '@/components/arena/ArenaMinimap'

export function ArenaPage() {
    const { t } = useTranslation()
    const { tasks, xp, level, completeTask, completedTaskCount, addXp, playerState, damagePlayer, healPlayer, respawnPlayer, equipmentModifiers } = useGame()

    // Obtener estadísticas alteradas por el equipamiento (movimiento, daño, evasión, salto, etc.)
    const adjustedStats = useAdjustedGameStats(equipmentModifiers)

    const [shots, setShots] = useState<EnergyShot[]>([])
    const [healthItems, setHealthItems] = useState<HealthItemData[]>([])
    const [taskDamageTaken, setTaskDamageTaken] = useState<Record<string, number>>({}) // Trackear daño en lugar de salud
    const [roamingEnemies, setRoamingEnemies] = useState<RoamingEnemyData[]>([])
    const [xpPopups, setXpPopups] = useState<XpPopupData[]>([])
    const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0.7, 0])
    const [targetedEnemyId, setTargetedEnemyId] = useState<string | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [cameraYaw, setCameraYaw] = useState(0)
    const activeKeys = useRef<Record<string, boolean>>({})
    const elapsedSecondsRef = useRef(0)
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const arenaCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const arenaRootRef = useRef<HTMLElement | null>(null)
    const enemyObjectsRef = useRef(new Map<string, THREE.Object3D>())
    const deadEntitiesRef = useRef(new Set<string>())
    const shotRaycasterRef = useRef(new THREE.Raycaster())
    const cameraYawRef = useRef(0)
    const cameraPitchRef = useRef(0)
    const verticalVelocityRef = useRef(0)
    const isGroundedRef = useRef(true)
    const wasSpacePressedRef = useRef(false)
    const shootAudioRef = useRef<HTMLAudioElement | null>(null)
    const roamerLastShotRef = useRef<Record<string, number>>({})
    const playerRespawnTimeRef = useRef<number | null>(null)
    const damagingShotsRef = useRef(new Set<string>())  // Disparos que ya han hecho daño
    const playerStateRef = useRef(playerState)  // Mantener referencia actualizada
    const healthItemsRef = useRef(healthItems)
    const shotsRef = useRef(shots)
    const playerPositionRef = useRef(playerPosition)
    const adjustedStatsRef = useRef(adjustedStats)
    const levelRef = useRef(level)
    const lastHudSyncRef = useRef(0)
    const lastTargetRaycastRef = useRef(0)

    const maxStamina = useMemo(() => 100 + (level - 1) * 20, [level])
    const [stamina, setStamina] = useState(maxStamina)
    const [canSprint, setCanSprint] = useState(true)
    const staminaRef = useRef(maxStamina)
    const canSprintRef = useRef(true)
    const canSprintUiRef = useRef(canSprint)

    useEffect(() => {
        if (staminaRef.current > maxStamina) {
            staminaRef.current = maxStamina
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStamina((prev) => Math.min(prev, maxStamina))
    }, [maxStamina])

    useEffect(() => { healthItemsRef.current = healthItems }, [healthItems])
    useEffect(() => { shotsRef.current = shots }, [shots])
    useEffect(() => { playerPositionRef.current = playerPosition }, [playerPosition])
    useEffect(() => { adjustedStatsRef.current = adjustedStats }, [adjustedStats])
    useEffect(() => { levelRef.current = level }, [level])
    useEffect(() => { canSprintUiRef.current = canSprint }, [canSprint])

    useEffect(() => {
        const audio = new Audio(shootSoundUrl)
        audio.volume = 0.5
        shootAudioRef.current = audio
        return () => {
            audio.pause()
            shootAudioRef.current = null
        }
    }, [])

    // Mantener playerStateRef actualizado
    useEffect(() => {
        playerStateRef.current = playerState
    }, [playerState])

    const [respawnCountdown, setRespawnCountdown] = useState(0)
    const respawnTriggeredRef = useRef(false)

    // Reset countdown cuando el jugador no está muerto
    // Note: setRespawnCountdown is safe here because it's guarded by !playerState.isDead
    // which prevents cascading renders. The dependency array ensures this only runs when
    // the dead state changes.
    useEffect(() => {
        if (!playerState.isDead) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRespawnCountdown(0)
            playerRespawnTimeRef.current = null
            respawnTriggeredRef.current = false
            damagingShotsRef.current.clear()
        }
    }, [playerState.isDead])

    // Manejar respawn del jugador después del cooldown
    useEffect(() => {
        const state = playerStateRef.current

        if (!state.isDead) {
            return
        }

        // Jugador muerto: iniciar o continuar el cooldown
        if (!playerRespawnTimeRef.current) {
            playerRespawnTimeRef.current = Date.now()
            respawnTriggeredRef.current = false
        }

        // Función que actualiza el countdown
        const updateCountdown = () => {
            const currentState = playerStateRef.current

            if (!playerRespawnTimeRef.current || !currentState.isDead) return

            const elapsed = Date.now() - playerRespawnTimeRef.current
            const remaining = currentState.respawnCooldownMs - elapsed
            const seconds = Math.max(0, Math.ceil(remaining / 1000))

            setRespawnCountdown(seconds)

            // Si el tiempo se acabó y player aún está muerto, resucitar
            if (elapsed >= currentState.respawnCooldownMs && !respawnTriggeredRef.current) {
                respawnTriggeredRef.current = true
                respawnPlayer()
            }
        }

        // Actualizar inmediatamente
        updateCountdown()

        // Y luego cada 100ms
        const interval = setInterval(updateCountdown, 100)
        return () => clearInterval(interval)
    }, [respawnPlayer, playerState.isDead])

    // Función auxiliar para calcular posición interpolada del disparo
    const calculateShotPosition = (shot: EnergyShot, currentTime: number): [number, number, number] => {
        const elapsedTime = currentTime - shot.createdAt
        const progress = Math.min(elapsedTime / 260, 1) // 260ms es SHOT_LIFETIME_MS

        const [sx, sy, sz] = shot.start
        const [ex, ey, ez] = shot.end

        const x = sx + (ex - sx) * progress
        const y = sy + (ey - sy) * progress - shot.arcDrop * progress * (1 - progress) * 4
        const z = sz + (ez - sz) * progress

        return [x, y, z]
    }

    // Detectar colisión entre disparo y jugador (radio de colisión = 0.5)
    const checkShotPlayerCollision = useCallback(
        (shotPos: [number, number, number]): boolean => {
            const [px, py, pz] = playerPositionRef.current
            const dx = shotPos[0] - px
            const dy = shotPos[1] - py
            const dz = shotPos[2] - pz
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
            return distance < 0.5
        },
        [],
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setRoamingEnemies((current) => {
                if (current.length >= 15) return current // Límite de enemigos en el mundo

                const angle = Math.random() * Math.PI * 2
                // Aparecen en algún lugar entre radio 15 y 35
                const radius = 15 + Math.random() * 20
                const x = Number((Math.cos(angle) * radius).toFixed(2))
                const z = Number((Math.sin(angle) * radius).toFixed(2))

                const levelHealthMultiplier = 1 + (Math.max(0, level - 1) * 0.2)

                const newEnemy: RoamingEnemyData = {
                    id: `roamer-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    position: [x, 1.1, z],
                    health: Math.ceil(2 * levelHealthMultiplier)
                }
                return [...current, newEnemy]
            })
        }, 3500)

        return () => clearInterval(interval)
    }, [level])

    useEffect(() => {
        const interval = setInterval(() => {
            setHealthItems((current) => {
                if (current.length >= 5) return current // Límite de items de vida

                const angle = Math.random() * Math.PI * 2
                const radius = 5 + Math.random() * 25
                const x = Number((Math.cos(angle) * radius).toFixed(2))
                const z = Number((Math.sin(angle) * radius).toFixed(2))

                const newItem: HealthItemData = {
                    id: `health-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    position: [x, 0.5, z],
                    amount: 1 // Cura 1 HP por item
                }
                return [...current, newItem]
            })
        }, 12000)

        return () => clearInterval(interval)
    }, [])

    const activeTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks])

    const enemyPositions = useMemo(() => {
        return new Map(activeTasks.map((task, index) => [task.id, computeEnemyPosition(task.id, index)]))
    }, [activeTasks])

    const minimapData = useMemo(() => {
        return generateMinimapData(playerPosition, activeTasks, roamingEnemies, enemyPositions, elapsedSeconds)
    }, [playerPosition, activeTasks, roamingEnemies, enemyPositions, elapsedSeconds])

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

    const gameTick = useCallback((deltaSecondsRaw: number) => {
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
        const deltaSeconds = Math.max(0.001, Math.min(deltaSecondsRaw, 0.05))

        elapsedSecondsRef.current += deltaSeconds
        const shouldSyncHud = now - lastHudSyncRef.current >= 100
        if (shouldSyncHud) {
            lastHudSyncRef.current = now
            setElapsedSeconds(elapsedSecondsRef.current)
        }

        const currentAdjustedStats = adjustedStatsRef.current
        const currentLevel = levelRef.current

        // Si el jugador está muerto, solo actualizar los enemigos pero no el movimiento del jugador
        if (playerState.isDead) {
            // Los enemigos y disparos seguirán activándose abajo
        } else {
            // Lógica de movimiento del jugador
            const keys = activeKeys.current
            let vx = 0
            let vz = 0

            if (keys['w'] || keys['arrowup']) vz += 1
            if (keys['s'] || keys['arrowdown']) vz -= 1
            if (keys['a'] || keys['arrowleft']) vx -= 1
            if (keys['d'] || keys['arrowright']) vx += 1
            const isSpacePressed = Boolean(keys[' '] || keys['space'] || keys['spacebar'])
            if (isSpacePressed && !wasSpacePressedRef.current && isGroundedRef.current) {
                verticalVelocityRef.current = currentAdjustedStats.jumpForce
                isGroundedRef.current = false
            }
            wasSpacePressedRef.current = isSpacePressed

            const hasHorizontalMovement = Boolean(vx || vz)
            const magnitude = hasHorizontalMovement ? Math.hypot(vx, vz) : 1
            const inputX = vx / magnitude
            const inputZ = vz / magnitude

            // Determinar si está corriendo (Shift)
            let isSprinting = false;

            if (staminaRef.current >= maxStamina && !canSprintRef.current) {
                canSprintRef.current = true;
                if (!canSprintUiRef.current) {
                    canSprintUiRef.current = true
                    setCanSprint(true)
                }
            } else if (staminaRef.current <= 0 && canSprintRef.current) {
                canSprintRef.current = false;
                if (canSprintUiRef.current) {
                    canSprintUiRef.current = false
                    setCanSprint(false)
                }
            }

            if (Boolean(keys['shift']) && canSprintRef.current && hasHorizontalMovement) {
                isSprinting = true;
            }

            const currentSpeedMultiplier = isSprinting ? 2.0 : 1.0

            if (isSprinting) {
                staminaRef.current = Math.max(0, staminaRef.current - 70 * deltaSeconds)
            } else {
                staminaRef.current = Math.min(maxStamina, staminaRef.current + 8 * deltaSeconds)
            }
            if (shouldSyncHud) {
                setStamina(staminaRef.current)
            }

            const yaw = cameraYawRef.current
            const forwardX = -Math.sin(yaw)
            const forwardZ = -Math.cos(yaw)
            const rightX = Math.cos(yaw)
            const rightZ = -Math.sin(yaw)
            const nx = rightX * inputX + forwardX * inputZ
            const nz = rightZ * inputX + forwardZ * inputZ

            setPlayerPosition((currentPosition) => {
                const [x, y, z] = currentPosition
                const movementScale = deltaSeconds / 0.016
                const nextX = THREE.MathUtils.clamp(
                    x + (hasHorizontalMovement ? nx * (currentAdjustedStats.moveSpeed * currentSpeedMultiplier) * movementScale : 0),
                    -CLAMP,
                    CLAMP,
                )
                const nextZ = THREE.MathUtils.clamp(
                    z + (hasHorizontalMovement ? nz * (currentAdjustedStats.moveSpeed * currentSpeedMultiplier) * movementScale : 0),
                    -CLAMP,
                    CLAMP,
                )
                const candidate = avoidObstacleCollision(nextX, nextZ, x, z, elapsedSecondsRef.current)
                let nextVelocityY = verticalVelocityRef.current - GRAVITY * movementScale
                let nextY = y + nextVelocityY * movementScale

                if (nextY <= GROUND_LEVEL) {
                    nextY = GROUND_LEVEL
                    nextVelocityY = 0
                    isGroundedRef.current = true
                }

                verticalVelocityRef.current = nextVelocityY

                if (candidate[0] === x && candidate[1] === z && nextY === y) {
                    return currentPosition
                }

                return [candidate[0], nextY, candidate[1]]
            })
        } // Fin del else de playerState.isDead

        // Lógica de colisión con items de vida
        if (!playerStateRef.current.isDead) {
            let healsToApply = 0;
            let itemsChanged = false;

            // Usamos la ref para leer el estado más reciente de forma síncrona
            const currentItems = healthItemsRef.current;
            const keptItems = currentItems.filter(item => {
                const [px, py, pz] = playerPositionRef.current
                const dx = item.position[0] - px
                const dy = item.position[1] - py
                const dz = item.position[2] - pz
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

                // Si el jugador está cerca (radio 1.5) y necesita vida
                if (distance < 1.5) {
                    if (playerStateRef.current.health + healsToApply < playerStateRef.current.maxHealth) {
                        healsToApply += item.amount;
                        itemsChanged = true;
                        return false; // Eliminar item del mapa
                    }
                }
                return true;
            });

            if (itemsChanged) {
                setHealthItems(keptItems);
            }
            if (healsToApply > 0) {
                healPlayer(healsToApply);
            }
        }

        // Roamer attack logic
        setRoamingEnemies((currentRoamers) => {
            const now = typeof performance !== 'undefined' ? performance.now() : Date.now()

            currentRoamers.forEach((roamer) => {
                if (deadEntitiesRef.current.has(roamer.id)) return

                // Calculate distance to player
                const [px, py, pz] = playerPositionRef.current
                const dx = roamer.position[0] - px
                const dy = roamer.position[1] - py
                const dz = roamer.position[2] - pz
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

                // Check if in attack range and cooldown has passed
                // Aumentar rango de ataque según el nivel del jugador
                const attackDistanceMultiplier = getAttackDistanceMultiplier(currentLevel)
                const dynamicAttackDistance = ROAMER_ATTACK_DISTANCE * attackDistanceMultiplier
                const lastShotTime = roamerLastShotRef.current[roamer.id] ?? 0
                const canAttack = distance < dynamicAttackDistance && (now - lastShotTime) > currentAdjustedStats.roamerAttackCooldown

                if (canAttack) {
                    roamerLastShotRef.current[roamer.id] = now

                    // Fire shot at player
                    // Calcular la posición visual del roamer considerando el nivel
                    const roamerLevelScaleFactor = Math.min(2.5, 1 + (Math.max(0, currentLevel - 1) * 0.15))
                    const roamerAdjustedY = roamer.position[1] + 2.2 * roamerLevelScaleFactor
                    const roamerVisualPosition: [number, number, number] = [roamer.position[0], roamerAdjustedY, roamer.position[2]]

                    const shotId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                        ? crypto.randomUUID()
                        : `roamer-shot-${Date.now()}`

                    setShots((current) => [
                        ...current,
                        {
                            id: shotId,
                            start: roamerVisualPosition,
                            end: [...playerPositionRef.current] as [number, number, number],
                            createdAt: Date.now(),
                            arcDrop: computeShotArcDrop(),
                        },
                    ])

                    window.setTimeout(() => {
                        setShots((current) => current.filter((shot) => shot.id !== shotId))
                    }, SHOT_LIFETIME_MS)
                }
            })

            return currentRoamers
        })

        // Detectar colisión de disparos con el jugador
        if (!playerState.isDead) {
            const currentTime = Date.now()

            const currentShots = shotsRef.current;
            const shotsToRemove = new Set<string>();
            let totalDamageToTake = 0;

            for (const shot of currentShots) {
                if (damagingShotsRef.current.has(shot.id)) continue

                const shotPos = calculateShotPosition(shot, currentTime)
                if (checkShotPlayerCollision(shotPos)) {
                    damagingShotsRef.current.add(shot.id)

                    // Check evasion chance first
                    const evaded = Math.random() < currentAdjustedStats.evasionChance
                    if (!evaded) {
                        // Calculate damage with defense multiplier (default shot damage is 1, reduced by defense)
                        const damageToTake = Math.max(0.1, 1 * currentAdjustedStats.defenseMultiplier)
                        totalDamageToTake += damageToTake
                    }

                    shotsToRemove.add(shot.id)
                }
            }

            if (shotsToRemove.size > 0) {
                setShots((current) => current.filter((shot) => !shotsToRemove.has(shot.id)))
            }

            if (totalDamageToTake > 0) {
                damagePlayer(totalDamageToTake)
            }

            // Determinar a qué enemigo estamos apuntando con la cruceta (Hover)
            if (document.pointerLockElement === arenaCanvasRef.current) {
                if (now - lastTargetRaycastRef.current >= 50) {
                    lastTargetRaycastRef.current = now
                    const cameraOrigin = new THREE.Vector3(...getCameraPosition(playerPositionRef.current))
                    const direction = new THREE.Vector3(
                        -Math.sin(cameraYawRef.current) * Math.cos(cameraPitchRef.current),
                        Math.sin(cameraPitchRef.current),
                        -Math.cos(cameraYawRef.current) * Math.cos(cameraPitchRef.current),
                    ).normalize()
                    const raycaster = shotRaycasterRef.current
                    raycaster.set(cameraOrigin, direction)
                    raycaster.near = 0
                    raycaster.far = MAX_SHOT_DISTANCE

                    // We only need keys to find matching objects, state isn't critical here
                    const targetObjects = Array.from(enemyObjectsRef.current.values())

                    if (targetObjects.length > 0) {
                        const intersections = raycaster.intersectObjects(targetObjects, true)
                        let foundTargetId: string | null = null

                        for (const intersection of intersections) {
                            let node: THREE.Object3D | null = intersection.object
                            while (node?.parent && !node.userData.taskId) {
                                node = node.parent
                            }
                            const taskId = node?.userData.taskId as string | undefined
                            if (taskId) {
                                foundTargetId = taskId
                                break
                            }
                        }

                        setTargetedEnemyId((current) => {
                            if (current !== foundTargetId) return foundTargetId
                            return current
                        })
                    } else {
                        setTargetedEnemyId((current) => current !== null ? null : current)
                    }
                }
            } else {
                setTargetedEnemyId((current) => current !== null ? null : current)
            }
        }
    }, [playerState.isDead, damagePlayer, healPlayer, checkShotPlayerCollision, maxStamina])

    const fireTaskShot = useCallback(
        (task: Task, startOverride?: [number, number, number], targetOverride?: [number, number, number]) => {
            if (task.completed || deadEntitiesRef.current.has(task.id)) return

            // Si no hay override, calcular desde la cámara del jugador en la dirección donde está mirando
            let shotStart: [number, number, number]
            if (startOverride) {
                shotStart = startOverride
            } else {
                // Usar getShotStart que calcula desde la cámara con la dirección correcta
                shotStart = getShotStart(playerPositionRef.current, cameraYawRef.current, cameraPitchRef.current)
            }

            // Obtener la posición visual ACTUAL del enemigo del objeto Three.js renderizado
            const enemyGroup = enemyObjectsRef.current.get(task.id) as THREE.Group | undefined
            let visualEnemyPosition: [number, number, number]

            if (enemyGroup) {
                // Usar la posición actual del objeto renderizado (incluye patrulla, órbita, etc.)
                visualEnemyPosition = [
                    enemyGroup.position.x,
                    enemyGroup.position.y,
                    enemyGroup.position.z
                ]
            } else {
                // Fallback: si no encontramos el objeto, retornamos
                return
            }
            const levelHealthMultiplier = 1 + (Math.max(0, level - 1) * 0.2)
            const baseHealth = PRIORITY_HEALTH[task.priority]
            const maxHealth = Math.ceil(baseHealth * levelHealthMultiplier)

            // Obtener daño recibido (trackea disparos recibidos, no salud actual)
            const damageTaken = taskDamageTaken[task.id] ?? 0
            const currentHealth = maxHealth - damageTaken

            // Si la salud dinámica es <= 0, el enemigo explota
            if (currentHealth <= 0) {
                return
            }

            const nextDamage = damageTaken + adjustedStats.playerDamagePerHit

            setTaskDamageTaken((current) => ({
                ...current,
                [task.id]: nextDamage,
            }))

            if (nextDamage >= maxHealth) {
                deadEntitiesRef.current.add(task.id)

                // Reproducir sonido de explosión al eliminar
                const explosionAudio = new Audio(explosionSoundUrl)
                explosionAudio.volume = 0.25
                explosionAudio.play().catch(() => undefined)

                completeTask(task.id)
                // Mostrar popup de XP
                const popupId = `popup-task-${task.id}-${Date.now()}`
                setXpPopups(curr => [...curr, {
                    id: popupId,
                    amount: task.reward,
                    position: visualEnemyPosition,
                    createdAt: Date.now()
                }])
                window.setTimeout(() => {
                    setXpPopups(curr => curr.filter(p => p.id !== popupId))
                }, 1000)
            }

            const shotId =
                typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                    ? crypto.randomUUID()
                    : `${task.id}-${Date.now()}`

            setShots((current) => [
                ...current,
                {
                    id: shotId,
                    start: shotStart,
                    end: targetOverride ?? visualEnemyPosition,
                    createdAt: Date.now(),
                    arcDrop: computeShotArcDrop(),
                },
            ])

            window.setTimeout(() => {
                setShots((current) => current.filter((shot) => shot.id !== shotId))
            }, SHOT_LIFETIME_MS)
        },
        [completeTask, taskDamageTaken, level, adjustedStats],
    )

    const fireRoamingShot = useCallback(
        (roamerId: string, startOverride?: [number, number, number], targetOverride?: [number, number, number]) => {
            if (deadEntitiesRef.current.has(roamerId)) return

            const roamer = roamingEnemies.find(r => r.id === roamerId)
            if (!roamer) return

            const nextHealth = roamer.health - 1

            if (nextHealth <= 0) {
                deadEntitiesRef.current.add(roamerId)

                // Reproducir sonido de explosión al eliminar
                const explosionAudio = new Audio(explosionSoundUrl)
                explosionAudio.volume = 0.25
                explosionAudio.play().catch(() => undefined)

                // Otorgar XP al matar a una "Anomalía"/Roamer. Es menor que la recompensa de tareas.
                // Calculamos un valor aleatorio entre 1 y 10
                const randomXp = Math.floor(Math.random() * 10) + 1

                // Usar addXp aquí, FUERA del setRoamingEnemies para evitar que
                // React Strict Mode lo mande a llamar 2 veces
                addXp(randomXp)

                // Mostrar popup de XP
                const popupId = `popup-roamer-${roamerId}-${Date.now()}`
                setXpPopups(curr => [...curr, {
                    id: popupId,
                    amount: randomXp,
                    position: roamer.position,
                    createdAt: Date.now()
                }])
                window.setTimeout(() => {
                    setXpPopups(curr => curr.filter(p => p.id !== popupId))
                }, 1000)
            }

            setRoamingEnemies(current => current.map(r => {
                if (r.id === roamerId) {
                    return { ...r, health: r.health - 1 }
                }
                return r
            }).filter(r => r.health > 0))

            const shotId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                ? crypto.randomUUID()
                : `rshot-${Date.now()}`

            setShots((current) => [
                ...current,
                {
                    id: shotId,
                    start: startOverride ?? [...playerPositionRef.current] as [number, number, number],
                    end: targetOverride ?? roamer.position,
                    createdAt: Date.now(),
                    arcDrop: computeShotArcDrop(),
                },
            ])

            window.setTimeout(() => {
                setShots((current) => current.filter((shot) => shot.id !== shotId))
            }, SHOT_LIFETIME_MS)
        },
        [roamingEnemies, addXp],
    )

    const handleEnemyObjectReady = useCallback((taskId: string, object: THREE.Object3D | null) => {
        if (object) {
            enemyObjectsRef.current.set(taskId, object)
            return
        }
        enemyObjectsRef.current.delete(taskId)
    }, [])

    useEffect(() => {
        const activeTaskIds = new Set(activeTasks.map((task) => task.id))
        for (const [taskId] of enemyObjectsRef.current) {
            if (!activeTaskIds.has(taskId)) {
                enemyObjectsRef.current.delete(taskId)
            }
        }
    }, [activeTasks])

    const handleCrosshairShot = useCallback(
        () => {
            if (document.pointerLockElement !== arenaCanvasRef.current) return false

            const currentPlayerPosition = playerPositionRef.current
            const cameraOrigin = new THREE.Vector3(...getCameraPosition(currentPlayerPosition))
            const direction = new THREE.Vector3(
                -Math.sin(cameraYawRef.current) * Math.cos(cameraPitchRef.current),
                Math.sin(cameraPitchRef.current),
                -Math.cos(cameraYawRef.current) * Math.cos(cameraPitchRef.current),
            ).normalize()
            const raycaster = shotRaycasterRef.current
            raycaster.set(cameraOrigin, direction)
            raycaster.near = 0
            raycaster.far = MAX_SHOT_DISTANCE
            const shotStart = getShotStart(currentPlayerPosition, cameraYawRef.current, cameraPitchRef.current)
            const taskById = new Map(activeTasks.map((task) => [task.id, task]))
            const roamingById = new Map(roamingEnemies.map(r => [r.id, r]))

            const targetObjects = Array.from(enemyObjectsRef.current.entries())
                .filter(([taskId]) => taskById.has(taskId) || roamingById.has(taskId))
                .map(([, object]) => object)

            if (targetObjects.length === 0) return false

            const intersections = raycaster.intersectObjects(targetObjects, true)
            for (const intersection of intersections) {
                let node: THREE.Object3D | null = intersection.object
                while (node?.parent && !node.userData.taskId) {
                    node = node.parent
                }
                const taskId = node?.userData.taskId as string | undefined
                if (!taskId) continue

                if (taskById.has(taskId)) {
                    fireTaskShot(taskById.get(taskId)!, shotStart, [intersection.point.x, intersection.point.y, intersection.point.z])
                    return true
                } else if (roamingById.has(taskId)) {
                    fireRoamingShot(taskId, shotStart, [intersection.point.x, intersection.point.y, intersection.point.z])
                    return true
                }
            }
            return false
        },
        [activeTasks, roamingEnemies, fireTaskShot, fireRoamingShot],
    )

    const triggerFreeShot = useCallback(
        () => {
            const shotStart = getShotStart(playerPositionRef.current, cameraYawRef.current, cameraPitchRef.current)
            const direction = new THREE.Vector3(
                -Math.sin(cameraYawRef.current) * Math.cos(cameraPitchRef.current),
                Math.sin(cameraPitchRef.current),
                -Math.cos(cameraYawRef.current) * Math.cos(cameraPitchRef.current),
            ).normalize()
            const shotEnd = new THREE.Vector3(...shotStart)
                .add(direction.multiplyScalar(MAX_SHOT_DISTANCE))
            const shotId =
                typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                    ? crypto.randomUUID()
                    : `free-${Date.now()}`

            setShots((current) => [
                ...current,
                {
                    id: shotId,
                    start: shotStart,
                    end: [shotEnd.x, shotEnd.y, shotEnd.z],
                    createdAt: Date.now(),
                    arcDrop: computeShotArcDrop(),
                },
            ])

            window.setTimeout(() => {
                setShots((current) => current.filter((shot) => shot.id !== shotId))
            }, SHOT_LIFETIME_MS)
        },
        [],
    )

    useEffect(() => {
        const onMouseDown = (event: MouseEvent) => {
            if (event.button !== 0) return
            if (document.pointerLockElement !== arenaCanvasRef.current) return
            if (shootAudioRef.current) {
                shootAudioRef.current.currentTime = 0
                shootAudioRef.current.play().catch(() => undefined)
            }
            const hitTask = handleCrosshairShot()
            if (!hitTask) {
                triggerFreeShot()
            }
        }

        window.addEventListener('mousedown', onMouseDown)
        return () => window.removeEventListener('mousedown', onMouseDown)
    }, [handleCrosshairShot, triggerFreeShot])

    const toggleFullscreen = useCallback(async () => {
        if (document.fullscreenElement === arenaRootRef.current) {
            await document.exitFullscreen()
            return
        }
        if (arenaRootRef.current) {
            await arenaRootRef.current.requestFullscreen()
            requestPointerLock()
        }
    }, [requestPointerLock])

    return (
        <motion.section
            ref={arenaRootRef}
            className="page page-arena"
            initial="hidden"
            animate="visible"
            variants={arenaPageVariants}
        >
            <motion.header className="hud-header" variants={arenaFadeInVariants}>
                <div className="title-block">
                    <span className="eyebrow">{t('arena.eyebrow')}</span>
                    <h1>{t('arena.title')}</h1>
                    <p>{t('arena.subtitle')}</p>
                </div>

                <div className="status-grid">
                    <div className="status-card">
                        <span>{t('arena.level')}</span>
                        <strong>{level}</strong>
                    </div>
                    <div className="status-card">
                        <span>{t('arena.totalXp')}</span>
                        <strong>{xp}</strong>
                    </div>
                    <div className="status-card">
                        <span>{t('arena.completed')}</span>
                        <strong>
                            {completedTaskCount}/{tasks.length}
                        </strong>
                    </div>
                </div>

            </motion.header>

            <main className="battle-zone">
                <Canvas
                    shadows={{ type: THREE.PCFShadowMap }}
                    dpr={[1, 2]}
                    camera={{ fov: 60, near: 0.1, far: 150, position: [16, 18, 16] }}
                    onCreated={({ gl }) => {
                        arenaCanvasRef.current = gl.domElement
                    }}
                >
                    <ArenaSimulation onTick={gameTick} />

                    <color attach="background" args={['#000510']} />
                    <fog attach="fog" args={['#000510', 25, 60]} />

                    {/* Iluminación mejorada */}
                    <ambientLight intensity={0.4} color="#3b5f8f" />
                    <directionalLight
                        castShadow
                        color="#57d9ff"
                        position={[15, 20, 8]}
                        intensity={1.8}
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                        shadow-camera-far={80}
                        shadow-camera-left={-25}
                        shadow-camera-right={25}
                        shadow-camera-top={25}
                        shadow-camera-bottom={-25}
                    />
                    <pointLight color="#8b5cf6" position={[-15, 6, 10]} intensity={20} distance={30} />
                    <pointLight color="#00ffaa" position={[15, 5, -12]} intensity={18} distance={28} />
                    <pointLight color="#ff0088" position={[0, 8, 15]} intensity={15} distance={25} />

                    {/* Estrellas de fondo */}
                    <Stars radius={80} depth={30} count={5000} factor={4} saturation={0.9} />

                    {/* Ambiente mejorado */}
                    <EnhancedEnvironment />

                    {/* Items de vida (curación) */}
                    {healthItems.map((item) => (
                        <HealthItem key={item.id} position={item.position} />
                    ))}

                    {/* Obstáculos dinámicos */}
                    <DynamicObstacles />

                    <FirstPersonCamera
                        playerPosition={playerPosition}
                        cameraYawRef={cameraYawRef}
                        cameraPitchRef={cameraPitchRef}
                    />

                    {/* Jugador mejorado */}
                    <EnhancedPlayer position={playerPosition} />

                    {/* Enemigos mejorados (Tareas) */}
                    {activeTasks.map((task) => {
                        const levelHealthMultiplier = 1 + (Math.max(0, level - 1) * 0.2)
                        const maxHealth = Math.ceil(PRIORITY_HEALTH[task.priority] * levelHealthMultiplier)
                        const currentHealth = Math.max(0, maxHealth - (taskDamageTaken[task.id] ?? 0))

                        return (
                            <EnhancedEnemy
                                key={task.id}
                                task={task}
                                position={enemyPositions.get(task.id) || [0, 1.1, 0]}
                                onAttack={fireTaskShot}
                                onObjectReady={handleEnemyObjectReady}
                                playerLevel={level}
                                currentHealth={currentHealth}
                                maxHealth={maxHealth}
                                isTargeted={targetedEnemyId === task.id}
                            />
                        )
                    })}

                    {/* Enemigos errantes libres */}
                    {roamingEnemies.map((roamer) => {
                        const levelHealthMultiplier = 1 + (Math.max(0, level - 1) * 0.2)
                        const maxHealth = Math.ceil(2 * levelHealthMultiplier)

                        return (
                            <EnhancedEnemy
                                key={roamer.id}
                                isRoamer={true}
                                task={{
                                    id: roamer.id,
                                    title: t('arena.roamingEnemy'),
                                    description: '',
                                    priority: 'low', // Low hace que sean "easy" por la dificultad, pero ya los sobrescribimos con medium en el componente
                                    reward: 5,
                                    completed: false,
                                    createdAt: 0
                                }}
                                position={roamer.position}
                                onAttack={(fakeTask) => fireRoamingShot(fakeTask.id)}
                                onObjectReady={handleEnemyObjectReady}
                                playerLevel={level}
                                currentHealth={roamer.health}
                                maxHealth={maxHealth}
                                isTargeted={targetedEnemyId === roamer.id}
                            />
                        )
                    })}

                    {/* Disparos de energía */}
                    {shots.map((shot) => (
                        <PulseBeam key={shot.id} shot={shot} />
                    ))}

                    {/* Popups de XP ganada */}
                    {xpPopups.map((popup) => (
                        <XpPopupEffect key={popup.id} popup={popup} />
                    ))}
                </Canvas>
                <div className="fps-overlay" aria-live="polite">
                    <div className="fps-crosshair" aria-hidden="true" />

                    {/* Health Bar - Always visible */}
                    <div style={{
                        position: 'absolute',
                        top: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        minWidth: '150px',
                        zIndex: 100,
                    }}>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('arena.health')}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                flex: 1,
                                height: '8px',
                                backgroundColor: '#1a1a2e',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${(playerState.health / playerState.maxHealth) * 100}%`,
                                    backgroundColor: playerState.health <= 2 ? '#ef4444' : '#22c55e',
                                    transition: 'width 0.2s ease',
                                }} />
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: playerState.health <= 2 ? '#ef4444' : '#22c55e',
                                fontWeight: 'bold',
                                minWidth: '30px',
                            }}>
                                {playerState.health}/{playerState.maxHealth}
                            </div>
                        </div>
                    </div>

                    <ArenaMinimap
                        data={minimapData}
                        cameraYaw={cameraYaw}
                    />

                    {/* Stamina Bar */}
                    <div style={{
                        position: 'absolute',
                        bottom: '30px',
                        right: '30px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        minWidth: '200px',
                        zIndex: 100,
                        backdropFilter: 'blur(4px)',
                        opacity: canSprint ? 1 : 0.6,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: canSprint ? '#60a5fa' : '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <span>{canSprint ? `Stamina (Lv.${level})` : 'Recharging...'}</span>
                            <span>{Math.round((stamina / maxStamina) * 100)}%</span>
                        </div>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#1e3a8a',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${(stamina / maxStamina) * 100}%`,
                                backgroundColor: canSprint ? '#60a5fa' : '#6b7280',
                                transition: 'width 0.1s linear, background-color 0.3s ease',
                                boxShadow: stamina === maxStamina && canSprint ? '0 0 8px #60a5fa' : 'none',
                            }} />
                        </div>
                    </div>

                    {!isFullscreen && (
                        <button type="button" className="fps-fullscreen-button" onClick={toggleFullscreen}>
                            {t('arena.enterFullscreen')}
                        </button>
                    )}
                </div>

                {playerState.isDead && (
                    <motion.div
                        className="death-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.85)',
                            zIndex: 1000,
                        }}
                    >
                        <div style={{ textAlign: 'center', color: '#fff' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ef4444' }}>
                                {t('arena.youDied')}
                            </h2>
                            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.8 }}>
                                {t('arena.deaths')}: {playerState.deaths}
                            </p>
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                color: '#fbbf24',
                                animation: 'pulse 1s infinite'
                            }}>
                                {respawnCountdown}s
                            </div>
                            <p style={{ fontSize: '0.9rem', marginTop: '2rem', opacity: 0.6 }}>
                                {t('arena.respawningIn')}
                            </p>
                        </div>
                    </motion.div>
                )}

                {isFullscreen && (
                    <motion.aside className="controls-panel" variants={arenaFadeInVariants}>
                        <h2>{t('arena.controlsLabel')}</h2>
                        <p style={{ whiteSpace: 'pre-line' }}>{t('arena.controlsDetail')}</p>
                        <small>{t('arena.exitFullscreenHint')}</small>
                    </motion.aside>
                )}

                <motion.aside
                    className={`task-panel ${activeTasks.length === 0 ? 'empty' : ''}`}
                    variants={arenaFadeInVariants}
                >
                    <h2>{t('arena.activeObjectives')}</h2>
                    {!isFullscreen && (
                        <p style={{ whiteSpace: 'pre-line' }}>
                            {t('arena.controlsLabel')} <br />
                            <strong>{t('arena.controlsDetail')}</strong>
                        </p>
                    )}
                    <ul>
                        {activeTasks.map((task) => (
                            <li key={task.id} className={task.completed ? 'completed' : ''}>
                                <div>
                                    <strong>{task.title}</strong>
                                    <span>{task.description}</span>
                                </div>
                                <div className="tag-stack">
                                    <span>{t(`priority.${task.priority}`)}</span>
                                    <span>+{task.reward} XP</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </motion.aside>

            </main>
        </motion.section>
    )
}

function ArenaSimulation({ onTick }: { onTick: (deltaSeconds: number) => void }) {
    useFrame((_, delta) => {
        onTick(delta)
    })

    return null
}

function FirstPersonCamera({
    playerPosition,
    cameraYawRef,
    cameraPitchRef,
}: {
    playerPosition: [number, number, number]
    cameraYawRef: MutableRefObject<number>
    cameraPitchRef: MutableRefObject<number>
}) {
    useFrame(({ camera }) => {
        const [x, y, z] = playerPosition
        camera.position.set(...getCameraPosition([x, y, z]))
        const lookDirection = new THREE.Vector3(
            -Math.sin(cameraYawRef.current) * Math.cos(cameraPitchRef.current),
            Math.sin(cameraPitchRef.current),
            -Math.cos(cameraYawRef.current) * Math.cos(cameraPitchRef.current),
        )
        camera.lookAt(camera.position.clone().add(lookDirection))
    })

    return null
}
