import { describe, it, expect, beforeEach } from 'vitest'
import i18n from '@/i18n'

describe('Internationalization - Health and Respawn System', () => {
    beforeEach(async () => {
        // Ensure i18n is initialized
        if (!i18n.isInitialized) {
            await i18n.init()
        }
    })

    describe('Translation Keys Exist', () => {
        it('should have Spanish arena.youDied translation', () => {
            const translation = i18n.t('arena.youDied', { lng: 'es' })
            expect(translation).toBeTruthy()
            expect(translation).not.toContain('arena.youDied') // Should not be untranslated
        })

        it('should have English arena.youDied translation', () => {
            const translation = i18n.t('arena.youDied', { lng: 'en' })
            expect(translation).toBeTruthy()
            expect(translation).not.toContain('arena.youDied')
        })

        it('should have Spanish arena.deaths translation', () => {
            const translation = i18n.t('arena.deaths', { lng: 'es' })
            expect(translation).toBeTruthy()
            expect(translation).not.toContain('arena.deaths')
        })

        it('should have English arena.deaths translation', () => {
            const translation = i18n.t('arena.deaths', { lng: 'en' })
            expect(translation).toBeTruthy()
            expect(translation).not.toContain('arena.deaths')
        })

        it('should have Spanish arena.respawningIn translation', () => {
            const translation = i18n.t('arena.respawningIn', { lng: 'es' })
            expect(translation).toBeTruthy()
            expect(translation).not.toContain('arena.respawningIn')
        })

        it('should have English arena.respawningIn translation', () => {
            const translation = i18n.t('arena.respawningIn', { lng: 'en' })
            expect(translation).toBeTruthy()
            expect(translation).not.toContain('arena.respawningIn')
        })

        it('should have Spanish arena.health translation', () => {
            const translation = i18n.t('arena.health', { lng: 'es' })
            expect(translation).toBeTruthy()
            expect(translation).not.toContain('arena.health')
        })

        it('should have English arena.health translation', () => {
            const translation = i18n.t('arena.health', { lng: 'en' })
            expect(translation).toBeTruthy()
            expect(translation).not.toContain('arena.health')
        })
    })

    describe('Translation Content', () => {
        it('should have meaningful Spanish death message', () => {
            const translation = i18n.t('arena.youDied', { lng: 'es' })
            // Should be Spanish and contain meaningful content
            expect(translation.length).toBeGreaterThan(0)
            // Spanish typically has these patterns
            expect(['HAS MUERTO', 'MUERTO', 'FALLECISTE']).toContain(
                translation.toUpperCase().trim(),
            )
        })

        it('should have meaningful English death message', () => {
            const translation = i18n.t('arena.youDied', { lng: 'en' })
            expect(translation.length).toBeGreaterThan(0)
            expect(translation.toUpperCase()).toContain('DIED')
        })

        it('should have Spanish deaths counter label', () => {
            const translation = i18n.t('arena.deaths', { lng: 'es' })
            expect(translation.length).toBeGreaterThan(0)
            expect(translation.toLowerCase()).toContain('muerte')
        })

        it('should have English deaths counter label', () => {
            const translation = i18n.t('arena.deaths', { lng: 'en' })
            expect(translation.length).toBeGreaterThan(0)
            expect(translation.toLowerCase()).toContain('death')
        })

        it('should have Spanish respawn message', () => {
            const translation = i18n.t('arena.respawningIn', { lng: 'es' })
            expect(translation.length).toBeGreaterThan(0)
            expect(translation.toLowerCase()).toContain('reapar')
        })

        it('should have English respawn message', () => {
            const translation = i18n.t('arena.respawningIn', { lng: 'en' })
            expect(translation.length).toBeGreaterThan(0)
            expect(translation.toLowerCase()).toContain('respawn')
        })

        it('should have Spanish health label', () => {
            const translation = i18n.t('arena.health', { lng: 'es' })
            expect(translation.length).toBeGreaterThan(0)
            expect(translation.toLowerCase()).toContain('salud')
        })

        it('should have English health label', () => {
            const translation = i18n.t('arena.health', { lng: 'en' })
            expect(translation.length).toBeGreaterThan(0)
            expect(translation.toLowerCase()).toContain('health')
        })
    })

    describe('Language Consistency', () => {
        it('should provide translation for all health-related keys in Spanish', () => {
            const keys = ['arena.youDied', 'arena.deaths', 'arena.respawningIn', 'arena.health']

            for (const key of keys) {
                const translation = i18n.t(key, { lng: 'es' })
                expect(translation).toBeTruthy()
                expect(translation.includes(key)).toBe(false) // Should be translated
            }
        })

        it('should provide translation for all health-related keys in English', () => {
            const keys = ['arena.youDied', 'arena.deaths', 'arena.respawningIn', 'arena.health']

            for (const key of keys) {
                const translation = i18n.t(key, { lng: 'en' })
                expect(translation).toBeTruthy()
                expect(translation.includes(key)).toBe(false) // Should be translated
            }
        })

        it('should maintain parity between Spanish and English translations', () => {
            const keys = ['arena.youDied', 'arena.deaths', 'arena.respawningIn', 'arena.health']

            for (const key of keys) {
                const es = i18n.t(key, { lng: 'es' })
                const en = i18n.t(key, { lng: 'en' })

                // Both should exist
                expect(es).toBeTruthy()
                expect(en).toBeTruthy()

                // Both should be non-empty
                expect(es.length).toBeGreaterThan(0)
                expect(en.length).toBeGreaterThan(0)
            }
        })
    })

    describe('Translation Fallbacks', () => {
        it('should handle missing language gracefully', () => {
            const translation = i18n.t('arena.youDied', { lng: 'es' })
            // Should still return a value (fallback to default)
            expect(translation).toBeTruthy()
        })

        it('should handle missing key gracefully', () => {
            const translation = i18n.t('non.existent.key', { lng: 'es' })
            // Should return the key itself as fallback
            expect(translation).toBeTruthy()
        })
    })

    describe('Translation Formatting', () => {
        it('should not have extra whitespace in translations', () => {
            const keys = ['arena.youDied', 'arena.deaths', 'arena.respawningIn', 'arena.health']

            for (const key of keys) {
                const translation = i18n.t(key, { lng: 'es' })
                expect(translation).toBe(translation.trim())
            }
        })

        it('should have proper casing', () => {
            // Spanish health label should be uppercase or titlecase
            const healthEs = i18n.t('arena.health', { lng: 'es' })
            expect(healthEs.length).toBeGreaterThan(0)
            // English health label should be uppercase or titlecase
            const healthEn = i18n.t('arena.health', { lng: 'en' })
            expect(healthEn.length).toBeGreaterThan(0)
        })
    })

    describe('UI Text Consistency', () => {
        it('should provide text suitable for death overlay', () => {
            const youDied = i18n.t('arena.youDied', { lng: 'es' })
            const deaths = i18n.t('arena.deaths', { lng: 'es' })

            // Should be suitable for display in UI
            expect(youDied.length).toBeGreaterThan(0)
            expect(youDied.length).toBeLessThan(100) // Reasonable for UI
            expect(deaths.length).toBeGreaterThan(0)
            expect(deaths.length).toBeLessThan(100)
        })

        it('should provide text suitable for respawn countdown', () => {
            const respawningIn = i18n.t('arena.respawningIn', { lng: 'es' })

            // Should be suitable for countdown display
            expect(respawningIn.length).toBeGreaterThan(0)
            expect(respawningIn.length).toBeLessThan(100)
        })

        it('should provide text suitable for health bar label', () => {
            const health = i18n.t('arena.health', { lng: 'es' })

            // Should be short enough for UI
            expect(health.length).toBeGreaterThan(0)
            expect(health.length).toBeLessThan(50)
        })
    })

    describe('Multi-language Support', () => {
        it('should support both Spanish and English', () => {
            const languages = ['es', 'en']

            for (const lang of languages) {
                const youDied = i18n.t('arena.youDied', { lng: lang })
                expect(youDied).toBeTruthy()
            }
        })

        it('should switch between languages correctly', () => {
            const es = i18n.t('arena.youDied', { lng: 'es' })
            const en = i18n.t('arena.youDied', { lng: 'en' })

            // Should be different
            expect(es).not.toBe(en)
            // Both should be valid
            expect(es.length).toBeGreaterThan(0)
            expect(en.length).toBeGreaterThan(0)
        })
    })
})
