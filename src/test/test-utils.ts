import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { vi } from 'vitest'
import i18n from '@/i18n'
import { GameProvider } from '@/context/GameContext'

const Wrapper = (props: { children?: React.ReactNode }) =>
  React.createElement(BrowserRouter, null,
    React.createElement(I18nextProvider, { i18n },
      React.createElement(GameProvider, null,
        props.children
      )
    )
  )

export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = '/',
    ...renderOptions
  }: { route?: string } & Omit<RenderOptions, 'wrapper'> = {},
) {
  window.history.pushState({}, 'Test page', route)
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Wait for async operations with helpful error messages
 */
export async function waitForAsync(callback: () => void, timeout = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback()
      resolve(null)
    }, timeout)
  })
}

/**
 * Mock task data for testing
 */
export const mockTask = {
  id: 'test-task-1',
  title: 'Test Task',
  description: 'Test Description',
  priority: 'medium' as const,
  reward: 50,
  completed: false,
  createdAt: Date.now(),
}

/**
 * Mock character data for testing
 */
export const mockCharacter = {
  id: 'cipher',
  name: 'Cipher',
  role: 'Arquitecta del sistema',
  description: 'Especialista en estabilizar nodos de enfoque.',
  accent: '#33d0ff',
  trail: 'Haz de datos turquesa',
}

/**
 * Mock item data for testing
 */
export const mockItem = {
  id: 'weapon-pulse-blaster',
  name: 'Pulse Blaster',
  description: 'Reliable blade forged from discipline.',
  slot: 'weapon' as const,
  unlockLevel: 1,
  accent: '#00ffff',
}

/**
 * Create mock game state for testing
 */
export function createMockGameState(overrides = {}) {
  return {
    tasks: [mockTask],
    xp: 0,
    level: 1,
    levelProgress: 0,
    completedTaskCount: 0,
    selectedCharacter: mockCharacter,
    characters: [mockCharacter],
    items: [mockItem],
    unlockedItemIds: new Set(['weapon-pulse-blaster']),
    equippedItemIds: [],
    addTask: vi.fn(),
    completeTask: vi.fn(),
    reopenTask: vi.fn(),
    removeTask: vi.fn(),
    selectCharacter: vi.fn(),
    toggleEquipItem: vi.fn(),
    addXp: vi.fn(),
    ...overrides,
  }
}

/**
 * Mock localStorage operations
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key])
    },
  }
}

// Re-export everything from testing library for convenience
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
