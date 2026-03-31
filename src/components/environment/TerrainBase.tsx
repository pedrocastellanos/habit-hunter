export function TerrainBase() {
    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
                <planeGeometry args={[80, 80, 16, 16]} />
                <meshStandardMaterial
                    color="#0a1929"
                    metalness={0.6}
                    roughness={0.7}
                    envMapIntensity={0.5}
                />
            </mesh>

            {[5, 9, 13, 17, 21].map((radius, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                    <ringGeometry args={[radius - 0.15, radius, 64]} />
                    <meshStandardMaterial
                        color="#1e40af"
                        emissive="#1e40af"
                        emissiveIntensity={0.4 - i * 0.06}
                        transparent
                        opacity={0.5 - i * 0.08}
                    />
                </mesh>
            ))}
        </>
    )
}
