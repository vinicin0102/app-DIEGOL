import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Environment, Stars, Sparkles, Trail } from '@react-three/drei';
import * as THREE from 'three';

// ========== IMPROVED 3D BOSS MODELS ==========

// Partículas de Água para Megalodon
const WaterParticles = () => {
    return (
        <Sparkles
            count={50}
            scale={4}
            size={3}
            speed={0.4}
            color="#00FFFF"
        />
    );
};

// Partículas de Fogo
const FireParticles = ({ color = "#FF4500" }) => {
    return (
        <Sparkles
            count={80}
            scale={3}
            size={6}
            speed={2}
            color={color}
        />
    );
};

// Partículas de Gelo
const IceParticles = () => {
    return (
        <Sparkles
            count={60}
            scale={4}
            size={4}
            speed={0.3}
            color="#00FFFF"
        />
    );
};

// O Procrastinador (Megalodon) - Tubarão 3D Épico
const MegalodonModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const jawRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            // Movimento fluido de natação
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
            groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
        // Mandíbula abrindo/fechando
        if (jawRef.current) {
            jawRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.1;
        }
    });

    const bodyColor = isDefeated ? '#333333' : '#1a3a4f';
    const bellyColor = isDefeated ? '#444444' : '#a8c5d4';
    const eyeColor = isDefeated ? '#333333' : '#FF0000';

    return (
        <group ref={groupRef} scale={0.9} rotation={[0, Math.PI / 6, 0]}>
            {!isDefeated && <WaterParticles />}

            {/* Corpo Principal - Forma de torpedo */}
            <mesh position={[0, 0, 0]}>
                <capsuleGeometry args={[0.6, 2, 16, 32]} />
                <meshPhysicalMaterial
                    color={bodyColor}
                    metalness={0.2}
                    roughness={0.4}
                    clearcoat={0.5}
                    clearcoatRoughness={0.3}
                />
            </mesh>

            {/* Parte inferior/Barriga */}
            <mesh position={[0, -0.2, 0]}>
                <capsuleGeometry args={[0.5, 1.8, 16, 32]} />
                <meshPhysicalMaterial
                    color={bellyColor}
                    metalness={0.1}
                    roughness={0.5}
                />
            </mesh>

            {/* Cabeça cônica */}
            <mesh position={[1.3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <coneGeometry args={[0.5, 1, 32]} />
                <meshPhysicalMaterial color={bodyColor} metalness={0.2} roughness={0.4} clearcoat={0.5} />
            </mesh>

            {/* Mandíbula inferior animada */}
            <group ref={jawRef} position={[1.5, -0.15, 0]}>
                <mesh rotation={[0, 0, -Math.PI / 2]}>
                    <coneGeometry args={[0.3, 0.6, 16]} />
                    <meshPhysicalMaterial color={bodyColor} metalness={0.2} roughness={0.4} />
                </mesh>
                {/* Dentes inferiores */}
                {[-0.15, 0, 0.15].map((z, i) => (
                    <mesh key={`lower-${i}`} position={[0.2, 0.1, z]} rotation={[0, 0, Math.PI]}>
                        <coneGeometry args={[0.03, 0.15, 8]} />
                        <meshStandardMaterial color="#FFFFFF" />
                    </mesh>
                ))}
            </group>

            {/* Barbatana Dorsal GIGANTE */}
            <mesh position={[-0.2, 0.8, 0]} rotation={[0, 0, 0.1]}>
                <coneGeometry args={[0.4, 1.2, 4]} />
                <meshPhysicalMaterial color={bodyColor} metalness={0.3} roughness={0.4} clearcoat={0.4} />
            </mesh>

            {/* Barbatanas Peitorais */}
            <mesh position={[0.3, -0.3, 0.7]} rotation={[0.5, 0.3, 0.2]}>
                <coneGeometry args={[0.25, 0.8, 4]} />
                <meshPhysicalMaterial color={bodyColor} metalness={0.2} roughness={0.4} />
            </mesh>
            <mesh position={[0.3, -0.3, -0.7]} rotation={[-0.5, -0.3, 0.2]}>
                <coneGeometry args={[0.25, 0.8, 4]} />
                <meshPhysicalMaterial color={bodyColor} metalness={0.2} roughness={0.4} />
            </mesh>

            {/* Cauda */}
            <group position={[-1.5, 0, 0]}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <coneGeometry args={[0.4, 0.5, 8]} />
                    <meshPhysicalMaterial color={bodyColor} metalness={0.2} roughness={0.4} />
                </mesh>
                {/* Lóbulos da cauda */}
                <mesh position={[-0.3, 0.5, 0]} rotation={[0, 0, 0.5]}>
                    <coneGeometry args={[0.15, 0.7, 4]} />
                    <meshPhysicalMaterial color={bodyColor} metalness={0.2} roughness={0.4} />
                </mesh>
                <mesh position={[-0.3, -0.4, 0]} rotation={[0, 0, -0.5]}>
                    <coneGeometry args={[0.12, 0.5, 4]} />
                    <meshPhysicalMaterial color={bodyColor} metalness={0.2} roughness={0.4} />
                </mesh>
            </group>

            {/* Olhos malignos */}
            <mesh position={[1.1, 0.15, 0.35]}>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[1.15, 0.18, 0.38]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial
                    color={eyeColor}
                    emissive={eyeColor}
                    emissiveIntensity={isDefeated ? 0 : 3}
                />
            </mesh>
            <mesh position={[1.1, 0.15, -0.35]}>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[1.15, 0.18, -0.38]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial
                    color={eyeColor}
                    emissive={eyeColor}
                    emissiveIntensity={isDefeated ? 0 : 3}
                />
            </mesh>

            {/* Dentes superiores ameaçadores */}
            {[-0.2, -0.1, 0, 0.1, 0.2].map((z, i) => (
                <mesh key={i} position={[1.7, 0.05, z]}>
                    <coneGeometry args={[0.025, 0.12 + Math.random() * 0.05, 8]} />
                    <meshStandardMaterial color="#FFFFF0" />
                </mesh>
            ))}

            {/* Cicatrizes/Marcas */}
            <mesh position={[0.5, 0.4, 0.4]} rotation={[0, 0.3, 0.2]}>
                <boxGeometry args={[0.3, 0.02, 0.02]} />
                <meshStandardMaterial color="#0d1f2a" />
            </mesh>

            {/* Guelras */}
            {[0.2, 0.35, 0.5].map((x, i) => (
                <mesh key={i} position={[0.7 + x * 0.3, 0, 0.45]} rotation={[0, 0.3, 0]}>
                    <boxGeometry args={[0.02, 0.15, 0.01]} />
                    <meshStandardMaterial color="#0d1f2a" />
                </mesh>
            ))}
        </group>
    );
};

// Tigre Dentes de Sabre 3D Realista
const SaberToothModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const tailRef = useRef();
    const headRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
            if (isAttacking) {
                groupRef.current.position.z = Math.sin(state.clock.elapsedTime * 20) * 0.15;
            }
        }
        if (tailRef.current) {
            tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.3;
        }
        if (headRef.current) {
            headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
        }
    });

    const furColor = isDefeated ? '#444444' : '#d4a84b';
    const stripeColor = isDefeated ? '#333333' : '#5c3d1e';
    const eyeColor = isDefeated ? '#333333' : '#FFD700';

    return (
        <group ref={groupRef} scale={0.75} rotation={[0, Math.PI / 5, 0]}>
            {/* Corpo musculoso */}
            <mesh position={[0, 0, 0]}>
                <capsuleGeometry args={[0.45, 1.4, 16, 32]} />
                <meshPhysicalMaterial
                    color={furColor}
                    roughness={0.9}
                    metalness={0.05}
                />
            </mesh>

            {/* Peito expandido */}
            <mesh position={[0.5, 0.1, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshPhysicalMaterial color={furColor} roughness={0.9} />
            </mesh>

            {/* Pescoço */}
            <mesh position={[0.9, 0.3, 0]} rotation={[0, 0, -0.4]}>
                <cylinderGeometry args={[0.25, 0.35, 0.5, 16]} />
                <meshPhysicalMaterial color={furColor} roughness={0.9} />
            </mesh>

            {/* Cabeça */}
            <group ref={headRef} position={[1.2, 0.5, 0]}>
                <mesh>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshPhysicalMaterial color={furColor} roughness={0.9} />
                </mesh>

                {/* Focinho */}
                <mesh position={[0.35, -0.05, 0]}>
                    <boxGeometry args={[0.35, 0.25, 0.35]} />
                    <meshPhysicalMaterial color={furColor} roughness={0.9} />
                </mesh>

                {/* Nariz */}
                <mesh position={[0.55, 0, 0]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>

                {/* DENTES DE SABRE ENORMES */}
                <mesh position={[0.35, -0.45, 0.12]} rotation={[0.1, 0, 0]}>
                    <coneGeometry args={[0.04, 0.6, 8]} />
                    <meshPhysicalMaterial color="#FFFFF0" metalness={0.3} roughness={0.2} clearcoat={1} />
                </mesh>
                <mesh position={[0.35, -0.45, -0.12]} rotation={[-0.1, 0, 0]}>
                    <coneGeometry args={[0.04, 0.6, 8]} />
                    <meshPhysicalMaterial color="#FFFFF0" metalness={0.3} roughness={0.2} clearcoat={1} />
                </mesh>

                {/* Orelhas */}
                <mesh position={[0, 0.35, 0.2]} rotation={[0.3, 0, 0.2]}>
                    <coneGeometry args={[0.1, 0.2, 4]} />
                    <meshPhysicalMaterial color={furColor} roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.35, -0.2]} rotation={[-0.3, 0, 0.2]}>
                    <coneGeometry args={[0.1, 0.2, 4]} />
                    <meshPhysicalMaterial color={furColor} roughness={0.9} />
                </mesh>

                {/* Olhos ferozes */}
                <mesh position={[0.25, 0.1, 0.2]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#000000" />
                </mesh>
                <mesh position={[0.28, 0.12, 0.22]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshStandardMaterial
                        color={eyeColor}
                        emissive={eyeColor}
                        emissiveIntensity={isDefeated ? 0 : 2}
                    />
                </mesh>
                <mesh position={[0.25, 0.1, -0.2]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#000000" />
                </mesh>
                <mesh position={[0.28, 0.12, -0.22]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshStandardMaterial
                        color={eyeColor}
                        emissive={eyeColor}
                        emissiveIntensity={isDefeated ? 0 : 2}
                    />
                </mesh>
            </group>

            {/* Listras de tigre */}
            {[-0.3, 0, 0.3].map((x, i) => (
                <mesh key={i} position={[x, 0.3, 0]} rotation={[Math.PI / 2, 0, 0.2 + i * 0.1]}>
                    <boxGeometry args={[0.08, 0.9, 0.02]} />
                    <meshStandardMaterial color={stripeColor} />
                </mesh>
            ))}

            {/* Patas dianteiras */}
            <mesh position={[0.5, -0.55, 0.35]}>
                <cylinderGeometry args={[0.1, 0.08, 0.6, 16]} />
                <meshPhysicalMaterial color={furColor} roughness={0.9} />
            </mesh>
            <mesh position={[0.5, -0.55, -0.35]}>
                <cylinderGeometry args={[0.1, 0.08, 0.6, 16]} />
                <meshPhysicalMaterial color={furColor} roughness={0.9} />
            </mesh>

            {/* Patas traseiras */}
            <mesh position={[-0.5, -0.55, 0.35]}>
                <cylinderGeometry args={[0.12, 0.08, 0.6, 16]} />
                <meshPhysicalMaterial color={furColor} roughness={0.9} />
            </mesh>
            <mesh position={[-0.5, -0.55, -0.35]}>
                <cylinderGeometry args={[0.12, 0.08, 0.6, 16]} />
                <meshPhysicalMaterial color={furColor} roughness={0.9} />
            </mesh>

            {/* Cauda */}
            <group ref={tailRef} position={[-1, 0.2, 0]}>
                <mesh rotation={[0, 0, 0.5]}>
                    <cylinderGeometry args={[0.06, 0.04, 0.8, 8]} />
                    <meshPhysicalMaterial color={furColor} roughness={0.9} />
                </mesh>
            </group>
        </group>
    );
};

// Dragão de Gelo 3D Majestoso
const IceDragonModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const wingLeftRef = useRef();
    const wingRightRef = useRef();
    const neckRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
        if (wingLeftRef.current && wingRightRef.current) {
            const wingFlap = Math.sin(state.clock.elapsedTime * 2.5) * 0.4;
            wingLeftRef.current.rotation.z = 0.3 + wingFlap;
            wingRightRef.current.rotation.z = -0.3 - wingFlap;
        }
        if (neckRef.current) {
            neckRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
        }
    });

    const bodyColor = isDefeated ? '#444444' : '#4FC3F7';
    const scaleColor = isDefeated ? '#333333' : '#0288D1';
    const eyeColor = isDefeated ? '#333333' : '#00FFFF';

    return (
        <group ref={groupRef} scale={0.6} rotation={[0.1, Math.PI / 6, 0]}>
            {!isDefeated && <IceParticles />}

            {/* Corpo principal */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.9, 32, 32]} />
                <MeshDistortMaterial
                    color={bodyColor}
                    metalness={0.6}
                    roughness={0.2}
                    distort={0.1}
                    speed={2}
                />
            </mesh>

            {/* Escamas */}
            <mesh position={[0, 0.2, 0]}>
                <icosahedronGeometry args={[0.95, 1]} />
                <meshPhysicalMaterial
                    color={scaleColor}
                    metalness={0.7}
                    roughness={0.2}
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Pescoço longo */}
            <group ref={neckRef} position={[0.8, 0.5, 0]}>
                <mesh rotation={[0, 0, -0.6]}>
                    <cylinderGeometry args={[0.2, 0.35, 1.2, 16]} />
                    <meshPhysicalMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
                </mesh>

                {/* Cabeça */}
                <group position={[0.7, 0.5, 0]}>
                    <mesh>
                        <boxGeometry args={[0.7, 0.4, 0.4]} />
                        <meshPhysicalMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
                    </mesh>

                    {/* Focinho */}
                    <mesh position={[0.4, -0.05, 0]} rotation={[0, 0, -0.1]}>
                        <coneGeometry args={[0.15, 0.5, 8]} />
                        <meshPhysicalMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
                    </mesh>

                    {/* Chifres de gelo majestosos */}
                    <mesh position={[-0.1, 0.35, 0.12]} rotation={[0.3, 0, -0.4]}>
                        <coneGeometry args={[0.06, 0.5, 6]} />
                        <meshPhysicalMaterial
                            color="#E0F7FA"
                            metalness={0.9}
                            roughness={0.1}
                            transparent
                            opacity={0.85}
                            clearcoat={1}
                        />
                    </mesh>
                    <mesh position={[-0.1, 0.35, -0.12]} rotation={[-0.3, 0, -0.4]}>
                        <coneGeometry args={[0.06, 0.5, 6]} />
                        <meshPhysicalMaterial
                            color="#E0F7FA"
                            metalness={0.9}
                            roughness={0.1}
                            transparent
                            opacity={0.85}
                            clearcoat={1}
                        />
                    </mesh>

                    {/* Olhos glaciais */}
                    <mesh position={[0.15, 0.1, 0.15]}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial
                            color={eyeColor}
                            emissive={eyeColor}
                            emissiveIntensity={isDefeated ? 0 : 3}
                        />
                    </mesh>
                    <mesh position={[0.15, 0.1, -0.15]}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial
                            color={eyeColor}
                            emissive={eyeColor}
                            emissiveIntensity={isDefeated ? 0 : 3}
                        />
                    </mesh>
                </group>
            </group>

            {/* Asa Esquerda */}
            <group ref={wingLeftRef} position={[-0.2, 0.4, 0.8]}>
                <mesh rotation={[0.8, 0, 0]}>
                    <planeGeometry args={[1.8, 1.4]} />
                    <meshPhysicalMaterial
                        color={bodyColor}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.6}
                        metalness={0.5}
                        roughness={0.3}
                    />
                </mesh>
                {/* Estrutura da asa */}
                <mesh position={[0.3, 0.3, 0.1]} rotation={[0.5, 0, 0.3]}>
                    <cylinderGeometry args={[0.03, 0.02, 1.4, 8]} />
                    <meshPhysicalMaterial color={scaleColor} metalness={0.6} />
                </mesh>
            </group>

            {/* Asa Direita */}
            <group ref={wingRightRef} position={[-0.2, 0.4, -0.8]}>
                <mesh rotation={[-0.8, 0, 0]}>
                    <planeGeometry args={[1.8, 1.4]} />
                    <meshPhysicalMaterial
                        color={bodyColor}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.6}
                        metalness={0.5}
                        roughness={0.3}
                    />
                </mesh>
                <mesh position={[0.3, 0.3, -0.1]} rotation={[-0.5, 0, 0.3]}>
                    <cylinderGeometry args={[0.03, 0.02, 1.4, 8]} />
                    <meshPhysicalMaterial color={scaleColor} metalness={0.6} />
                </mesh>
            </group>

            {/* Patas */}
            <mesh position={[0.3, -0.8, 0.4]}>
                <cylinderGeometry args={[0.12, 0.08, 0.7, 16]} />
                <meshPhysicalMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[0.3, -0.8, -0.4]}>
                <cylinderGeometry args={[0.12, 0.08, 0.7, 16]} />
                <meshPhysicalMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Cauda com espinhos de gelo */}
            <mesh position={[-1, -0.1, 0]} rotation={[0, 0, 0.2]}>
                <coneGeometry args={[0.25, 1.5, 8]} />
                <meshPhysicalMaterial color={bodyColor} metalness={0.5} roughness={0.3} />
            </mesh>
            {/* Espinho da cauda */}
            <mesh position={[-1.7, -0.3, 0]}>
                <octahedronGeometry args={[0.15, 0]} />
                <meshPhysicalMaterial
                    color="#00FFFF"
                    emissive="#00FFFF"
                    emissiveIntensity={isDefeated ? 0 : 1}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Cristais de gelo flutuantes */}
            {!isDefeated && (
                <>
                    <Float speed={3} floatIntensity={0.6}>
                        <mesh position={[0.8, 1.4, 0.4]}>
                            <octahedronGeometry args={[0.12, 0]} />
                            <meshPhysicalMaterial
                                color="#00FFFF"
                                emissive="#00FFFF"
                                emissiveIntensity={1}
                                transparent
                                opacity={0.7}
                            />
                        </mesh>
                    </Float>
                    <Float speed={4} floatIntensity={0.4}>
                        <mesh position={[-0.5, 1.2, -0.3]}>
                            <octahedronGeometry args={[0.08, 0]} />
                            <meshPhysicalMaterial
                                color="#00FFFF"
                                emissive="#00FFFF"
                                emissiveIntensity={1}
                                transparent
                                opacity={0.7}
                            />
                        </mesh>
                    </Float>
                </>
            )}
        </group>
    );
};

// Cérbero 3D - Cão de 3 Cabeças do Inferno
const CerberusModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const headRefs = [useRef(), useRef(), useRef()];

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
        headRefs.forEach((ref, i) => {
            if (ref.current) {
                ref.current.rotation.y = Math.sin(state.clock.elapsedTime * (1.2 + i * 0.3) + i) * 0.2;
                ref.current.rotation.x = Math.sin(state.clock.elapsedTime * (0.8 + i * 0.2)) * 0.1;
            }
        });
    });

    const bodyColor = isDefeated ? '#222222' : '#1a1a1a';
    const fireColor = isDefeated ? '#333333' : '#FF4500';

    const DogHead = ({ headRef, position, baseRotation }) => (
        <group ref={headRef} position={position} rotation={baseRotation}>
            {/* Cabeça */}
            <mesh>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshPhysicalMaterial color={bodyColor} roughness={0.8} metalness={0.1} />
            </mesh>

            {/* Focinho */}
            <mesh position={[0.3, -0.05, 0]}>
                <boxGeometry args={[0.3, 0.2, 0.25]} />
                <meshPhysicalMaterial color={bodyColor} roughness={0.8} />
            </mesh>

            {/* Boca aberta com dentes */}
            <mesh position={[0.4, -0.15, 0]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.15, 0.1, 0.2]} />
                <meshStandardMaterial color="#3a0000" />
            </mesh>
            {/* Dentes */}
            {[-0.08, 0, 0.08].map((z, i) => (
                <mesh key={i} position={[0.35, -0.08, z]}>
                    <coneGeometry args={[0.02, 0.08, 6]} />
                    <meshStandardMaterial color="#FFFFF0" />
                </mesh>
            ))}

            {/* Orelhas pontudas */}
            <mesh position={[-0.05, 0.35, 0.18]} rotation={[0.3, 0, 0.4]}>
                <coneGeometry args={[0.08, 0.25, 4]} />
                <meshPhysicalMaterial color={bodyColor} roughness={0.8} />
            </mesh>
            <mesh position={[-0.05, 0.35, -0.18]} rotation={[-0.3, 0, 0.4]}>
                <coneGeometry args={[0.08, 0.25, 4]} />
                <meshPhysicalMaterial color={bodyColor} roughness={0.8} />
            </mesh>

            {/* Olhos de fogo */}
            <mesh position={[0.2, 0.1, 0.12]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial
                    color={fireColor}
                    emissive={fireColor}
                    emissiveIntensity={isDefeated ? 0 : 3}
                />
            </mesh>
            <mesh position={[0.2, 0.1, -0.12]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial
                    color={fireColor}
                    emissive={fireColor}
                    emissiveIntensity={isDefeated ? 0 : 3}
                />
            </mesh>
        </group>
    );

    return (
        <group ref={groupRef} scale={0.7} rotation={[0, Math.PI / 5, 0]}>
            {!isDefeated && <FireParticles />}

            {/* Corpo musculoso */}
            <mesh position={[0, 0, 0]}>
                <capsuleGeometry args={[0.5, 1.2, 16, 32]} />
                <meshPhysicalMaterial color={bodyColor} roughness={0.7} metalness={0.15} />
            </mesh>

            {/* Peito */}
            <mesh position={[0.4, 0.2, 0]}>
                <sphereGeometry args={[0.55, 32, 32]} />
                <meshPhysicalMaterial color={bodyColor} roughness={0.7} metalness={0.15} />
            </mesh>

            {/* 3 Pescoços */}
            <mesh position={[0.7, 0.5, 0]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.15, 0.25, 0.5, 16]} />
                <meshPhysicalMaterial color={bodyColor} roughness={0.7} />
            </mesh>
            <mesh position={[0.6, 0.5, 0.4]} rotation={[0.3, 0, -0.4]}>
                <cylinderGeometry args={[0.12, 0.2, 0.4, 16]} />
                <meshPhysicalMaterial color={bodyColor} roughness={0.7} />
            </mesh>
            <mesh position={[0.6, 0.5, -0.4]} rotation={[-0.3, 0, -0.4]}>
                <cylinderGeometry args={[0.12, 0.2, 0.4, 16]} />
                <meshPhysicalMaterial color={bodyColor} roughness={0.7} />
            </mesh>

            {/* 3 Cabeças */}
            <DogHead headRef={headRefs[0]} position={[0.85, 0.85, 0]} baseRotation={[0, 0, 0]} />
            <DogHead headRef={headRefs[1]} position={[0.75, 0.75, 0.5]} baseRotation={[0, -0.4, 0]} />
            <DogHead headRef={headRefs[2]} position={[0.75, 0.75, -0.5]} baseRotation={[0, 0.4, 0]} />

            {/* Patas */}
            {[[0.3, 0.35], [0.3, -0.35], [-0.4, 0.35], [-0.4, -0.35]].map(([x, z], i) => (
                <mesh key={i} position={[x, -0.75, z]}>
                    <cylinderGeometry args={[0.1, 0.08, 0.6, 16]} />
                    <meshPhysicalMaterial color={bodyColor} roughness={0.7} />
                </mesh>
            ))}

            {/* Cauda de serpente */}
            <mesh position={[-0.8, 0.1, 0]} rotation={[0, 0, 0.4]}>
                <cylinderGeometry args={[0.08, 0.03, 0.9, 8]} />
                <meshPhysicalMaterial color={bodyColor} roughness={0.7} />
            </mesh>
            <mesh position={[-1.2, 0.35, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial
                    color={fireColor}
                    emissive={fireColor}
                    emissiveIntensity={isDefeated ? 0 : 2}
                />
            </mesh>

            {/* Coleira infernal */}
            <mesh position={[0.5, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.4, 0.04, 8, 32]} />
                <meshPhysicalMaterial color="#8B0000" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Espinhos na coleira */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (i / 6) * Math.PI * 2;
                return (
                    <mesh key={i} position={[0.5 + Math.cos(angle) * 0.4, 0.35, Math.sin(angle) * 0.4]}>
                        <coneGeometry args={[0.03, 0.12, 6]} />
                        <meshPhysicalMaterial color="#8B0000" metalness={0.9} />
                    </mesh>
                );
            })}
        </group>
    );
};

// Kraken 3D - Terror das Profundezas
const KrakenModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const tentacleRefs = useRef([]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
        }
        tentacleRefs.current.forEach((ref, i) => {
            if (ref) {
                ref.rotation.x = Math.sin(state.clock.elapsedTime * 1.5 + i * 0.7) * 0.3;
                ref.rotation.z = Math.sin(state.clock.elapsedTime * 1.2 + i * 0.5) * 0.2;
            }
        });
    });

    const bodyColor = isDefeated ? '#333333' : '#6B3FA0';
    const tentacleColor = isDefeated ? '#444444' : '#8E44AD';
    const eyeColor = isDefeated ? '#333333' : '#FF6600';

    return (
        <group ref={groupRef} scale={0.65} rotation={[0.2, 0, 0]}>
            <Sparkles count={40} scale={4} size={4} speed={0.5} color="#9B59B6" />

            {/* Manto/Cabeça - Forma de sino */}
            <mesh position={[0, 0.6, 0]}>
                <sphereGeometry args={[0.9, 32, 32]} />
                <MeshDistortMaterial
                    color={bodyColor}
                    metalness={0.3}
                    roughness={0.5}
                    distort={0.2}
                    speed={1.5}
                />
            </mesh>

            {/* Topo do manto pontudo */}
            <mesh position={[0, 1.4, 0]}>
                <coneGeometry args={[0.5, 0.7, 32]} />
                <meshPhysicalMaterial color={bodyColor} metalness={0.3} roughness={0.5} />
            </mesh>

            {/* Olhos ENORMES */}
            <mesh position={[0.4, 0.7, 0.6]}>
                <sphereGeometry args={[0.28, 32, 32]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0.45, 0.75, 0.75]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial
                    color={eyeColor}
                    emissive={eyeColor}
                    emissiveIntensity={isDefeated ? 0 : 3}
                />
            </mesh>
            <mesh position={[-0.4, 0.7, 0.6]}>
                <sphereGeometry args={[0.28, 32, 32]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[-0.35, 0.75, 0.75]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial
                    color={eyeColor}
                    emissive={eyeColor}
                    emissiveIntensity={isDefeated ? 0 : 3}
                />
            </mesh>

            {/* Bico */}
            <mesh position={[0, 0.3, 0.7]} rotation={[0.3, 0, 0]}>
                <coneGeometry args={[0.12, 0.3, 4]} />
                <meshPhysicalMaterial color="#1a1a1a" metalness={0.5} />
            </mesh>

            {/* 8 Tentáculos */}
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 0.5;
                const z = Math.sin(angle) * 0.5;
                return (
                    <group
                        key={i}
                        ref={el => tentacleRefs.current[i] = el}
                        position={[x, -0.2, z]}
                        rotation={[0.6, angle, 0]}
                    >
                        {/* Tentáculo principal */}
                        <mesh>
                            <cylinderGeometry args={[0.12, 0.03, 1.8, 12]} />
                            <meshPhysicalMaterial color={tentacleColor} roughness={0.6} metalness={0.2} />
                        </mesh>
                        {/* Ventosas */}
                        {[0.3, 0.5, 0.7, 0.9].map((y, j) => (
                            <mesh key={j} position={[0.08, -y + 0.4, 0]}>
                                <sphereGeometry args={[0.04, 8, 8]} />
                                <meshStandardMaterial color="#D7BDE2" />
                            </mesh>
                        ))}
                        {/* Ponta do tentáculo */}
                        <mesh position={[0, -0.9, 0]}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshPhysicalMaterial color={tentacleColor} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
};

// Fênix Sombria 3D - Pássaro de Fogo Renascido
const PhoenixModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const wingLeftRef = useRef();
    const wingRightRef = useRef();
    const tailRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.25;
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
        }
        if (wingLeftRef.current && wingRightRef.current) {
            const wingFlap = Math.sin(state.clock.elapsedTime * 5) * 0.5;
            wingLeftRef.current.rotation.z = Math.PI * 0.15 + wingFlap;
            wingRightRef.current.rotation.z = -Math.PI * 0.15 - wingFlap;
        }
        if (tailRef.current) {
            tailRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    const bodyColor = isDefeated ? '#444444' : '#DC143C';
    const flameColor = isDefeated ? '#555555' : '#FF4500';
    const glowColor = isDefeated ? '#333333' : '#FFD700';

    return (
        <group ref={groupRef} scale={0.7} rotation={[0.1, Math.PI / 5, 0]}>
            {!isDefeated && <FireParticles color="#FFD700" />}

            {/* Corpo */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshPhysicalMaterial
                    color={bodyColor}
                    metalness={0.4}
                    roughness={0.4}
                    emissive={flameColor}
                    emissiveIntensity={isDefeated ? 0 : 0.3}
                />
            </mesh>

            {/* Peito */}
            <mesh position={[0.3, 0, 0]}>
                <sphereGeometry args={[0.45, 32, 32]} />
                <meshPhysicalMaterial
                    color={glowColor}
                    metalness={0.5}
                    roughness={0.3}
                    emissive={glowColor}
                    emissiveIntensity={isDefeated ? 0 : 0.4}
                />
            </mesh>

            {/* Pescoço */}
            <mesh position={[0.6, 0.4, 0]} rotation={[0, 0, -0.6]}>
                <cylinderGeometry args={[0.12, 0.18, 0.6, 16]} />
                <meshPhysicalMaterial color={bodyColor} metalness={0.4} roughness={0.4} />
            </mesh>

            {/* Cabeça */}
            <group position={[0.85, 0.75, 0]}>
                <mesh>
                    <sphereGeometry args={[0.25, 32, 32]} />
                    <meshPhysicalMaterial color={bodyColor} metalness={0.4} roughness={0.4} />
                </mesh>

                {/* Bico dourado */}
                <mesh position={[0.25, -0.02, 0]} rotation={[0, 0, -0.15]}>
                    <coneGeometry args={[0.06, 0.3, 4]} />
                    <meshPhysicalMaterial color={glowColor} metalness={0.8} roughness={0.2} clearcoat={1} />
                </mesh>

                {/* Crista de fogo */}
                <Float speed={4} floatIntensity={0.3}>
                    <mesh position={[-0.05, 0.35, 0]}>
                        <coneGeometry args={[0.12, 0.45, 6]} />
                        <meshStandardMaterial
                            color={flameColor}
                            emissive={flameColor}
                            emissiveIntensity={isDefeated ? 0 : 2}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>
                </Float>
                <Float speed={5} floatIntensity={0.2}>
                    <mesh position={[-0.15, 0.3, 0.08]}>
                        <coneGeometry args={[0.08, 0.3, 6]} />
                        <meshStandardMaterial
                            color={glowColor}
                            emissive={glowColor}
                            emissiveIntensity={isDefeated ? 0 : 2}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                </Float>

                {/* Olhos flamejantes */}
                <mesh position={[0.12, 0.08, 0.12]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial
                        color={glowColor}
                        emissive={glowColor}
                        emissiveIntensity={isDefeated ? 0 : 3}
                    />
                </mesh>
                <mesh position={[0.12, 0.08, -0.12]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial
                        color={glowColor}
                        emissive={glowColor}
                        emissiveIntensity={isDefeated ? 0 : 3}
                    />
                </mesh>
            </group>

            {/* Asa Esquerda - Penas de fogo */}
            <group ref={wingLeftRef} position={[-0.1, 0.15, 0.5]}>
                <mesh rotation={[0.6, 0.2, 0]}>
                    <planeGeometry args={[1.6, 1.1]} />
                    <meshStandardMaterial
                        color={flameColor}
                        emissive={flameColor}
                        emissiveIntensity={isDefeated ? 0 : 0.8}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.85}
                    />
                </mesh>
                {/* Detalhes de penas */}
                <mesh position={[0.6, 0.2, 0.05]} rotation={[0.4, 0.1, 0.2]}>
                    <coneGeometry args={[0.08, 0.6, 4]} />
                    <meshStandardMaterial
                        color={glowColor}
                        emissive={glowColor}
                        emissiveIntensity={isDefeated ? 0 : 1}
                    />
                </mesh>
            </group>

            {/* Asa Direita */}
            <group ref={wingRightRef} position={[-0.1, 0.15, -0.5]}>
                <mesh rotation={[-0.6, -0.2, 0]}>
                    <planeGeometry args={[1.6, 1.1]} />
                    <meshStandardMaterial
                        color={flameColor}
                        emissive={flameColor}
                        emissiveIntensity={isDefeated ? 0 : 0.8}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.85}
                    />
                </mesh>
                <mesh position={[0.6, 0.2, -0.05]} rotation={[-0.4, -0.1, 0.2]}>
                    <coneGeometry args={[0.08, 0.6, 4]} />
                    <meshStandardMaterial
                        color={glowColor}
                        emissive={glowColor}
                        emissiveIntensity={isDefeated ? 0 : 1}
                    />
                </mesh>
            </group>

            {/* Cauda de fogo majestica */}
            <group ref={tailRef} position={[-0.7, -0.1, 0]}>
                {[-0.15, 0, 0.15].map((z, i) => (
                    <mesh key={i} position={[-0.3 - i * 0.15, -0.1 + i * 0.05, z]} rotation={[0, 0, 0.3 + i * 0.1]}>
                        <coneGeometry args={[0.1 - i * 0.02, 0.9 - i * 0.1, 6]} />
                        <meshStandardMaterial
                            color={i === 1 ? glowColor : flameColor}
                            emissive={i === 1 ? glowColor : flameColor}
                            emissiveIntensity={isDefeated ? 0 : 1.2}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>
                ))}
            </group>

            {/* Patas */}
            <mesh position={[0.2, -0.6, 0.15]}>
                <cylinderGeometry args={[0.05, 0.03, 0.5, 8]} />
                <meshPhysicalMaterial color={glowColor} metalness={0.6} />
            </mesh>
            <mesh position={[0.2, -0.6, -0.15]}>
                <cylinderGeometry args={[0.05, 0.03, 0.5, 8]} />
                <meshPhysicalMaterial color={glowColor} metalness={0.6} />
            </mesh>
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
            height: '220px',
            opacity: locked ? 0.5 : 1,
            filter: locked ? 'grayscale(80%) blur(2px)' : 'none',
            transition: 'all 0.3s ease',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            <Canvas
                camera={{ position: [0, 0.5, 4.5], fov: 45 }}
                style={{ background: 'transparent' }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Iluminação dramática */}
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
                <pointLight position={[-5, -3, 5]} intensity={0.6} color="#00ff88" />
                <pointLight position={[0, -5, 0]} intensity={0.4} color="#ff3366" />
                <spotLight
                    position={[0, 8, 0]}
                    angle={0.4}
                    penumbra={0.8}
                    intensity={1}
                    color="#ffffff"
                    castShadow
                />

                {/* Estrelas de fundo */}
                {!locked && <Stars radius={50} depth={30} count={300} factor={3} saturation={0.5} />}

                <Float speed={1.2} floatIntensity={0.25} rotationIntensity={0.15}>
                    <ModelComponent isAttacking={isAttacking} isDefeated={isDefeated} />
                </Float>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={!locked && !isDefeated}
                    autoRotateSpeed={0.8}
                    maxPolarAngle={Math.PI / 1.6}
                    minPolarAngle={Math.PI / 3.5}
                />
            </Canvas>
        </div>
    );
};

export default Boss3DScene;
