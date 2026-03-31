export const CHARACTER_ARTWORK: Record<string, { svgPath: string; alt: string }> = {
    cipher: {
        svgPath: '/cyber_paladin_warrior.svg',
        alt: 'Cipher - Cyber Paladin Warrior',
    },
    vanta: {
        svgPath: '/cyberpunk_bounty_hunter.svg',
        alt: 'Vanta - Cyberpunk Bounty Hunter',
    },
}

export function getCharacterArtworkPath(characterId: string): string | null {
    const artwork = CHARACTER_ARTWORK[characterId]
    return artwork?.svgPath || null
}

export function getCharacterArtworkAlt(characterId: string): string {
    return CHARACTER_ARTWORK[characterId]?.alt || 'Character'
}
