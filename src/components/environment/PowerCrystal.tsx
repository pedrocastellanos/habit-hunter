import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function PowerCrystal({
    position,
    color = '#00ffff',
}: {
    position: [number, number, number]
    color?: string
}) {
    const ref = useRef<THREE.Group>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        const t = clock.elapsedTime
        ref.current.rotation.y = t * 0.8
        ref.current.position.y = position[1] + Math.sin(t * 2) * 0.2

        const scale = 1 + Math.sin(t * 3) * 0.1
        ref.current.scale.set(scale, scale, scale)
    })

    return (
        <group ref={ref} position={position}>
            <mesh castShadow>
                <octahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={2}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Anillo alrededor del cristal */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.7, 0.05, 16, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.5}
                />
            </mesh>

            <pointLight color={color} intensity={3} distance={5} />
        </group>
    )
}
