import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SHOT_LIFETIME_MS } from '@/constants/arena'
import type { EnergyShot } from '@/types/arena'

export function PulseBeam({ shot }: { shot: EnergyShot }) {
    const projectileRef = useRef<THREE.Mesh>(null)

    const transform = useMemo(() => {
        const start = new THREE.Vector3(...shot.start)
        const end = new THREE.Vector3(...shot.end)
        const curve =
            shot.arcDrop === 0
                ? new THREE.LineCurve3(start, end)
                : new THREE.QuadraticBezierCurve3(
                    start,
                    start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, -shot.arcDrop, 0)),
                    end,
                )
        const projectileStart = curve.getPoint(0)
        const impactPosition: [number, number, number] = [end.x, end.y, end.z]

        return {
            curve,
            projectileStart,
            impactPosition,
        }
    }, [shot.arcDrop, shot.end, shot.start])

    useFrame(() => {
        if (!projectileRef.current) return
        const progress = THREE.MathUtils.clamp((Date.now() - shot.createdAt) / SHOT_LIFETIME_MS, 0, 1)
        const nextPosition = transform.curve.getPoint(progress)
        projectileRef.current.position.copy(nextPosition)
    })

    return (
        <group>
            <mesh>
                <tubeGeometry args={[transform.curve, 8, 0.08, 6, false]} />
                <meshBasicMaterial
                    color="#74efff"
                    transparent
                    opacity={0.45}
                />
            </mesh>
            <mesh>
                <tubeGeometry args={[transform.curve, 8, 0.035, 6, false]} />
                <meshBasicMaterial
                    color="#ffffff"
                />
            </mesh>

            <mesh ref={projectileRef} position={transform.projectileStart}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshBasicMaterial
                    color="#d5ffff"
                />
            </mesh>

            <mesh position={transform.impactPosition}>
                <sphereGeometry args={[0.15, 10, 10]} />
                <meshBasicMaterial
                    color="#9cf9ff"
                />
            </mesh>

            <mesh position={transform.impactPosition} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.2, 0.3, 10]} />
                <meshBasicMaterial
                    color="#74efff"
                    transparent
                    opacity={0.7}
                />
            </mesh>
        </group>
    )
}
