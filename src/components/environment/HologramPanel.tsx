import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function HologramPanel({
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
        const mat = ref.current.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.3
        mat.opacity = 0.4 + Math.sin(t * 2) * 0.1
        ref.current.position.y = position[1] + Math.sin(t * 1.5) * 0.1
    })

    return (
        <mesh ref={ref} position={position} rotation={rotation}>
            <planeGeometry args={[2, 1.5]} />
            <meshStandardMaterial
                color="#22d3ee"
                emissive="#22d3ee"
                emissiveIntensity={1}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}
