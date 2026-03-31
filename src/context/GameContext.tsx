import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type PropsWithChildren,
} from 'react'
import {
    CHARACTERS,
    DEFAULT_TASKS,
    getLevelFromXp,
    getLevelProgress,
    makeTaskId,
    PRIORITY_REWARD,
    UNLOCKABLE_ITEMS,
} from '@/game/catalog'
import type { Priority, Task } from '@/game/types'
import i18n from '@/i18n'
import { GameContext } from './game-context'
import {
    PLAYER_MAX_HEALTH,
    PLAYER_BASE_RESPAWN_COOLDOWN_MS,
    PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS,
    PLAYER_MAX_RESPAWN_COOLDOWN_MS,
} from '@/constants/arena'
import { combineStatModifiers, getEquipmentStatModifiers } from '@/game/equipmentStats'

type PersistedState = {
    tasks: Task[]
    xp: number
    selectedCharacterId: string
    equippedItemIds: string[]
    playerHealth: number
    playerDeaths: number
}

const STORAGE_KEY = 'habit-hunter-state-v1'
const MISSIONS_STORAGE_KEY = 'habit-hunter-missions-v1'
const CHARACTER_ID_SET = new Set(CHARACTERS.map((character) => character.id))
const ITEM_BY_ID = new Map(UNLOCKABLE_ITEMS.map((item) => [item.id, item]))
const PRIORITY_SET: Set<Priority> = new Set(['low', 'medium', 'high'])

function getLocalizedDefaultTasks(): Task[] {
    return [...DEFAULT_TASKS]
}

function createDefaultState(): PersistedState {
    return {
        tasks: getLocalizedDefaultTasks(),
        xp: 0,
        selectedCharacterId: CHARACTERS[0].id,
        equippedItemIds: [],
        playerHealth: PLAYER_MAX_HEALTH,
        playerDeaths: 0,
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

function sanitizeTask(taskLike: unknown): Task | null {
    if (!isRecord(taskLike)) return null

    const id = typeof taskLike.id === 'string' ? taskLike.id : makeTaskId()
    const title = typeof taskLike.title === 'string' ? taskLike.title.trim() : ''
    if (!title) return null

    const description = typeof taskLike.description === 'string' ? taskLike.description.trim() : ''
    const priority: Priority =
        typeof taskLike.priority === 'string' && PRIORITY_SET.has(taskLike.priority as Priority)
            ? (taskLike.priority as Priority)
            : 'medium'

    const completed = Boolean(taskLike.completed)
    const createdAt =
        typeof taskLike.createdAt === 'number' && Number.isFinite(taskLike.createdAt)
            ? Math.floor(taskLike.createdAt)
            : Date.now()

    return {
        id,
        title,
        description: description || i18n.t('tasks.noDescription'),
        priority,
        reward: PRIORITY_REWARD[priority],
        completed,
        createdAt,
    }
}

function sanitizeEquippedItems(equippedItemIdsLike: unknown, xp: number): string[] {
    if (!Array.isArray(equippedItemIdsLike)) return []

    const currentLevel = getLevelFromXp(xp)
    const equippedBySlot = new Map<string, string>()

    for (const idLike of equippedItemIdsLike) {
        if (typeof idLike !== 'string') continue
        const item = ITEM_BY_ID.get(idLike)
        if (!item || item.unlockLevel > currentLevel) continue
        equippedBySlot.set(item.slot, item.id)
    }

    return Array.from(equippedBySlot.values())
}

function sanitizePersistedState(stateLike: unknown): PersistedState {
    const defaultState = createDefaultState()
    if (!isRecord(stateLike)) return defaultState

    const xp =
        typeof stateLike.xp === 'number' && Number.isFinite(stateLike.xp) && stateLike.xp >= 0
            ? Math.floor(stateLike.xp)
            : 0

    const tasksFromStorage = Array.isArray(stateLike.tasks)
        ? stateLike.tasks.map(sanitizeTask).filter((task): task is Task => task !== null)
        : []

    const selectedCharacterId =
        typeof stateLike.selectedCharacterId === 'string' &&
            CHARACTER_ID_SET.has(stateLike.selectedCharacterId)
            ? stateLike.selectedCharacterId
            : CHARACTERS[0].id

    const playerHealth =
        typeof stateLike.playerHealth === 'number' && stateLike.playerHealth >= 0
            ? Math.floor(stateLike.playerHealth)
            : PLAYER_MAX_HEALTH

    const playerDeaths =
        typeof stateLike.playerDeaths === 'number' && stateLike.playerDeaths >= 0
            ? Math.floor(stateLike.playerDeaths)
            : 0

    return {
        tasks: tasksFromStorage.length > 0 ? tasksFromStorage : defaultState.tasks,
        xp,
        selectedCharacterId,
        equippedItemIds: sanitizeEquippedItems(stateLike.equippedItemIds, xp),
        playerHealth,
        playerDeaths,
    }
}

function serializeState(state: PersistedState): string {
    return JSON.stringify(state)
}

function serializeTasks(tasks: Task[]): string {
    return JSON.stringify(tasks)
}

function readPersistedTasks(rawValue?: string | null): Task[] {
    const raw =
        rawValue !== undefined
            ? rawValue
            : typeof window !== 'undefined'
                ? window.localStorage.getItem(MISSIONS_STORAGE_KEY)
                : null

    if (!raw) return []

    try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) return []
        return parsed.map(sanitizeTask).filter((task): task is Task => task !== null)
    } catch {
        return []
    }
}

function readPersistedState(rawValue?: string | null): PersistedState {
    const defaultState = createDefaultState()
    const raw =
        rawValue !== undefined
            ? rawValue
            : typeof window !== 'undefined'
                ? window.localStorage.getItem(STORAGE_KEY)
                : null

    try {
        if (!raw) {
            const missionsTasks = readPersistedTasks()
            return missionsTasks.length > 0 ? { ...defaultState, tasks: missionsTasks } : defaultState
        }

        const parsed = JSON.parse(raw) as unknown
        const sanitized = sanitizePersistedState(parsed)
        const missionsTasks = readPersistedTasks()

        if (missionsTasks.length === 0) return sanitized
        // El estado principal ya incluye tareas persistidas en STORAGE_KEY; solo usamos
        // la clave legacy de misiones como fallback cuando ese estado viene sin tareas.
        if (sanitized.tasks.length > 0) return sanitized

        return {
            ...sanitized,
            tasks: missionsTasks,
        }
    } catch {
        const missionsTasks = readPersistedTasks()
        return missionsTasks.length > 0 ? { ...defaultState, tasks: missionsTasks } : defaultState
    }
}

type AddTaskInput = {
    title: string
    description: string
    priority: Priority
}

export function GameProvider({ children }: PropsWithChildren) {
    const [state, setState] = useState<PersistedState>(readPersistedState)
    const lastSerializedRef = useRef(serializeState(state))

    useEffect(() => {
        if (typeof window === 'undefined') return

        const serialized = serializeState(state)
        if (serialized === lastSerializedRef.current) return

        window.localStorage.setItem(STORAGE_KEY, serialized)
        window.localStorage.setItem(MISSIONS_STORAGE_KEY, serializeTasks(state.tasks))
        lastSerializedRef.current = serialized
    }, [state])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const onStorage = (event: StorageEvent) => {
            if (event.storageArea !== window.localStorage) return

            if (event.key === STORAGE_KEY) {
                const nextState = readPersistedState(event.newValue)
                const nextSerialized = serializeState(nextState)
                lastSerializedRef.current = nextSerialized

                setState((current) =>
                    serializeState(current) === nextSerialized ? current : nextState,
                )
                return
            }

            if (event.key === MISSIONS_STORAGE_KEY) {
                const nextTasks = readPersistedTasks(event.newValue)

                setState((current) => {
                    const currentSerialized = serializeTasks(current.tasks)
                    const nextSerialized = serializeTasks(nextTasks)
                    if (currentSerialized === nextSerialized) return current

                    return {
                        ...current,
                        tasks: nextTasks,
                    }
                })
            }
        }

        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const syncFromStorage = () => {
            const nextState = readPersistedState()
            const nextSerialized = serializeState(nextState)
            lastSerializedRef.current = nextSerialized

            setState((current) =>
                serializeState(current) === nextSerialized ? current : nextState,
            )
        }

        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                syncFromStorage()
            }
        }

        window.addEventListener('focus', syncFromStorage)
        document.addEventListener('visibilitychange', onVisibilityChange)
        return () => {
            window.removeEventListener('focus', syncFromStorage)
            document.removeEventListener('visibilitychange', onVisibilityChange)
        }
    }, [])

    const level = useMemo(() => getLevelFromXp(state.xp), [state.xp])
    const levelProgress = useMemo(() => getLevelProgress(state.xp), [state.xp])

    const completedTaskCount = useMemo(
        () => state.tasks.filter((task) => task.completed).length,
        [state.tasks],
    )

    const selectedCharacter = useMemo(
        () =>
            CHARACTERS.find((character) => character.id === state.selectedCharacterId) ||
            CHARACTERS[0],
        [state.selectedCharacterId],
    )

    const unlockedItemIds = useMemo(() => {
        return new Set(
            UNLOCKABLE_ITEMS.filter((item) => item.unlockLevel <= level).map((item) => item.id),
        )
    }, [level])

    const playerState = useMemo(() => {
        const respawnCooldown = Math.min(
            PLAYER_BASE_RESPAWN_COOLDOWN_MS + (state.playerDeaths * PLAYER_RESPAWN_COOLDOWN_INCREMENT_MS),
            PLAYER_MAX_RESPAWN_COOLDOWN_MS,
        )
        return {
            health: state.playerHealth,
            maxHealth: PLAYER_MAX_HEALTH,
            deaths: state.playerDeaths,
            respawnCooldownMs: respawnCooldown,
            isDead: state.playerHealth <= 0,
            lastDeathTime: null,
        }
    }, [state.playerHealth, state.playerDeaths])

    const addTask = useCallback((input: AddTaskInput) => {
        setState((current) => {
            const nextTask: Task = {
                id: makeTaskId(),
                title: input.title.trim(),
                description: input.description.trim(),
                priority: input.priority,
                reward: PRIORITY_REWARD[input.priority],
                completed: false,
                createdAt: Date.now(),
            }

            return {
                ...current,
                tasks: [nextTask, ...current.tasks],
            }
        })
    }, [])

    const completeTask = useCallback((taskId: string) => {
        setState((current) => {
            const target = current.tasks.find((task) => task.id === taskId)
            if (!target || target.completed) return current

            const tasks = current.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: true } : task,
            )

            return {
                ...current,
                tasks,
                xp: current.xp + target.reward,
            }
        })
    }, [])

    const reopenTask = useCallback((taskId: string) => {
        setState((current) => ({
            ...current,
            tasks: current.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: false } : task,
            ),
        }))
    }, [])

    const removeTask = useCallback((taskId: string) => {
        setState((current) => ({
            ...current,
            tasks: current.tasks.filter((task) => task.id !== taskId),
        }))
    }, [])

    const selectCharacter = useCallback((characterId: string) => {
        if (!CHARACTER_ID_SET.has(characterId)) return

        setState((current) => ({
            ...current,
            selectedCharacterId: characterId,
        }))
    }, [])

    const toggleEquipItem = useCallback(
        (itemId: string) => {
            setState((current) => {
                if (!unlockedItemIds.has(itemId)) return current

                const isEquipped = current.equippedItemIds.includes(itemId)
                if (isEquipped) {
                    return {
                        ...current,
                        equippedItemIds: current.equippedItemIds.filter((id) => id !== itemId),
                    }
                }

                const incoming = UNLOCKABLE_ITEMS.find((item) => item.id === itemId)
                if (!incoming) return current

                const nextEquipped = current.equippedItemIds.filter((equippedId) => {
                    const equipped = UNLOCKABLE_ITEMS.find((item) => item.id === equippedId)
                    return equipped ? equipped.slot !== incoming.slot : true
                })

                return {
                    ...current,
                    equippedItemIds: [...nextEquipped, itemId],
                }
            })
        },
        [unlockedItemIds],
    )

    const addXp = useCallback((amount: number) => {
        setState((current) => ({
            ...current,
            xp: current.xp + amount,
        }))
    }, [])

    const damagePlayer = useCallback((amount: number) => {
        setState((current) => {
            const newHealth = Math.max(0, current.playerHealth - amount)
            return {
                ...current,
                playerHealth: newHealth,
            }
        })
    }, [])
    const healPlayer = useCallback((amount: number) => {
        setState((current) => {
            const newHealth = Math.min(PLAYER_MAX_HEALTH, current.playerHealth + amount)
            return {
                ...current,
                playerHealth: newHealth,
            }
        })
    }, [])
    const respawnPlayer = useCallback(() => {
        setState((current) => ({
            ...current,
            playerHealth: PLAYER_MAX_HEALTH,
            playerDeaths: current.playerDeaths + 1,
        }))
    }, [])

    const resetPlayerStats = useCallback(() => {
        setState((current) => ({
            ...current,
            playerHealth: PLAYER_MAX_HEALTH,
            playerDeaths: 0,
        }))
    }, [])

    const equipmentModifiers = useMemo(() => {
        const modifiers = state.equippedItemIds
            .map((id) => getEquipmentStatModifiers(id))
        return modifiers.length > 0 ? combineStatModifiers(...modifiers) : getEquipmentStatModifiers('')
    }, [state.equippedItemIds])

    const equippedEquipmentItems = useMemo(
        () => state.equippedItemIds.map((id) => UNLOCKABLE_ITEMS.find((item) => item.id === id)).filter((item) => item !== undefined),
        [state.equippedItemIds],
    )

    const value = useMemo(
        () => ({
            tasks: state.tasks,
            xp: state.xp,
            level,
            levelProgress,
            selectedCharacter,
            characters: CHARACTERS,
            items: UNLOCKABLE_ITEMS,
            unlockedItemIds,
            equippedItemIds: state.equippedItemIds,
            equippedEquipmentItems,
            equipmentModifiers,
            completedTaskCount,
            playerState,
            addTask,
            completeTask,
            reopenTask,
            removeTask,
            selectCharacter,
            toggleEquipItem,
            addXp,
            damagePlayer,
            healPlayer,
            respawnPlayer,
            resetPlayerStats,
        }),
        [
            addTask,
            completeTask,
            completedTaskCount,
            level,
            levelProgress,
            removeTask,
            reopenTask,
            selectCharacter,
            selectedCharacter,
            state.equippedItemIds,
            state.tasks,
            state.xp,
            toggleEquipItem,
            unlockedItemIds,
            addXp,
            playerState,
            damagePlayer,
            healPlayer,
            respawnPlayer,
            resetPlayerStats,
            equippedEquipmentItems,
            equipmentModifiers,
        ],
    )

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
