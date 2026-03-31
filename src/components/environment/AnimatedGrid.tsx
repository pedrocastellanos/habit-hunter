import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function AnimatedGrid() {
    const ref = useRef<THREE.GridHelper>(null)

    useFrame(({ clock }) => {
        if (!ref.current) return
        const material = ref.current.material as THREE.LineBasicMaterial
        material.opacity = 0.3 + Math.sin(clock.elapsedTime * 0.5) * 0.1
    })

    return (
        <gridHelper
            ref={ref}
            args={[80, 100, '#3b82f6', '#1e3a8a']}
            position={[0, 0.08, 0]}
        />
    )
}
