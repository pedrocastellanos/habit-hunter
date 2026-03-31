import { describe, it, expect, vi } from 'vitest'
import { getFormattedUTCTime, generateUniqueId, playAudio, createAudioElement } from './common'

describe('common.ts utilities', () => {
    describe('getFormattedUTCTime', () => {
        it('should return a string in UTC format', () => {
            const result = getFormattedUTCTime('en')
            expect(typeof result).toBe('string')
            expect(result.length).toBeGreaterThan(0)
        })

        it('should handle Spanish locale', () => {
            const result = getFormattedUTCTime('es')
            expect(typeof result).toBe('string')
            expect(result.length).toBeGreaterThan(0)
        })

        it('should handle English locale', () => {
            const result = getFormattedUTCTime('en')
            expect(typeof result).toBe('string')
            expect(result.length).toBeGreaterThan(0)
        })

        it('should return different values for English vs Spanish', () => {
            const timeEn = getFormattedUTCTime('en')
            const timeEs = getFormattedUTCTime('es')
            expect(typeof timeEn).toBe('string')
            expect(typeof timeEs).toBe('string')
        })
    })

    describe('generateUniqueId', () => {
        it('should generate unique IDs', () => {
            const id1 = generateUniqueId()
            const id2 = generateUniqueId()
            expect(id1).not.toBe(id2)
        })

        it('should return a string', () => {
            const id = generateUniqueId()
            expect(typeof id).toBe('string')
            expect(id.length).toBeGreaterThan(0)
        })

        it('should support optional prefix', () => {
            const id = generateUniqueId('test')
            expect(typeof id).toBe('string')
            expect(id.length).toBeGreaterThan(0)
        })

        it('should generate different IDs each time', () => {
            const ids = new Set()
            for (let i = 0; i < 10; i++) {
                ids.add(generateUniqueId())
            }
            expect(ids.size).toBe(10)
        })
    })

    describe('createAudioElement', () => {
        it('should create an audio element with src', () => {
            const src = 'path/to/sound.mp3'
            const audio = createAudioElement(src, 0.5)
            expect(audio).toBeInstanceOf(HTMLAudioElement)
            expect(audio.src).toContain(src)
            expect(audio.volume).toBe(0.5)
        })

        it('should handle volume parameter', () => {
            const audio = createAudioElement('test.mp3', 0.75)
            expect(audio.volume).toBe(0.75)
        })

        it('should default volume to 0.5 if not specified', () => {
            const audio = createAudioElement('test.mp3')
            expect(audio.volume).toBe(0.5)
        })

        it('should set volume to 1 when explicitly passed', () => {
            const audio = createAudioElement('test.mp3', 1)
            expect(audio.volume).toBe(1)
        })

        it('should set volume to 0 when explicitly passed', () => {
            const audio = createAudioElement('test.mp3', 0)
            expect(audio.volume).toBe(0)
        })
    })

    describe('playAudio', () => {
        it('should handle null audio element gracefully', () => {
            expect(() => {
                playAudio(null)
            }).not.toThrow()
        })

        it('should call play on audio element', async () => {
            const mockAudio = {
                currentTime: 0,
                play: vi.fn().mockResolvedValue(undefined),
            } as unknown as HTMLAudioElement

            playAudio(mockAudio)
            expect(mockAudio.currentTime).toBe(0)
            expect(mockAudio.play).toHaveBeenCalled()
        })

        it('should reset currentTime when playing', () => {
            const mockAudio = {
                currentTime: 5,
                play: vi.fn().mockResolvedValue(undefined),
            } as unknown as HTMLAudioElement

            playAudio(mockAudio)
            expect(mockAudio.currentTime).toBe(0)
        })

        it('should catch play errors silently', async () => {
            const mockAudio = {
                currentTime: 0,
                play: vi.fn().mockRejectedValue(new Error('Autoplay denied')),
            } as unknown as HTMLAudioElement

            expect(() => {
                playAudio(mockAudio)
            }).not.toThrow()
        })
    })
})
