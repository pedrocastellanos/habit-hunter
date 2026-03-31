import * as THREE from 'three'
import type { MinimapData, MinimapMission, MinimapObstacle, MinimapRoamer } from '@/types/arena'
import type { Task } from '@/game/types'
import type { RoamingEnemyData } from '@/types/arena'
import { getObstacleColliders } from '@/components/obstacleData'

/**
 * Convert 3D world position to camera position (add height offset)
 */
export function getCameraPosition(playerPosition: [number, number, number]): [number, number, number] {
    const CAMERA_HEIGHT = 1.55
    return [playerPosition[0], playerPosition[1] + CAMERA_HEIGHT, playerPosition[2]]
}

/**
 * Calculate shot start position considering camera offset and direction
 */
export function getShotStart(
    playerPosition: [number, number, number],
    yaw: number,
    pitch: number,
): [number, number, number] {
    const SHOT_START_FORWARD_OFFSET = 0.34
    const SHOT_START_LATERAL_OFFSET = 0.14
    const SHOT_START_VERTICAL_OFFSET = -0.04

    const [x, y, z] = getCameraPosition(playerPosition)
    const direction = new THREE.Vector3(
        -Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch),
    ).normalize()
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).normalize()
    const start = new THREE.Vector3(x, y + SHOT_START_VERTICAL_OFFSET, z)
        .add(direction.multiplyScalar(SHOT_START_FORWARD_OFFSET))
        .add(right.multiplyScalar(SHOT_START_LATERAL_OFFSET))

    return [start.x, start.y, start.z]
}

/**
 * Generate deterministic enemy position based on task ID
 */
export function computeEnemyPosition(taskId: string, index: number): [number, number, number] {
    const seed = hash(taskId)
    const angle = (seed % 360) * (Math.PI / 180)
    const radius = 8 + (seed % 50) + (index % 5) * 5
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = 1.5 + ((seed >> 2) % 5) * 0.15
    return [Number(x.toFixed(2)), Number(y.toFixed(2)), Number(z.toFixed(2))]
}

/**
 * Simple hash function for deterministic positioning
 */
export function hash(value: string): number {
    let h = 0
    for (let i = 0; i < value.length; i += 1) {
        h = (h << 5) - h + value.charCodeAt(i)
        h |= 0
    }
    return Math.abs(h)
}

/**
 * Check collision with obstacles
 */
export function avoidObstacleCollision(
    nextX: number,
    nextZ: number,
    previousX: number,
    previousZ: number,
    elapsedSeconds: number,
): [number, number] {
    const COLLISION_RADIUS = 1.05
    const COLLISION_PADDING = 0.45

    const colliders = getObstacleColliders(elapsedSeconds)
    for (const collider of colliders) {
        const dx = nextX - collider.x
        const dz = nextZ - collider.z
        const minDistance = collider.radius + COLLISION_RADIUS + COLLISION_PADDING
        if (dx * dx + dz * dz < minDistance * minDistance) {
            return [previousX, previousZ]
        }
    }
    return [nextX, nextZ]
}

/**
 * Generate minimap data from world state
 */
export function generateMinimapData(
    playerPosition: [number, number, number],
    tasks: Task[],
    roamingEnemies: RoamingEnemyData[],
    enemyPositions: Map<string, [number, number, number]>,
    elapsedSeconds: number,
): MinimapData {
    const MINIMAP_SCALE = 1.2

    const scale = MINIMAP_SCALE
    const translate = (value: number) => 50 + value * scale

    const obstacles: MinimapObstacle[] = getObstacleColliders(elapsedSeconds).map((obstacle, index) => ({
        id: `o-${index}`,
        x: translate(obstacle.x),
        y: translate(obstacle.z),
    }))

    const missions: MinimapMission[] = tasks.map((task) => {
        const position = enemyPositions.get(task.id) ?? [0, 0, 0]
        return {
            id: task.id,
            x: translate(position[0]),
            y: translate(position[2]),
            completed: task.completed,
            priority: task.priority,
        }
    })

    const roamers: MinimapRoamer[] = roamingEnemies.map((r) => ({
        id: r.id,
        x: translate(r.position[0]),
        y: translate(r.position[2]),
    }))

    const player = {
        x: translate(playerPosition[0]),
        y: translate(playerPosition[2]),
    }

    return { obstacles, missions, roamers, player }
}

/**
 * Calculate shot arc drop (currently kept at 0 for straight trajectory)
 */
export function computeShotArcDrop(): number {
    return 0
}
