import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function TechTower({
    position,
    height = 5,
}: {
    position: [number, number, number]
    height?: number
}) {
    const ref = useRef<THREE.Group>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        const t = clock.elapsedTime
        ref.current.children.forEach((child, i) => {
            if (child instanceof THREE.Mesh) {
                const mat = child.material as THREE.MeshStandardMaterial
                mat.emissiveIntensity = 0.5 + Math.sin(t * 2 + i) * 0.3
            }
        })
    })

    return (
        <group ref={ref} position={position}>
            {/* Base */}
            <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color="#1e293b"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#334155"
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Torre principal */}
            <mesh castShadow position={[0, height / 2 + 1, 0]}>
                <cylinderGeometry args={[0.3, 0.4, height, 6]} />
                <meshStandardMaterial
                    color="#0f172a"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#3b82f6"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Luz superior */}
            <mesh position={[0, height + 1.5, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                    color="#06b6d4"
                    emissive="#06b6d4"
                    emissiveIntensity={2}
                />
            </mesh>

            {/* Point light desde la torre */}
            <pointLight
                position={[0, height + 1.5, 0]}
                color="#06b6d4"
                intensity={5}
                distance={8}
            />
        </group>
    )
}
