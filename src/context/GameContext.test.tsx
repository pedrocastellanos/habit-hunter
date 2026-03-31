import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { GameProvider } from './GameContext'
import { useGame } from './useGame'

describe('GameContext - useGame Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    vi.mocked(window.localStorage.getItem).mockReturnValue(null)
  })

  it('should provide game context value', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    expect(result.current).toBeDefined()
    expect(result.current.tasks).toBeDefined()
    expect(result.current.xp).toBeDefined()
    expect(result.current.level).toBeDefined()
  })

  it('should initialize with default tasks', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    expect(result.current.tasks.length).toBeGreaterThan(0)
    expect(result.current.xp).toBe(0)
    expect(result.current.level).toBe(1)
  })

  it('should allow adding tasks', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    const initialCount = result.current.tasks.length

    act(() => {
      result.current.addTask({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
      })
    })

    expect(result.current.tasks.length).toBe(initialCount + 1)
    expect(result.current.tasks[0].title).toBe('Test Task')
    expect(result.current.tasks[0].priority).toBe('medium')
  })

  it('should allow completing tasks', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    const taskId = result.current.tasks[0].id
    const initialXp = result.current.xp
    const taskReward = result.current.tasks[0].reward

    act(() => {
      result.current.completeTask(taskId)
    })

    const completedTask = result.current.tasks.find(t => t.id === taskId)
    expect(completedTask?.completed).toBe(true)
    expect(result.current.xp).toBe(initialXp + taskReward)
  })

  it('should allow reopening tasks', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    const taskId = result.current.tasks[0].id

    act(() => {
      result.current.completeTask(taskId)
    })

    expect(result.current.tasks.find(t => t.id === taskId)?.completed).toBe(true)

    act(() => {
      result.current.reopenTask(taskId)
    })

    expect(result.current.tasks.find(t => t.id === taskId)?.completed).toBe(false)
  })

  it('should allow removing tasks', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    const taskId = result.current.tasks[0].id
    const initialCount = result.current.tasks.length

    act(() => {
      result.current.removeTask(taskId)
    })

    expect(result.current.tasks.length).toBe(initialCount - 1)
    expect(result.current.tasks.find(t => t.id === taskId)).toBeUndefined()
  })

  it('should calculate level correctly based on XP', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    expect(result.current.level).toBe(1)

    act(() => {
      result.current.addXp(100)
    })

    expect(result.current.xp).toBe(100)
    expect(result.current.level).toBe(2)
  })

  it('should track completed task count', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    expect(result.current.completedTaskCount).toBe(0)

    act(() => {
      result.current.completeTask(result.current.tasks[0].id)
    })

    expect(result.current.completedTaskCount).toBe(1)
  })

  it('should provide character information', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    expect(result.current.characters.length).toBeGreaterThan(0)
    expect(result.current.selectedCharacter).toBeDefined()
    expect(result.current.selectedCharacter.id).toBeDefined()
  })

  it('should allow selecting characters', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    const secondCharacterId = result.current.characters[1]?.id

    if (secondCharacterId && secondCharacterId !== result.current.selectedCharacter.id) {
      act(() => {
        result.current.selectCharacter(secondCharacterId)
      })

      expect(result.current.selectedCharacter.id).toBe(secondCharacterId)
    }
  })

  it('should provide level progress', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    expect(result.current.levelProgress).toBeGreaterThanOrEqual(0)
    expect(result.current.levelProgress).toBeLessThanOrEqual(1)
  })

  it('should provide unlocked items set', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    expect(result.current.unlockedItemIds).toBeDefined()
    expect(result.current.unlockedItemIds.size).toBeGreaterThanOrEqual(0)
  })

  it('should not complete task if already completed', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    const taskId = result.current.tasks[0].id

    act(() => {
      result.current.completeTask(taskId)
    })

    const xpAfterFirstCompletion = result.current.xp

    act(() => {
      result.current.completeTask(taskId)
    })

    // XP should not change
    expect(result.current.xp).toBe(xpAfterFirstCompletion)
  })

  it('should persist multiple task operations', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    const initialCount = result.current.tasks.length

    act(() => {
      result.current.addTask({
        title: 'First Task',
        description: 'First',
        priority: 'low',
      })
      result.current.addTask({
        title: 'Second Task',
        description: 'Second',
        priority: 'high',
      })
    })

    expect(result.current.tasks.length).toBe(initialCount + 2)

    act(() => {
      result.current.completeTask(result.current.tasks[0].id)
    })

    expect(result.current.completedTaskCount).toBe(1)
  })
})

describe('GameContext - Task Validation', () => {
  it('should validate task structure', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    act(() => {
      result.current.addTask({
        title: 'Valid Task',
        description: 'Valid Description',
        priority: 'medium',
      })
    })

    const newTask = result.current.tasks[0]

    expect(newTask.id).toBeDefined()
    expect(newTask.title).toBe('Valid Task')
    expect(newTask.description).toBe('Valid Description')
    expect(newTask.priority).toBe('medium')
    expect(newTask.completed).toBe(false)
    expect(newTask.reward).toBeGreaterThan(0)
    expect(newTask.createdAt).toBeGreaterThan(0)
  })

  it('should trim whitespace from task inputs', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    })

    act(() => {
      result.current.addTask({
        title: '  Task with spaces  ',
        description: '  Description with spaces  ',
        priority: 'low',
      })
    })

    const newTask = result.current.tasks[0]
    expect(newTask.title).toBe('Task with spaces')
    expect(newTask.description).toBe('Description with spaces')
  })
})
