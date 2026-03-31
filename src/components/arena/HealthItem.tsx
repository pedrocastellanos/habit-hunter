import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HealthItemProps {
    position: [number, number, number]
}

export function HealthItem({ position }: HealthItemProps) {
    const meshRef = useRef<THREE.Group>(null)
    const [floatOffset] = useState(() => Math.random() * 100)

    useFrame((state) => {
        if (!meshRef.current) return
        const time = state.clock.elapsedTime
        meshRef.current.rotation.y = time * 2
        meshRef.current.position.y = position[1] + Math.sin(time * 3 + floatOffset) * 0.2
    })

    return (
        <group ref={meshRef} position={position}>
            {/* Cruz principal (roja) */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.6, 0.2, 0.2]} />
                <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.5} />
            </mesh>

            {/* Brillo externo (blanco/verde tenue) */}
            <mesh>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ff3333"
                    emissiveIntensity={1.2}
                    transparent
                    opacity={0.2}
                />
            </mesh>
        </group>
    )
}
