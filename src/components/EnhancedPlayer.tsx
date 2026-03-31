import { useRef, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from '@/context/useGame'

type CharacterBodyConfig = {
    bodyScale: [number, number, number]
    headRadius: number
    headPosition: [number, number, number]
    shouldersOffset: number
}

const CHARACTER_BODY_CONFIG: Record<string, CharacterBodyConfig> = {
    cipher: {
        bodyScale: [0.22, 1.2, 0.22],
        headRadius: 0.28,
        headPosition: [0, 0.95, 0],
        shouldersOffset: 0.35,
    },
    nox: {
        bodyScale: [0.35, 0.95, 0.35],
        headRadius: 0.38,
        headPosition: [0, 0.8, 0],
        shouldersOffset: 0.45,
    },
    vanta: {
        bodyScale: [0.28, 1, 0.28],
        headRadius: 0.32,
        headPosition: [0, 0.85, 0],
        shouldersOffset: 0.4,
    },
}

export function EnhancedPlayer({ position }: { position: [number, number, number] }) {
    const groupRef = useRef<THREE.Group>(null)
    const bodyRef = useRef<THREE.Mesh>(null)
    const { selectedCharacter, equippedItemIds } = useGame()

    // Colores según personaje
    const accentColor = selectedCharacter.accent
    const bodyConfig = CHARACTER_BODY_CONFIG[selectedCharacter.id] || CHARACTER_BODY_CONFIG.vanta

    useFrame(({ clock }) => {
        if (!groupRef.current || !bodyRef.current) return
        const t = clock.elapsedTime

        // Posición con bobbing suave
        groupRef.current.position.set(
            position[0],
            position[1] + Math.sin(t * 3) * 0.06,
            position[2]
        )

        // Rotación sutil del cuerpo
        bodyRef.current.rotation.y = Math.sin(t * 1.5) * 0.15
    })

    const hasWeapon = equippedItemIds.some((id) => id.includes('weapon'))
    const hasVisor = equippedItemIds.some((id) => id.includes('visor'))
    const hasAura = equippedItemIds.some((id) => id.includes('aura'))

    return (
        <group ref={groupRef}>
            {/* Cuerpo principal customizado por personaje */}
            <CharacterBody ref={bodyRef} character={selectedCharacter.id} config={bodyConfig} accentColor={accentColor} />

            {/* Cabeza/Casco */}
            <mesh castShadow position={bodyConfig.headPosition}>
                <sphereGeometry args={[bodyConfig.headRadius, 16, 16]} />
                <meshStandardMaterial
                    color="#cbd5e1"
                    emissive={accentColor}
                    emissiveIntensity={0.5}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Visor (si está equipado) */}
            {hasVisor && (
                <mesh position={[0, bodyConfig.headPosition[1] + 0.05, bodyConfig.headPosition[2] + 0.25]}>
                    <boxGeometry args={[0.4, 0.15, 0.1]} />
                    <meshStandardMaterial
                        color="#7af86f"
                        emissive="#7af86f"
                        emissiveIntensity={2}
                        metalness={1}
                        roughness={0}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            )}

            {/* Anillo base animado */}
            <AnimatedRing color={accentColor} character={selectedCharacter.id} />

            {/* Arma mejorada (si está equipada) */}
            {hasWeapon && <EnhancedWeapon color={accentColor} />}

            {/* Aura de energía (si está equipada) */}
            {hasAura && <EnergyAura color={accentColor} />}

            {/* Jetpack/Propulsores */}
            <Thrusters color={accentColor} character={selectedCharacter.id} />

            {/* Hombros/Armadura - Dinámicos según personaje */}
            <CharacterShoulders offset={bodyConfig.shouldersOffset} accentColor={accentColor} character={selectedCharacter.id} />

            {/* Luz del jugador */}
            <pointLight color={accentColor} intensity={2} distance={4} />
        </group>
    )
}

// Componente de cuerpo dinámico según personaje
interface CharacterBodyProps {
    character: string
    config: CharacterBodyConfig
    accentColor: string
}

const CharacterBody = forwardRef<THREE.Mesh, CharacterBodyProps>(
    ({ character, config, accentColor }, ref) => {
        if (character === 'cipher') {
            return (
                <mesh ref={ref} castShadow>
                    <capsuleGeometry args={[config.bodyScale[0], config.bodyScale[1], 6, 12]} />
                    <meshStandardMaterial
                        color="#e0f2fe"
                        emissive={accentColor}
                        emissiveIntensity={0.8}
                        metalness={0.7}
                        roughness={0.3}
                    />
                </mesh>
            )
        }

        if (character === 'nox') {
            return (
                <mesh ref={ref} castShadow scale={config.bodyScale}>
                    <octahedronGeometry args={[1, 1]} />
                    <meshStandardMaterial
                        color="#e0f2fe"
                        emissive={accentColor}
                        emissiveIntensity={0.8}
                        metalness={0.7}
                        roughness={0.3}
                    />
                </mesh>
            )
        }

        return (
            <mesh ref={ref} castShadow>
                <capsuleGeometry args={[config.bodyScale[0], config.bodyScale[1], 8, 16]} />
                <meshStandardMaterial
                    color="#e0f2fe"
                    emissive={accentColor}
                    emissiveIntensity={0.8}
                    metalness={0.7}
                    roughness={0.3}
                />
            </mesh>
        )
    }
)

CharacterBody.displayName = 'CharacterBody'

// Hombros dinámicos
function CharacterShoulders({ offset, accentColor, character }: { offset: number; accentColor: string; character: string }) {
    const leftSize: [number, number, number] = character === 'nox' ? [0.25, 0.2, 0.3] : [0.2, 0.15, 0.25]
    const rightSize: [number, number, number] = character === 'nox' ? [0.25, 0.2, 0.3] : [0.2, 0.15, 0.25]

    return (
        <>
            <mesh castShadow position={[offset, 0.4, 0]}>
                <boxGeometry args={leftSize} />
                <meshStandardMaterial
                    color="#475569"
                    metalness={0.9}
                    roughness={0.2}
                    emissive={accentColor}
                    emissiveIntensity={0.3}
                />
            </mesh>
            <mesh castShadow position={[-offset, 0.4, 0]}>
                <boxGeometry args={rightSize} />
                <meshStandardMaterial
                    color="#475569"
                    metalness={0.9}
                    roughness={0.2}
                    emissive={accentColor}
                    emissiveIntensity={0.3}
                />
            </mesh>
        </>
    )
}

// Anillo base animado - más grande para Nox
function AnimatedRing({ color, character }: { color: string; character: string }) {
    const ref = useRef<THREE.Mesh>(null)
    const ringRadius = character === 'nox' ? 0.75 : 0.6

    useFrame(({ clock }) => {
        if (!ref.current) return
        const t = clock.elapsedTime
        ref.current.rotation.y = t * 2

        const material = ref.current.material as THREE.MeshStandardMaterial
        material.emissiveIntensity = 1.5 + Math.sin(t * 3) * 0.5
    })

    return (
        <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
            <torusGeometry args={[ringRadius, 0.08, 12, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.8}
                metalness={0.9}
                roughness={0.1}
            />
        </mesh>
    )
}

// Arma mejorada
function EnhancedWeapon({ color }: { color: string }) {
    const ref = useRef<THREE.Group>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        const t = clock.elapsedTime
        ref.current.position.z = 0.3 + Math.sin(t * 4) * 0.02
    })

    return (
        <group ref={ref} position={[0.5, 0.2, 0.3]} rotation={[0, 0, -Math.PI / 6]}>
            {/* Cañón principal */}
            <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.1, 0.8, 8]} />
                <meshStandardMaterial
                    color="#1e293b"
                    metalness={0.95}
                    roughness={0.1}
                    emissive={color}
                    emissiveIntensity={0.4}
                />
            </mesh>

            {/* Punta del arma */}
            <mesh position={[0, 0.5, 0]}>
                <coneGeometry args={[0.12, 0.3, 8]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={2}
                />
            </mesh>
        </group>
    )
}

// Aura de energía
function EnergyAura({ color }: { color: string }) {
    const ref = useRef<THREE.Mesh>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        const t = clock.elapsedTime
        ref.current.rotation.y = t * 0.5

        const scale = 1 + Math.sin(t * 2) * 0.1
        ref.current.scale.set(scale, scale, scale)

        const material = ref.current.material as THREE.MeshStandardMaterial
        material.opacity = 0.3 + Math.sin(t * 3) * 0.1
    })

    return (
        <mesh ref={ref}>
            <torusGeometry args={[0.8, 0.15, 16, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.5}
                transparent
                opacity={0.4}
            />
        </mesh>
    )
}

// Propulsores/Jetpack - Dinámicos según personaje
function Thrusters({ color, character }: { color: string; character: string }) {
    const leftRef = useRef<THREE.Mesh>(null)
    const rightRef = useRef<THREE.Mesh>(null)

    const thrusterScale = character === 'nox' ? 1.3 : 1
    const thrusterYPos = character === 'cipher' ? -0.35 : -0.3

    useFrame(({ clock }) => {
        if (!leftRef.current || !rightRef.current) return
        const t = clock.elapsedTime

        const intensity = 1 + Math.sin(t * 8) * 0.3

            ;[leftRef, rightRef].forEach((ref) => {
                const material = ref.current!.material as THREE.MeshStandardMaterial
                material.emissiveIntensity = intensity
            })
    })

    return (
        <>
            {/* Propulsor izquierdo */}
            <group position={[-0.25 * thrusterScale, thrusterYPos, -0.15]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.1 * thrusterScale, 0.12 * thrusterScale, 0.4, 8]} />
                    <meshStandardMaterial
                        color="#334155"
                        metalness={0.9}
                        roughness={0.2}
                    />
                </mesh>
                <mesh ref={leftRef} position={[0, -0.25, 0]}>
                    <coneGeometry args={[0.08 * thrusterScale, 0.2, 8]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={1.5}
                    />
                </mesh>
            </group>

            {/* Propulsor derecho */}
            <group position={[0.25 * thrusterScale, thrusterYPos, -0.15]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.1 * thrusterScale, 0.12 * thrusterScale, 0.4, 8]} />
                    <meshStandardMaterial
                        color="#334155"
                        metalness={0.9}
                        roughness={0.2}
                    />
                </mesh>
                <mesh ref={rightRef} position={[0, -0.25, 0]}>
                    <coneGeometry args={[0.08 * thrusterScale, 0.2, 8]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={1.5}
                    />
                </mesh>
            </group>
        </>
    )
}
