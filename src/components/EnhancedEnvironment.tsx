import { TerrainBase } from './environment/TerrainBase'
import { AnimatedGrid } from './environment/AnimatedGrid'
import { TechTower } from './environment/TechTower'
import { HologramPanel } from './environment/HologramPanel'
import { EnergyParticles } from './environment/EnergyParticles'
import { PowerCrystal } from './environment/PowerCrystal'
import { DistantEarth, DistantMoon } from './environment/CelestialBodies'

// Ambiente mejorado y realista con efectos visuales avanzados
export function EnhancedEnvironment() {
    return (
        <>
            {/* Terreno con detalles */}
            <TerrainBase />

            {/* Grid mejorado con efectos */}
            <AnimatedGrid />

            {/* Torres/Estructuras futuristas más espaciadas */}
            <TechTower position={[-16, 0, -16]} height={6} />
            <TechTower position={[16, 0, -16]} height={7} />
            <TechTower position={[-16, 0, 16]} height={5.5} />
            <TechTower position={[16, 0, 16]} height={6.5} />

            {/* Torres adicionales */}
            <TechTower position={[-20, 0, 0]} height={5} />
            <TechTower position={[20, 0, 0]} height={5.5} />

            {/* Hologramas flotantes más espaciados */}
            <HologramPanel position={[-8, 4, -18]} />
            <HologramPanel position={[10, 4.5, -18]} rotation={[0, Math.PI / 4, 0]} />
            <HologramPanel position={[-10, 4, 18]} rotation={[0, -Math.PI / 6, 0]} />

            {/* Partículas de energía ambiente */}
            <EnergyParticles />

            {/* Cristales de poder más distribuidos */}
            <PowerCrystal position={[-12, 1.5, 6]} color="#00ffff" />
            <PowerCrystal position={[12, 1.2, -6]} color="#ff00ff" />
            <PowerCrystal position={[0, 1.8, 14]} color="#ffff00" />
            <PowerCrystal position={[-8, 1.5, -10]} color="#00ff88" />
            <PowerCrystal position={[10, 1.4, 10]} color="#ff0088" />

            {/* Cuerpos celestes lejanos */}
            <DistantEarth position={[-35, 30, -50]} />
            <DistantMoon position={[45, 25, -55]} />
        </>
    )
}
