import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { XpPopupData } from '@/types/arena'
import * as THREE from 'three'

export function XpPopupEffect({ popup }: { popup: XpPopupData }) {
    const groupRef = useRef<THREE.Group>(null)
    const [opacity, setOpacity] = useState(1)

    useFrame(() => {
        if (!groupRef.current) return
        const elapsed = Date.now() - popup.createdAt
        const progress = Math.min(elapsed / 1000, 1)

        groupRef.current.position.y = popup.position[1] + 1 + progress * 2.5
        setOpacity(1 - Math.pow(progress, 2))
    })

    return (
        <group ref={groupRef} position={[popup.position[0], popup.position[1] + 1, popup.position[2]]}>
            <Html center style={{ pointerEvents: 'none' }}>
                <div style={{
                    color: '#2bff9b',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    textShadow: '0 0 8px rgba(43, 255, 155, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
                    opacity: opacity,
                    transform: `scale(${1 + opacity * 0.5})`,
                    whiteSpace: 'nowrap'
                }}>
                    +{popup.amount} XP
                </div>
            </Html>
        </group>
    )
}
