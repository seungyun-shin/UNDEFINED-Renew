import * as THREE from 'three'

// Soft radial-gradient dot generated once on a canvas — used as a Sprite map
// so a travel marker reads as a quiet point of light instead of a hard-edged
// flat-shaded sphere.
let cached = null

export function glowDotTexture() {
    if (cached) return cached

    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.7)')
    gradient.addColorStop(0.65, 'rgba(255,255,255,0.15)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    cached = new THREE.CanvasTexture(canvas)
    return cached
}
