import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createEarthTexture, createMoonTexture } from './celestialTextures'

export function DistantEarth({
    position,
}: {
    position: [number, number, number]
}) {
    const ref = useRef<THREE.Mesh>(null)
    const texture = useMemo(() => createEarthTexture(), [])

    useFrame(() => {
        if (!ref.current) return
        ref.current.rotation.y += 0.00005 // Rotación muy lenta
    })

    return (
        <group position={position}>
            <mesh ref={ref} castShadow>
                <sphereGeometry args={[15, 64, 64]} />
                <meshStandardMaterial
                    map={texture}
                    metalness={0.2}
                    roughness={0.7}
                    toneMapped={false}
                />
            </mesh>

            {/* Algo de luz atmosférica */}
            <pointLight color="#4da6ff" intensity={1} distance={40} />
        </group>
    )
}

export function DistantMoon({
    position,
}: {
    position: [number, number, number]
}) {
    const ref = useRef<THREE.Mesh>(null)
    const texture = useMemo(() => createMoonTexture(), [])

    useFrame(() => {
        if (!ref.current) return
        ref.current.rotation.y += 0.00003 // Rotación aun más lenta
    })

    return (
        <group position={position}>
            <mesh ref={ref} castShadow>
                <sphereGeometry args={[8, 64, 64]} />
                <meshStandardMaterial
                    map={texture}
                    metalness={0.1}
                    roughness={0.9}
                    toneMapped={false}
                />
            </mesh>

            {/* Luz tenue de la luna */}
            <pointLight color="#e6f2ff" intensity={0.8} distance={30} />
        </group>
    )
}
