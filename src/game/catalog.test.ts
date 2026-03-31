import { describe, it, expect } from 'vitest'
import {
  getLevelFromXp,
  getLevelProgress,
  makeTaskId,
  LEVEL_STEP,
  PRIORITY_REWARD,
  PRIORITY_LABEL,
  PRIORITY_TO_DIFFICULTY,
  CHARACTERS,
  UNLOCKABLE_ITEMS,
  DEFAULT_TASKS,
} from './catalog'

describe('Catalog - Level Calculations', () => {
  it('should calculate level correctly from XP', () => {
    expect(getLevelFromXp(0)).toBe(1)
    expect(getLevelFromXp(99)).toBe(1)
    expect(getLevelFromXp(100)).toBe(2)
    expect(getLevelFromXp(199)).toBe(2)
    expect(getLevelFromXp(200)).toBe(3)
    expect(getLevelFromXp(1000)).toBe(11)
  })

  it('should calculate level progress correctly', () => {
    expect(getLevelProgress(0)).toBe(0)
    expect(getLevelProgress(50)).toBe(0.5)
    expect(getLevelProgress(99)).toBeCloseTo(0.99)
    expect(getLevelProgress(100)).toBe(0)
    expect(getLevelProgress(150)).toBe(0.5)
  })

  it('should handle edge cases for level calculations', () => {
    expect(getLevelFromXp(-100)).toBe(0)
    expect(getLevelProgress(-50)).toBeCloseTo(-0.5)
    expect(getLevelFromXp(Infinity)).toBeGreaterThan(1)
  })
})

describe('Catalog - Priority System', () => {
  it('should have consistent priority labels', () => {
    expect(PRIORITY_LABEL).toHaveProperty('low')
    expect(PRIORITY_LABEL).toHaveProperty('medium')
    expect(PRIORITY_LABEL).toHaveProperty('high')
    expect(PRIORITY_LABEL.low).toBe('Baja')
    expect(PRIORITY_LABEL.medium).toBe('Media')
    expect(PRIORITY_LABEL.high).toBe('Alta')
  })

  it('should have correct reward values', () => {
    expect(PRIORITY_REWARD.low).toBe(25)
    expect(PRIORITY_REWARD.medium).toBe(50)
    expect(PRIORITY_REWARD.high).toBe(90)
    expect(PRIORITY_REWARD.low).toBeLessThan(PRIORITY_REWARD.medium)
    expect(PRIORITY_REWARD.medium).toBeLessThan(PRIORITY_REWARD.high)
  })

  it('should map priorities to difficulties correctly', () => {
    expect(PRIORITY_TO_DIFFICULTY.low).toBe('easy')
    expect(PRIORITY_TO_DIFFICULTY.medium).toBe('medium')
    expect(PRIORITY_TO_DIFFICULTY.high).toBe('hard')
  })
})

describe('Catalog - Characters', () => {
  it('should have valid characters', () => {
    expect(CHARACTERS.length).toBeGreaterThan(0)
    expect(CHARACTERS.length).toBeGreaterThanOrEqual(2)
  })

  it('should have cipher character', () => {
    const cipher = CHARACTERS.find(c => c.id === 'cipher')
    expect(cipher).toBeDefined()
    expect(cipher?.name).toBe('Cipher')
    expect(cipher?.role).toBeDefined()
    expect(cipher?.description).toBeDefined()
    expect(cipher?.accent).toBeDefined()
  })

  it('should have vanta character', () => {
    const vanta = CHARACTERS.find(c => c.id === 'vanta')
    expect(vanta).toBeDefined()
    expect(vanta?.name).toBe('Vanta')
  })

  it('should have unique character IDs', () => {
    const ids = CHARACTERS.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(ids.length).toBe(uniqueIds.size)
  })
})

describe('Catalog - Unlockable Items', () => {
  it('should have valid items', () => {
    expect(UNLOCKABLE_ITEMS.length).toBeGreaterThan(0)
  })

  it('should have items with required properties', () => {
    UNLOCKABLE_ITEMS.forEach(item => {
      expect(item.id).toBeDefined()
      expect(item.name).toBeDefined()
      expect(item.slot).toMatch(/weapon|shield|accessory/)
      expect(item.unlockLevel).toBeGreaterThan(0)
      expect(item.accent).toBeDefined()
    })
  })

  it('should have weapon items', () => {
    const weapons = UNLOCKABLE_ITEMS.filter(i => i.slot === 'weapon')
    expect(weapons.length).toBeGreaterThan(0)
  })

  it('should have shield items', () => {
    const shields = UNLOCKABLE_ITEMS.filter(i => i.slot === 'shield')
    expect(shields.length).toBeGreaterThan(0)
  })

  it('should have accessory items', () => {
    const accessories = UNLOCKABLE_ITEMS.filter(i => i.slot === 'accessory')
    expect(accessories.length).toBeGreaterThan(0)
  })

  it('should have unique item IDs', () => {
    const ids = UNLOCKABLE_ITEMS.map(i => i.id)
    const uniqueIds = new Set(ids)
    expect(ids.length).toBe(uniqueIds.size)
  })
})

describe('Catalog - Default Tasks', () => {
  it('should have default tasks', () => {
    expect(DEFAULT_TASKS.length).toBeGreaterThan(0)
  })

  it('should have valid task structure', () => {
    DEFAULT_TASKS.forEach(task => {
      expect(task.id).toBeDefined()
      expect(task.title).toBeDefined()
      expect(task.priority).toMatch(/low|medium|high/)
      expect(task.reward).toBeGreaterThan(0)
      expect(task.completed).toBe(false)
      expect(task.createdAt).toBeGreaterThan(0)
    })
  })

  it('should have tasks with correct rewards based on priority', () => {
    DEFAULT_TASKS.forEach(task => {
      expect(task.reward).toBe(PRIORITY_REWARD[task.priority])
    })
  })
})

describe('Catalog - Task ID Generation', () => {
  it('should generate unique task IDs', () => {
    const id1 = makeTaskId()
    const id2 = makeTaskId()
    expect(id1).not.toBe(id2)
  })

  it('should generate task IDs as strings', () => {
    const id = makeTaskId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('should generate valid task ID format', () => {
    const id = makeTaskId()
    // Should be UUID or task-timestamp-random format
    expect(id).toMatch(/^[\da-f-]+$|^task-\d+-\d+$/)
  })
})

describe('Catalog - Constants', () => {
  it('should have correct LEVEL_STEP', () => {
    expect(LEVEL_STEP).toBe(100)
  })

  it('should export resource objects', () => {
    expect(PRIORITY_LABEL).toBeDefined()
    expect(PRIORITY_REWARD).toBeDefined()
    expect(PRIORITY_TO_DIFFICULTY).toBeDefined()
    expect(CHARACTERS).toBeDefined()
    expect(UNLOCKABLE_ITEMS).toBeDefined()
    expect(DEFAULT_TASKS).toBeDefined()
  })
})
