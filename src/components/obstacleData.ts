type MovingPlatformConfig = {
    position: [number, number, number]
    speed?: number
}

type RotatingBarrierConfig = {
    position: [number, number, number]
    speed?: number
}

type FloatingRingConfig = {
    position: [number, number, number]
}

type EnergyWallConfig = {
    position: [number, number, number]
    rotation?: [number, number, number]
}

const PERPENDICULAR_ROTATION: [number, number, number] = [0, Math.PI / 2, 0]

export const MOVING_PLATFORMS: MovingPlatformConfig[] = [
    { position: [-10, 0.5, 5] },
    { position: [12, 0.5, -8], speed: 0.8 },
    { position: [-8, 0.5, -12], speed: 1.1 },
    { position: [15, 0.5, 10], speed: 0.7 },
]

export const ROTATING_BARRIERS: RotatingBarrierConfig[] = [
    { position: [0, 1.5, 12] },
    { position: [8, 1.5, -10], speed: 1.2 },
    { position: [-10, 1.5, 8], speed: 0.9 },
]

export const FLOATING_RINGS: FloatingRingConfig[] = [
    { position: [-14, 3, -12] },
    { position: [14, 3.5, 10] },
    { position: [0, 4, -15] },
]

export const ENERGY_WALLS: EnergyWallConfig[] = [
    { position: [-18, 1.5, 0] },
    { position: [18, 1.5, 0], rotation: PERPENDICULAR_ROTATION },
    { position: [0, 1.5, -18], rotation: PERPENDICULAR_ROTATION },
    { position: [0, 1.5, 18], rotation: PERPENDICULAR_ROTATION },
]

export type ObstacleCollider = {
    x: number
    z: number
    radius: number
}

export function getObstacleColliders(elapsedSeconds: number): ObstacleCollider[] {
    const platformColliders = MOVING_PLATFORMS.map((platform) => {
        const speed = platform.speed ?? 1
        const x = platform.position[0] + Math.sin(elapsedSeconds * speed) * 3
        return { x, z: platform.position[2], radius: 1.8 }
    })

    const barrierColliders = ROTATING_BARRIERS.map((barrier) => ({
        x: barrier.position[0],
        z: barrier.position[2],
        radius: 2.1,
    }))

    const ringColliders = FLOATING_RINGS.map((ring) => ({
        x: ring.position[0],
        z: ring.position[2],
        radius: 1.3,
    }))

    const wallColliders = ENERGY_WALLS.map((wall) => ({
        x: wall.position[0],
        z: wall.position[2],
        radius: 2.2,
    }))

    return [...platformColliders, ...barrierColliders, ...ringColliders, ...wallColliders]
}
