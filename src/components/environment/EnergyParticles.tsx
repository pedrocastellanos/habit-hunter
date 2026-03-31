import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function EnergyParticles() {
    const particlesRef = useRef<THREE.Points>(null)

    useFrame(({ clock }) => {
        if (!particlesRef.current) return
        particlesRef.current.rotation.y = clock.elapsedTime * 0.05
    })

    const particleCount = 250
    const [positions] = useState(() => {
        const arr = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 60
            arr[i * 3 + 1] = Math.random() * 12 + 1
            arr[i * 3 + 2] = (Math.random() - 0.5) * 60
        }
        return arr
    })

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color="#60a5fa"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    )
}
