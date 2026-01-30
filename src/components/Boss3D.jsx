import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Cone, Torus, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ========== 3D BOSS MODELS ==========

// O Procrastinador (Megalodon) - Tubarão 3D
const MegalodonModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const bodyRef = useRef();
    const finRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            // Movimento de natação
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
        }
        if (finRef.current) {
            finRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.1;
        }
        if (isAttacking && bodyRef.current) {
            bodyRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.05;
        }
    });

    const bodyColor = isDefeated ? '#444444' : '#1E4258';
    const accentColor = isDefeated ? '#333333' : '#00FFFF';

    return (
        <group ref={groupRef} scale={0.8}>
            {/* Corpo principal */}
            <mesh ref={bodyRef} position={[0, 0, 0]}>
                <sphereGeometry args={[1.2, 32, 32]} />
                <meshStandardMaterial
                    color={bodyColor}
                    metalness={0.3}
                    roughness={0.5}
                />
            </mesh>

            {/* Cabeça */}
            <mesh position={[1.2, 0, 0]}>
                <coneGeometry args={[0.6, 1.5, 32]} />
                <meshStandardMaterial color={bodyColor} metalness={0.3} roughness={0.5} />
            </mesh>

            {/* Barbatana dorsal */}
            <mesh ref={finRef} position={[0, 1, 0]} rotation={[0, 0, Math.PI * 0.1]}>
                <coneGeometry args={[0.3, 1, 4]} />
                <meshStandardMaterial color={bodyColor} metalness={0.4} roughness={0.4} />
            </mesh>

            {/* Cauda */}
            <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI * 0.5]}>
                <coneGeometry args={[0.8, 0.4, 4]} />
                <meshStandardMaterial color={bodyColor} metalness={0.3} roughness={0.5} />
            </mesh>

            {/* Olho brilhante */}
            <mesh position={[1.4, 0.2, 0.4]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                    color={accentColor}
                    emissive={accentColor}
                    emissiveIntensity={isDefeated ? 0 : 2}
                />
            </mesh>
            <mesh position={[1.4, 0.2, -0.4]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                    color={accentColor}
                    emissive={accentColor}
                    emissiveIntensity={isDefeated ? 0 : 2}
                />
            </mesh>

            {/* Dentes */}
            {[0.2, 0.4, 0.6].map((x, i) => (
                <mesh key={i} position={[1.8 + x * 0.3, -0.2, 0.15 * (i - 1)]}>
                    <coneGeometry args={[0.05, 0.2, 8]} />
                    <meshStandardMaterial color="#FFFFFF" />
                </mesh>
            ))}
        </group>
    );
};

// Tigre Dentes de Sabre 3D
const SaberToothModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
            if (isAttacking) {
                groupRef.current.position.z = Math.sin(state.clock.elapsedTime * 15) * 0.1;
            }
        }
    });

    const furColor = isDefeated ? '#555555' : '#C49432';
    const eyeColor = isDefeated ? '#333333' : '#FFD700';

    return (
        <group ref={groupRef} scale={0.7}>
            {/* Corpo */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2, 0.8, 0.9]} />
                <meshStandardMaterial color={furColor} roughness={0.8} />
            </mesh>

            {/* Cabeça */}
            <mesh position={[1.2, 0.3, 0]}>
                <sphereGeometry args={[0.55, 32, 32]} />
                <meshStandardMaterial color={furColor} roughness={0.8} />
            </mesh>

            {/* Focinho */}
            <mesh position={[1.7, 0.15, 0]}>
                <boxGeometry args={[0.4, 0.3, 0.4]} />
                <meshStandardMaterial color={furColor} roughness={0.8} />
            </mesh>

            {/* Orelhas */}
            <mesh position={[1.1, 0.8, 0.25]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.12, 0.3, 4]} />
                <meshStandardMaterial color={furColor} />
            </mesh>
            <mesh position={[1.1, 0.8, -0.25]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.12, 0.3, 4]} />
                <meshStandardMaterial color={furColor} />
            </mesh>

            {/* Dentes de Sabre GIGANTES */}
            <mesh position={[1.6, -0.3, 0.15]} rotation={[0, 0, Math.PI]}>
                <coneGeometry args={[0.06, 0.7, 8]} />
                <meshStandardMaterial color="#FFFFF0" metalness={0.2} />
            </mesh>
            <mesh position={[1.6, -0.3, -0.15]} rotation={[0, 0, Math.PI]}>
                <coneGeometry args={[0.06, 0.7, 8]} />
                <meshStandardMaterial color="#FFFFF0" metalness={0.2} />
            </mesh>

            {/* Olhos */}
            <mesh position={[1.5, 0.4, 0.3]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={isDefeated ? 0 : 1.5} />
            </mesh>
            <mesh position={[1.5, 0.4, -0.3]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={isDefeated ? 0 : 1.5} />
            </mesh>

            {/* Patas */}
            {[-0.6, 0.6].map((z, i) => (
                <group key={i}>
                    <mesh position={[0.7, -0.6, z * 0.5]}>
                        <cylinderGeometry args={[0.12, 0.1, 0.5, 16]} />
                        <meshStandardMaterial color={furColor} />
                    </mesh>
                    <mesh position={[-0.7, -0.6, z * 0.5]}>
                        <cylinderGeometry args={[0.12, 0.1, 0.5, 16]} />
                        <meshStandardMaterial color={furColor} />
                    </mesh>
                </group>
            ))}

            {/* Cauda */}
            <mesh position={[-1.3, 0.2, 0]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.08, 0.03, 0.8, 8]} />
                <meshStandardMaterial color={furColor} />
            </mesh>
        </group>
    );
};

// Dragão de Gelo 3D
const IceDragonModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const wingLeftRef = useRef();
    const wingRightRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
        }
        if (wingLeftRef.current && wingRightRef.current) {
            const wingFlap = Math.sin(state.clock.elapsedTime * 3) * 0.3;
            wingLeftRef.current.rotation.z = wingFlap;
            wingRightRef.current.rotation.z = -wingFlap;
        }
    });

    const bodyColor = isDefeated ? '#555555' : '#4FC3F7';
    const accentColor = isDefeated ? '#333333' : '#00FFFF';

    return (
        <group ref={groupRef} scale={0.65}>
            {/* Corpo */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <MeshDistortMaterial
                    color={bodyColor}
                    metalness={0.6}
                    roughness={0.2}
                    distort={0.1}
                    speed={2}
                />
            </mesh>

            {/* Pescoço */}
            <mesh position={[0.8, 0.5, 0]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.25, 0.35, 1, 16]} />
                <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Cabeça */}
            <mesh position={[1.3, 1, 0]}>
                <boxGeometry args={[0.8, 0.5, 0.5]} />
                <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Chifres de gelo */}
            <mesh position={[1.1, 1.4, 0.15]} rotation={[0.3, 0, -0.3]}>
                <coneGeometry args={[0.08, 0.5, 6]} />
                <meshStandardMaterial color="#E0F7FA" metalness={0.8} roughness={0.1} transparent opacity={0.9} />
            </mesh>
            <mesh position={[1.1, 1.4, -0.15]} rotation={[-0.3, 0, -0.3]}>
                <coneGeometry args={[0.08, 0.5, 6]} />
                <meshStandardMaterial color="#E0F7FA" metalness={0.8} roughness={0.1} transparent opacity={0.9} />
            </mesh>

            {/* Asas */}
            <group ref={wingLeftRef} position={[-0.2, 0.5, 0.8]}>
                <mesh rotation={[0.5, 0, 0]}>
                    <planeGeometry args={[1.5, 1]} />
                    <meshStandardMaterial
                        color={bodyColor}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.7}
                        metalness={0.4}
                    />
                </mesh>
            </group>
            <group ref={wingRightRef} position={[-0.2, 0.5, -0.8]}>
                <mesh rotation={[-0.5, 0, 0]}>
                    <planeGeometry args={[1.5, 1]} />
                    <meshStandardMaterial
                        color={bodyColor}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.7}
                        metalness={0.4}
                    />
                </mesh>
            </group>

            {/* Olhos gelados */}
            <mesh position={[1.5, 1.1, 0.15]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={isDefeated ? 0 : 2} />
            </mesh>
            <mesh position={[1.5, 1.1, -0.15]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={isDefeated ? 0 : 2} />
            </mesh>

            {/* Cauda */}
            <mesh position={[-1.2, -0.2, 0]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.3, 1.5, 8]} />
                <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Cristais de gelo flutuantes */}
            <Float speed={4} floatIntensity={0.5}>
                <mesh position={[0.5, 1.5, 0.5]}>
                    <octahedronGeometry args={[0.15, 0]} />
                    <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={0.5} transparent opacity={0.8} />
                </mesh>
            </Float>
            <Float speed={3} floatIntensity={0.4}>
                <mesh position={[-0.3, 1.3, -0.4]}>
                    <octahedronGeometry args={[0.1, 0]} />
                    <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={0.5} transparent opacity={0.8} />
                </mesh>
            </Float>
        </group>
    );
};

// Cérbero 3D - Cachorro de 3 Cabeças
const CerberusModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const headLeftRef = useRef();
    const headCenterRef = useRef();
    const headRightRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
        // Movimento das cabeças
        if (headLeftRef.current) {
            headLeftRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
        }
        if (headCenterRef.current) {
            headCenterRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
        }
        if (headRightRef.current) {
            headRightRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.8 + 1) * 0.15;
        }
    });

    const bodyColor = isDefeated ? '#333333' : '#1a1a1a';
    const fireColor = isDefeated ? '#444444' : '#FF4500';

    const DogHead = ({ position, rotation, headRef }) => (
        <group ref={headRef} position={position} rotation={rotation}>
            <mesh>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial color={bodyColor} roughness={0.8} />
            </mesh>
            {/* Focinho */}
            <mesh position={[0.35, -0.05, 0]}>
                <boxGeometry args={[0.3, 0.2, 0.25]} />
                <meshStandardMaterial color={bodyColor} roughness={0.8} />
            </mesh>
            {/* Orelhas */}
            <mesh position={[0, 0.35, 0.2]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.1, 0.25, 4]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh position={[0, 0.35, -0.2]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.1, 0.25, 4]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>
            {/* Olhos de fogo */}
            <mesh position={[0.25, 0.1, 0.12]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={fireColor} emissive={fireColor} emissiveIntensity={isDefeated ? 0 : 2} />
            </mesh>
            <mesh position={[0.25, 0.1, -0.12]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={fireColor} emissive={fireColor} emissiveIntensity={isDefeated ? 0 : 2} />
            </mesh>
        </group>
    );

    return (
        <group ref={groupRef} scale={0.75}>
            {/* Corpo */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.8, 0.9, 1]} />
                <meshStandardMaterial color={bodyColor} roughness={0.7} />
            </mesh>

            {/* 3 Cabeças */}
            <DogHead headRef={headLeftRef} position={[0.6, 0.6, 0.5]} rotation={[0, -0.3, 0]} />
            <DogHead headRef={headCenterRef} position={[0.9, 0.8, 0]} rotation={[0, 0, 0]} />
            <DogHead headRef={headRightRef} position={[0.6, 0.6, -0.5]} rotation={[0, 0.3, 0]} />

            {/* Patas */}
            {[[-0.5, 0.35], [-0.5, -0.35], [0.5, 0.35], [0.5, -0.35]].map(([x, z], i) => (
                <mesh key={i} position={[x, -0.7, z]}>
                    <cylinderGeometry args={[0.12, 0.1, 0.6, 16]} />
                    <meshStandardMaterial color={bodyColor} />
                </mesh>
            ))}

            {/* Cauda de serpente */}
            <mesh position={[-1.2, 0.2, 0]} rotation={[0, 0, -0.4]}>
                <cylinderGeometry args={[0.1, 0.05, 0.8, 8]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh position={[-1.5, 0.4, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={fireColor} emissive={fireColor} emissiveIntensity={isDefeated ? 0 : 1} />
            </mesh>

            {/* Coleira */}
            <mesh position={[0.4, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.5, 0.06, 8, 32]} />
                <meshStandardMaterial color="#8B0000" metalness={0.8} />
            </mesh>
        </group>
    );
};

// Kraken 3D - Polvo Gigante
const KrakenModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const tentacleRefs = useRef([]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
        tentacleRefs.current.forEach((ref, i) => {
            if (ref) {
                ref.rotation.x = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.2;
                ref.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + i * 0.8) * 0.15;
            }
        });
    });

    const bodyColor = isDefeated ? '#444444' : '#6B3FA0';
    const eyeColor = isDefeated ? '#333333' : '#FF4500';

    return (
        <group ref={groupRef} scale={0.7}>
            {/* Cabeça/Manto */}
            <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <MeshDistortMaterial
                    color={bodyColor}
                    metalness={0.3}
                    roughness={0.6}
                    distort={0.15}
                    speed={1.5}
                />
            </mesh>

            {/* Olhos enormes */}
            <mesh position={[0.4, 0.6, 0.7]}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.45, 0.65, 0.85]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={isDefeated ? 0 : 2} />
            </mesh>
            <mesh position={[-0.4, 0.6, 0.7]}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[-0.35, 0.65, 0.85]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={isDefeated ? 0 : 2} />
            </mesh>

            {/* Tentáculos */}
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 0.6;
                const z = Math.sin(angle) * 0.6;
                return (
                    <group
                        key={i}
                        ref={el => tentacleRefs.current[i] = el}
                        position={[x, -0.3, z]}
                        rotation={[0.5, angle, 0]}
                    >
                        <mesh>
                            <cylinderGeometry args={[0.15, 0.05, 1.5, 8]} />
                            <meshStandardMaterial color={bodyColor} roughness={0.7} />
                        </mesh>
                        {/* Ventosas */}
                        {[0.2, 0.5, 0.8].map((y, j) => (
                            <mesh key={j} position={[0.1, -y, 0]}>
                                <sphereGeometry args={[0.04, 8, 8]} />
                                <meshStandardMaterial color="#9B59B6" />
                            </mesh>
                        ))}
                    </group>
                );
            })}
        </group>
    );
};

// Fênix Sombria 3D
const PhoenixModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const wingLeftRef = useRef();
    const wingRightRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
        if (wingLeftRef.current && wingRightRef.current) {
            const wingFlap = Math.sin(state.clock.elapsedTime * 4) * 0.4;
            wingLeftRef.current.rotation.z = Math.PI * 0.3 + wingFlap;
            wingRightRef.current.rotation.z = -Math.PI * 0.3 - wingFlap;
        }
    });

    const bodyColor = isDefeated ? '#555555' : '#DC143C';
    const flameColor = isDefeated ? '#444444' : '#FF4500';
    const glowColor = isDefeated ? '#333333' : '#FFD700';

    return (
        <group ref={groupRef} scale={0.7}>
            {/* Corpo */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial color={bodyColor} metalness={0.4} roughness={0.5} />
            </mesh>

            {/* Pescoço */}
            <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.15, 0.2, 0.8, 16]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>

            {/* Cabeça */}
            <mesh position={[0.8, 0.9, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>

            {/* Bico */}
            <mesh position={[1.1, 0.85, 0]} rotation={[0, 0, -0.3]}>
                <coneGeometry args={[0.1, 0.4, 4]} />
                <meshStandardMaterial color={glowColor} metalness={0.6} />
            </mesh>

            {/* Crista de fogo */}
            <Float speed={5} floatIntensity={0.3}>
                <mesh position={[0.7, 1.3, 0]}>
                    <coneGeometry args={[0.15, 0.5, 6]} />
                    <meshStandardMaterial color={flameColor} emissive={flameColor} emissiveIntensity={isDefeated ? 0 : 1.5} />
                </mesh>
            </Float>

            {/* Asas de fogo */}
            <group ref={wingLeftRef} position={[0, 0.2, 0.5]}>
                <mesh rotation={[0, 0.3, 0]}>
                    <planeGeometry args={[1.8, 1.2]} />
                    <meshStandardMaterial
                        color={flameColor}
                        emissive={flameColor}
                        emissiveIntensity={isDefeated ? 0 : 0.5}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            </group>
            <group ref={wingRightRef} position={[0, 0.2, -0.5]}>
                <mesh rotation={[0, -0.3, 0]}>
                    <planeGeometry args={[1.8, 1.2]} />
                    <meshStandardMaterial
                        color={flameColor}
                        emissive={flameColor}
                        emissiveIntensity={isDefeated ? 0 : 0.5}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            </group>

            {/* Olhos */}
            <mesh position={[0.95, 0.95, 0.15]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={isDefeated ? 0 : 2} />
            </mesh>
            <mesh position={[0.95, 0.95, -0.15]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={isDefeated ? 0 : 2} />
            </mesh>

            {/* Cauda de fogo */}
            <mesh position={[-0.8, -0.2, 0]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.25, 1.2, 6]} />
                <meshStandardMaterial color={flameColor} emissive={flameColor} emissiveIntensity={isDefeated ? 0 : 0.8} />
            </mesh>

            {/* Fagulhas */}
            {!isDefeated && (
                <>
                    <Float speed={6} floatIntensity={0.8}>
                        <mesh position={[0.3, 1.2, 0.3]}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={2} />
                        </mesh>
                    </Float>
                    <Float speed={5} floatIntensity={0.6}>
                        <mesh position={[-0.2, 1, -0.4]}>
                            <sphereGeometry args={[0.04, 8, 8]} />
                            <meshStandardMaterial color={flameColor} emissive={flameColor} emissiveIntensity={2} />
                        </mesh>
                    </Float>
                </>
            )}
        </group>
    );
};

// ========== MAIN BOSS 3D COMPONENT ==========
const Boss3DScene = ({ bossType, isAttacking, isDefeated, locked }) => {
    const models = {
        megalodon: MegalodonModel,
        sabertooth: SaberToothModel,
        icedragon: IceDragonModel,
        cerberus: CerberusModel,
        kraken: KrakenModel,
        phoenix: PhoenixModel
    };

    const ModelComponent = models[bossType] || MegalodonModel;

    return (
        <div style={{
            width: '100%',
            height: '200px',
            opacity: locked ? 0.4 : 1,
            filter: locked ? 'grayscale(100%)' : 'none',
            transition: 'all 0.3s ease'
        }}>
            <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
                <pointLight position={[-5, -5, 5]} intensity={0.5} color="#00ff88" />
                <spotLight
                    position={[0, 5, 0]}
                    angle={0.5}
                    penumbra={0.5}
                    intensity={0.8}
                    color="#ffffff"
                />

                <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.2}>
                    <ModelComponent isAttacking={isAttacking} isDefeated={isDefeated} />
                </Float>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={!locked && !isDefeated}
                    autoRotateSpeed={1}
                    maxPolarAngle={Math.PI / 1.8}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
};

export default Boss3DScene;
