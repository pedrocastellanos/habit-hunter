import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ENERGY_WALLS, FLOATING_RINGS, MOVING_PLATFORMS, ROTATING_BARRIERS } from './obstacleData'

export function DynamicObstacles() {
    return (
        <>
            {MOVING_PLATFORMS.map((platform, index) => (
                <MovingPlatform key={`moving-platform-${index}`} position={platform.position} speed={platform.speed} />
            ))}

            {ROTATING_BARRIERS.map((barrier, index) => (
                <RotatingBarrier key={`rotating-barrier-${index}`} position={barrier.position} speed={barrier.speed} />
            ))}

            {FLOATING_RINGS.map((ring, index) => (
                <FloatingRings key={`floating-ring-${index}`} position={ring.position} />
            ))}

            {ENERGY_WALLS.map((wall, index) => (
                <EnergyWall key={`energy-wall-${index}`} position={wall.position} rotation={wall.rotation} />
            ))}
        </>
    )
}

// Plataforma móvil
function MovingPlatform({ position, speed = 1 }: { position: [number, number, number]; speed?: number }) {
    const ref = useRef<THREE.Mesh>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        const t = clock.elapsedTime * speed
        ref.current.position.x = position[0] + Math.sin(t) * 3
    })

    return (
        <mesh ref={ref} position={position} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.4, 2.5]} />
            <meshStandardMaterial
                color="#1a4d7a"
                emissive="#0ea5e9"
                emissiveIntensity={0.3}
                metalness={0.8}
                roughness={0.2}
            />
        </mesh>
    )
}

// Barrera giratoria
function RotatingBarrier({ position, speed = 1 }: { position: [number, number, number]; speed?: number }) {
    const ref = useRef<THREE.Group>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        ref.current.rotation.y = clock.elapsedTime * speed
    })

    return (
        <group ref={ref} position={position}>
            <mesh castShadow>
                <boxGeometry args={[4, 0.4, 0.4]} />
                <meshStandardMaterial
                    color="#dc2626"
                    emissive="#ef4444"
                    emissiveIntensity={1.2}
                    metalness={0.7}
                    roughness={0.3}
                />
            </mesh>
            <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[4, 0.4, 0.4]} />
                <meshStandardMaterial
                    color="#dc2626"
                    emissive="#ef4444"
                    emissiveIntensity={1.2}
                    metalness={0.7}
                    roughness={0.3}
                />
            </mesh>
        </group>
    )
}

// Anillos flotantes decorativos
function FloatingRings({ position }: { position: [number, number, number] }) {
    const ref = useRef<THREE.Group>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        const t = clock.elapsedTime
        ref.current.position.y = position[1] + Math.sin(t * 2) * 0.3
        ref.current.rotation.x = t * 0.5
        ref.current.rotation.z = t * 0.3
    })

    return (
        <group ref={ref} position={position}>
            <mesh>
                <torusGeometry args={[0.8, 0.08, 16, 32]} />
                <meshStandardMaterial
                    color="#a855f7"
                    emissive="#a855f7"
                    emissiveIntensity={1.5}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.1, 0.06, 16, 32]} />
                <meshStandardMaterial
                    color="#ec4899"
                    emissive="#ec4899"
                    emissiveIntensity={1.3}
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </group>
    )
}

// Muro de energía pulsante
function EnergyWall({
    position,
    rotation = [0, 0, 0],
}: {
    position: [number, number, number]
    rotation?: [number, number, number]
}) {
    const ref = useRef<THREE.Mesh>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        const t = clock.elapsedTime
        const material = ref.current.material as THREE.MeshStandardMaterial
        material.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.4
        material.opacity = 0.3 + Math.sin(t * 2) * 0.2
    })

    return (
        <mesh ref={ref} position={position} rotation={rotation}>
            <planeGeometry args={[0.1, 4]} />
            <meshStandardMaterial
                color="#06b6d4"
                emissive="#06b6d4"
                emissiveIntensity={1}
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}
