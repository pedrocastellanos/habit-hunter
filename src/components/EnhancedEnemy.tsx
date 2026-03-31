import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useTranslation } from 'react-i18next'
import { PRIORITY_COLORS, PRIORITY_TO_DIFFICULTY } from '@/game/catalog'
import type { Task } from '@/game/types'

// Tipos de comportamiento de enemigos
type EnemyBehavior = 'static' | 'patrol' | 'orbit' | 'erratic'

function getEnemyBehavior(priority: Task['priority']): EnemyBehavior {
    switch (priority) {
        case 'low':
            return 'static'
        case 'medium':
            return 'patrol'
        case 'high':
            return 'orbit'
        default:
            return 'static'
    }
}

export function EnhancedEnemy({
    task,
    position,
    onAttack,
    onObjectReady,
    isRoamer = false,
    playerLevel = 1,
    currentHealth,
    maxHealth,
    isTargeted = false,
}: {
    task: Task
    position: [number, number, number]
    onAttack: (task: Task) => void
    onObjectReady?: (taskId: string, object: THREE.Group | null) => void
    isRoamer?: boolean
    playerLevel?: number
    currentHealth?: number
    maxHealth?: number
    isTargeted?: boolean
}) {
    const { t } = useTranslation()
    const groupRef = useRef<THREE.Group>(null)
    const coreRef = useRef<THREE.Mesh>(null)
    const scaleTargetRef = useRef(new THREE.Vector3(1, 1, 1))
    const [hovered, setHovered] = useState(false)

    // Calcular factor de escala basado en el nivel del jugador
    // Aumenta un 15% por cada nivel (mínimo 1, máximo 2.5x)
    const levelScaleFactor = Math.min(2.5, 1 + (Math.max(0, playerLevel - 1) * 0.15))

    // Ajustar posición Y para que el enemigo no se vea bajo el terreno
    // Se mueve hacia arriba a medida que aumenta la escala
    // El aro tiene radio 0.9 + tubo 0.06 = 0.96, margen muy generoso
    const adjustedY = position[1] + 2.2 * levelScaleFactor

    // Darle el color y forma de anomaly si es un enemigo errante
    const color = isRoamer ? '#ff4b4b' : PRIORITY_COLORS[task.priority]
    const baseY = adjustedY
    const behavior = isRoamer ? 'erratic' : getEnemyBehavior(task.priority)
    const difficulty = isRoamer ? 'medium' : PRIORITY_TO_DIFFICULTY[task.priority]

    useEffect(() => {
        if (!groupRef.current) return
        groupRef.current.userData.taskId = task.id
        onObjectReady?.(task.id, groupRef.current)

        return () => {
            onObjectReady?.(task.id, null)
        }
    }, [onObjectReady, task.id])

    // Offset para cada enemigo
    const [offset] = useState(() => ({
        angle: Math.random() * Math.PI * 2,
        speed: (0.3 + Math.random() * 0.5) * levelScaleFactor, // Aumentar velocidad con nivel
        orbitRadius: 1 + Math.random() * 0.5,
    }))
    const offsetRef = useRef(offset)

    useFrame(({ clock }) => {
        if (!groupRef.current || !coreRef.current) return
        const t = clock.elapsedTime
        const offset = offsetRef.current

        // Comportamiento según tipo
        switch (behavior) {
            case 'patrol':
                // Patrulla en línea
                groupRef.current.position.x = position[0] + Math.sin(t * offset.speed) * 2
                groupRef.current.position.z = position[2] + Math.cos(t * offset.speed) * 2
                break

            case 'orbit':
                // Orbita alrededor de su punto inicial
                offset.angle += 0.02
                groupRef.current.position.x = position[0] + Math.cos(offset.angle) * offset.orbitRadius
                groupRef.current.position.z = position[2] + Math.sin(offset.angle) * offset.orbitRadius
                break

            case 'erratic':
                // Movimiento errático
                groupRef.current.position.x = position[0] + Math.sin(t * 0.7) * Math.cos(t * 0.3) * 1.5
                groupRef.current.position.z = position[2] + Math.cos(t * 0.5) * Math.sin(t * 0.4) * 1.5
                break

            default:
                // Estático (solo bobbing)
                groupRef.current.position.x = position[0]
                groupRef.current.position.z = position[2]
        }

        // Bobbing vertical
        groupRef.current.position.y = baseY + Math.sin(t * 1.7 + position[0]) * 0.16

        // Rotación del núcleo
        coreRef.current.rotation.y += 0.015
        coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.2

        // Escala con hover y completado sin crear objetos nuevos por frame
        const scaleTarget = task.completed ? 0.001 : (hovered || isTargeted) ? 1.25 : 1
        const scaledTarget = scaleTarget * levelScaleFactor
        scaleTargetRef.current.set(scaledTarget, scaledTarget, scaledTarget)
        groupRef.current.scale.lerp(scaleTargetRef.current, 0.16)

        // Efecto de "respiración" en el material
        if (!task.completed) {
            const material = coreRef.current.material as THREE.MeshStandardMaterial
            const isHoveredLocal = hovered || isTargeted
            material.emissiveIntensity = (isHoveredLocal ? 2.5 : 1.5) + Math.sin(t * 2) * 0.3
        }
    })

    const isHoveredLocal = hovered || isTargeted

    return (
        <group ref={groupRef} position={[position[0], adjustedY, position[2]]}>
            {/* Núcleo principal del enemigo */}
            <mesh
                ref={coreRef}
                castShadow
                onPointerOver={() => !task.completed && setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={(event) => {
                    event.stopPropagation()
                    if (document.pointerLockElement) return
                    if (task.completed) return
                    onAttack(task)
                }}
            >
                {difficulty === 'easy' && <icosahedronGeometry args={[0.5, 0]} />}
                {difficulty === 'medium' && <dodecahedronGeometry args={[0.5, 0]} />}
                {difficulty === 'hard' && <octahedronGeometry args={[0.7, 2]} />}

                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={task.completed ? 0 : isHoveredLocal ? 2.5 : 1.5}
                    metalness={0.8}
                    roughness={0.2}
                    transparent
                    opacity={task.completed ? 0.1 : 1}
                />
            </mesh>

            {/* Anillo orbital */}
            {!task.completed && (
                <EnemyOrbitalRing color={color} speed={difficulty === 'hard' ? 2 : 1} scale={levelScaleFactor} />
            )}

            {/* Partículas alrededor */}
            {!task.completed && difficulty === 'hard' && (
                <EnemyParticles color={color} scale={levelScaleFactor} />
            )}

            {/* Shield visual para enemigos de prioridad alta */}
            {!task.completed && task.priority === 'high' && !isRoamer && (
                <mesh scale={levelScaleFactor}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.15}
                        wireframe
                    />
                </mesh>
            )}

            {/* Badge con información */}
            {!task.completed && !isRoamer && (
                <Html center distanceFactor={11} position={[0, 1.2, 0]}>
                    <div className="enemy-badge-enhanced">
                        <span className="badge-task-name">{task.title}</span>
                        <span className="badge-priority">{t(`priority.${task.priority}`)}</span>
                        <span className="badge-reward">+{task.reward} XP</span>
                        {isHoveredLocal && currentHealth !== undefined && maxHealth !== undefined && (
                            <div className="badge-health">HP: {currentHealth}/{maxHealth}</div>
                        )}
                    </div>
                </Html>
            )}

            {/* Health Badge para Roamers */}
            {!task.completed && isRoamer && isHoveredLocal && currentHealth !== undefined && maxHealth !== undefined && (
                <Html center distanceFactor={11} position={[0, 1.2, 0]}>
                    <div className="enemy-badge-enhanced roamer-badge">
                        <div className="badge-health">HP: {currentHealth}/{maxHealth}</div>
                    </div>
                </Html>
            )}
        </group>
    )
}

// Anillo orbital del enemigo
function EnemyOrbitalRing({ color, speed = 1, scale = 1 }: { color: string; speed?: number; scale?: number }) {
    const ref = useRef<THREE.Mesh>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        ref.current.rotation.x = clock.elapsedTime * speed
        ref.current.rotation.y = clock.elapsedTime * speed * 0.5
    })

    return (
        <mesh ref={ref} scale={scale}>
            <torusGeometry args={[0.9, 0.06, 16, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.2}
                transparent
                opacity={0.7}
            />
        </mesh>
    )
}

// Sistema de partículas para enemigos difíciles
function EnemyParticles({ color, scale = 1 }: { color: string; scale?: number }) {
    const ref = useRef<THREE.Points>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        ref.current.rotation.y = clock.elapsedTime * 0.5
    })

    const particleCount = 20
    const [positions] = useState(() => {
        const arr = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2
            const radius = 1.2 * scale
            arr[i * 3] = Math.cos(angle) * radius
            arr[i * 3 + 1] = (Math.random() - 0.5) * 0.5
            arr[i * 3 + 2] = Math.sin(angle) * radius
        }
        return arr
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.1} color={color} transparent opacity={0.8} sizeAttenuation />
        </points>
    )
}

