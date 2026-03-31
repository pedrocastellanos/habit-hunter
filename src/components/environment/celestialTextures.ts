import * as THREE from 'three'

// Crear textura proceduir para la Tierra
export function createEarthTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Fondo azul (océanos)
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    oceanGradient.addColorStop(0, '#1a5f7a')
    oceanGradient.addColorStop(0.5, '#2196f3')
    oceanGradient.addColorStop(1, '#1565c0')
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Continentes (verde/marrón más vibrante)
    ctx.fillStyle = '#2d7016'
    // América
    ctx.fillRect(100, 300, 250, 200)
    // Europa/África
    ctx.fillRect(700, 250, 300, 350)
    // Asia
    ctx.fillRect(1100, 200, 400, 300)
    // Oceanía
    ctx.fillRect(1300, 500, 100, 100)
    // Groenlandia
    ctx.fillRect(600, 150, 80, 120)

    // Variaciones en verdes más claros
    ctx.fillStyle = '#4a9d3c'
    ctx.fillRect(120, 320, 200, 150)
    ctx.fillRect(750, 300, 200, 250)
    ctx.fillRect(1150, 250, 300, 200)

    // Desiertos/Regiones áridas
    ctx.fillStyle = '#c4a747'
    ctx.fillRect(800, 350, 150, 100)
    ctx.fillRect(1250, 380, 120, 80)

    // Nubes (blanco más opaco)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    for (let i = 0; i < 25; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 100 + 50
        for (let j = 0; j < 6; j++) {
            ctx.beginPath()
            ctx.arc(x + j * 25, y, size / 6, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter
    return texture
}

// Crear textura proceduir para la Luna
export function createMoonTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Fondo gris lunar con gradiente
    const lunarGradient = ctx.createRadialGradient(512, 400, 100, 512, 512, 700)
    lunarGradient.addColorStop(0, '#e8e8e8')
    lunarGradient.addColorStop(0.7, '#d0d0d0')
    lunarGradient.addColorStop(1, '#a8a8a8')
    ctx.fillStyle = lunarGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Cráteres prominentes
    ctx.fillStyle = '#707070'
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 50 + 15
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()

        // Brillo interior del cráter
        ctx.fillStyle = '#b8b8b8'
        ctx.beginPath()
        ctx.arc(x + radius * 0.25, y - radius * 0.25, radius * 0.35, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#707070'
    }

    // Manchas de Maria (regiones oscuras principales)
    ctx.fillStyle = '#4a4a4a'
    ctx.beginPath()
    ctx.arc(300, 250, 180, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(700, 650, 150, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(400, 780, 130, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(150, 600, 100, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter
    return texture
}
