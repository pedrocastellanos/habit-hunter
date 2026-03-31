// Arena Physics & Movement
import type { Priority } from '@/game/types'

export const MOVE_SPEED = 0.2
export const JUMP_FORCE = 0.24
export const GRAVITY = 0.018
export const GROUND_LEVEL = 0.7
export const CLAMP = 38 // Mundo abierto
export const CAMERA_HEIGHT = 1.55

// Shots & Weapons
export const MAX_SHOT_DISTANCE = 22
export const SHOT_START_FORWARD_OFFSET = 0.34
export const SHOT_START_LATERAL_OFFSET = 0.14
export const SHOT_START_VERTICAL_OFFSET = -0.04
export const SHOT_LIFETIME_MS = 260

// Collision
export const COLLISION_RADIUS = 1.05
export const COLLISION_PADDING = 0.45

// Camera
export const RADIANS_TO_DEGREES = 180 / Math.PI
export const MOUSE_SENSITIVITY_X = 0.0028
export const MOUSE_SENSITIVITY_Y = 0.0022
export const MAX_PITCH_ANGLE = 1.15

// DOM & UI
export const ARENA_CANVAS_SELECTOR = '.battle-zone canvas'

// Roaming Enemies
export const ROAMER_ATTACK_DISTANCE = 8
export const ROAMER_ATTACK_COOLDOWN = 1200 // ms
export const ROAMER_SPAWN_INTERVAL = 3500 // ms
export const ROAMER_MAX_COUNT = 15
export const ROAMER_SPAWN_INNER_RADIUS = 15
export const ROAMER_SPAWN_OUTER_RADIUS = 35
export const ROAMER_INITIAL_HEALTH = 2

// Graphics
export const ARENA_GRID_PATTERN_SIZE = 40 // px
export const ARENA_MINIMAP_SCALE = 1.2

// Task Health System
export const PRIORITY_HEALTH: Record<Priority, number> = {
    low: 1,
    medium: 2,
    high: 3,
}

// Player Health System
export const PLAYER_MAX_HEALTH = 6
export const PLAYER_DAMAGE_PER_HIT = 1
export const PLAYER_BASE_RESPAWN_COOLDOWN_MS = 3000 // 3 segundos
export const PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS = 2000 // +2 segundos por muerte
export const PLAYER_MAX_RESPAWN_COOLDOWN_MS = 30000 // Máximo 30 segundos
