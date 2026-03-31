/**
 * Format time in UTC with language-specific locale
 */
export function getFormattedUTCTime(language: string): string {
    return new Date().toLocaleTimeString(language === 'en' ? 'en-GB' : 'es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
        hour12: false,
    })
}

/**
 * Generate unique ID using crypto API or fallback
 */
export function generateUniqueId(prefix: string = ''): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

/**
 * Play audio with error handling
 */
export function playAudio(audioElement: HTMLAudioElement | null): void {
    if (!audioElement) return
    audioElement.currentTime = 0
    audioElement.play().catch(() => {
        // Ignore autoplay errors
    })
}

/**
 * Create audio element from URL
 */
export function createAudioElement(url: string, volume: number = 0.5): HTMLAudioElement {
    const audio = new Audio(url)
    audio.volume = volume
    return audio
}
