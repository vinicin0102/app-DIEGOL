import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ========== STYLIZED 3D BOSS MODELS - BRIGHT & VIBRANT ==========

// O Procrastinador (Megalodon) - Tubarão Estilizado BRILHANTE
const MegalodonModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const jawRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
        }
        if (jawRef.current) {
            jawRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.1;
        }
    });

    const mainColor = isDefeated ? '#555555' : '#00CED1'; // Cyan vibrante
    const accentColor = isDefeated ? '#444444' : '#00FFFF';
    const bellyColor = isDefeated ? '#666666' : '#E0FFFF';

    return (
        <group ref={groupRef} scale={0.85} rotation={[0, Math.PI / 6, 0]}>
            {!isDefeated && <Sparkles count={30} scale={4} size={4} speed={0.5} color="#00FFFF" />}

            {/* Corpo Principal */}
            <mesh position={[0, 0, 0]}>
                <capsuleGeometry args={[0.55, 1.8, 16, 32]} />
                <meshStandardMaterial
                    color={mainColor}
                    emissive={mainColor}
                    emissiveIntensity={isDefeated ? 0 : 0.4}
                    metalness={0.3}
                    roughness={0.4}
                />
            </mesh>

            {/* Barriga clara */}
            <mesh position={[0, -0.15, 0.1]}>
                <capsuleGeometry args={[0.4, 1.5, 16, 32]} />
                <meshStandardMaterial color={bellyColor} emissive={bellyColor} emissiveIntensity={0.2} />
            </mesh>

            {/* Cabeça cônica */}
            <mesh position={[1.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <coneGeometry args={[0.5, 1, 32]} />
                <meshStandardMaterial color={mainColor} emissive={mainColor} emissiveIntensity={0.3} />
            </mesh>

            {/* Mandíbula */}
            <group ref={jawRef} position={[1.4, -0.1, 0]}>
                <mesh rotation={[0, 0, -Math.PI / 2]}>
                    <coneGeometry args={[0.25, 0.5, 16]} />
                    <meshStandardMaterial color={mainColor} emissive={mainColor} emissiveIntensity={0.3} />
                </mesh>
            </group>

            {/* Barbatana Dorsal ENORME */}
            <mesh position={[-0.2, 0.85, 0]} rotation={[0, 0, 0.1]}>
                <coneGeometry args={[0.35, 1.1, 4]} />
                <meshStandardMaterial color={mainColor} emissive={accentColor} emissiveIntensity={0.5} />
            </mesh>

            {/* Barbatanas Laterais */}
            <mesh position={[0.2, -0.25, 0.65]} rotation={[0.5, 0.3, 0.2]}>
                <coneGeometry args={[0.2, 0.7, 4]} />
                <meshStandardMaterial color={mainColor} emissive={mainColor} emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0.2, -0.25, -0.65]} rotation={[-0.5, -0.3, 0.2]}>
                <coneGeometry args={[0.2, 0.7, 4]} />
                <meshStandardMaterial color={mainColor} emissive={mainColor} emissiveIntensity={0.3} />
            </mesh>

            {/* Cauda */}
            <group position={[-1.4, 0, 0]}>
                <mesh position={[-0.2, 0.4, 0]} rotation={[0, 0, 0.4]}>
                    <coneGeometry args={[0.12, 0.6, 4]} />
                    <meshStandardMaterial color={mainColor} emissive={accentColor} emissiveIntensity={0.4} />
                </mesh>
                <mesh position={[-0.15, -0.3, 0]} rotation={[0, 0, -0.4]}>
                    <coneGeometry args={[0.1, 0.45, 4]} />
                    <meshStandardMaterial color={mainColor} emissive={accentColor} emissiveIntensity={0.4} />
                </mesh>
            </group>

            {/* Olhos BRILHANTES */}
            <mesh position={[1.0, 0.15, 0.32]}>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[1.05, 0.18, 0.36]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={3} />
            </mesh>
            <mesh position={[1.0, 0.15, -0.32]}>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[1.05, 0.18, -0.36]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={3} />
            </mesh>

            {/* Dentes brancos brilhantes */}
            {[-0.15, -0.05, 0.05, 0.15].map((z, i) => (
                <mesh key={i} position={[1.6, 0.02, z]}>
                    <coneGeometry args={[0.03, 0.15, 8]} />
                    <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
                </mesh>
            ))}
        </group>
    );
};

// Tigre Dentes de Sabre - Laranja Vibrante
const SaberToothModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const tailRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
        }
        if (tailRef.current) {
            tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.3;
        }
    });

    const furColor = isDefeated ? '#555555' : '#FF8C00'; // Laranja forte
    const stripeColor = isDefeated ? '#333333' : '#8B4513';
    const bellyColor = isDefeated ? '#666666' : '#FFE4B5';

    return (
        <group ref={groupRef} scale={0.75} rotation={[0, Math.PI / 5, 0]}>
            {!isDefeated && <Sparkles count={25} scale={3.5} size={3} speed={0.4} color="#FFD700" />}

            {/* Corpo */}
            <mesh position={[0, 0, 0]}>
                <capsuleGeometry args={[0.4, 1.3, 16, 32]} />
                <meshStandardMaterial color={furColor} emissive={furColor} emissiveIntensity={0.3} />
            </mesh>

            {/* Barriga */}
            <mesh position={[0.3, -0.1, 0]}>
                <sphereGeometry args={[0.45, 32, 32]} />
                <meshStandardMaterial color={bellyColor} emissive={bellyColor} emissiveIntensity={0.2} />
            </mesh>

            {/* Pescoço */}
            <mesh position={[0.75, 0.25, 0]} rotation={[0, 0, -0.4]}>
                <cylinderGeometry args={[0.2, 0.3, 0.45, 16]} />
                <meshStandardMaterial color={furColor} emissive={furColor} emissiveIntensity={0.3} />
            </mesh>

            {/* Cabeça */}
            <group position={[1.05, 0.45, 0]}>
                <mesh>
                    <sphereGeometry args={[0.35, 32, 32]} />
                    <meshStandardMaterial color={furColor} emissive={furColor} emissiveIntensity={0.3} />
                </mesh>

                {/* Focinho */}
                <mesh position={[0.3, -0.03, 0]}>
                    <boxGeometry args={[0.28, 0.2, 0.28]} />
                    <meshStandardMaterial color={furColor} emissive={furColor} emissiveIntensity={0.25} />
                </mesh>

                {/* Nariz */}
                <mesh position={[0.45, 0, 0]}>
                    <sphereGeometry args={[0.06, 16, 16]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>

                {/* DENTES DE SABRE GIGANTES E BRILHANTES */}
                <mesh position={[0.28, -0.42, 0.1]} rotation={[0.05, 0, 0]}>
                    <coneGeometry args={[0.045, 0.55, 8]} />
                    <meshStandardMaterial color="#FFFFF0" emissive="#FFFFFF" emissiveIntensity={0.8} />
                </mesh>
                <mesh position={[0.28, -0.42, -0.1]} rotation={[-0.05, 0, 0]}>
                    <coneGeometry args={[0.045, 0.55, 8]} />
                    <meshStandardMaterial color="#FFFFF0" emissive="#FFFFFF" emissiveIntensity={0.8} />
                </mesh>

                {/* Orelhas */}
                <mesh position={[-0.02, 0.32, 0.18]} rotation={[0.3, 0, 0.25]}>
                    <coneGeometry args={[0.08, 0.18, 4]} />
                    <meshStandardMaterial color={furColor} emissive={furColor} emissiveIntensity={0.3} />
                </mesh>
                <mesh position={[-0.02, 0.32, -0.18]} rotation={[-0.3, 0, 0.25]}>
                    <coneGeometry args={[0.08, 0.18, 4]} />
                    <meshStandardMaterial color={furColor} emissive={furColor} emissiveIntensity={0.3} />
                </mesh>

                {/* Olhos amarelos brilhantes */}
                <mesh position={[0.18, 0.08, 0.17]}>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <meshStandardMaterial color="#FFFF00" emissive="#FFD700" emissiveIntensity={2} />
                </mesh>
                <mesh position={[0.18, 0.08, -0.17]}>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <meshStandardMaterial color="#FFFF00" emissive="#FFD700" emissiveIntensity={2} />
                </mesh>
            </group>

            {/* Listras */}
            {[-0.25, 0, 0.25].map((x, i) => (
                <mesh key={i} position={[x, 0.25, 0]} rotation={[Math.PI / 2, 0, 0.15 + i * 0.1]}>
                    <boxGeometry args={[0.06, 0.8, 0.02]} />
                    <meshStandardMaterial color={stripeColor} />
                </mesh>
            ))}

            {/* Patas */}
            {[[0.4, 0.3], [0.4, -0.3], [-0.4, 0.3], [-0.4, -0.3]].map(([x, z], i) => (
                <mesh key={i} position={[x, -0.52, z]}>
                    <cylinderGeometry args={[0.09, 0.07, 0.5, 16]} />
                    <meshStandardMaterial color={furColor} emissive={furColor} emissiveIntensity={0.25} />
                </mesh>
            ))}

            {/* Cauda */}
            <group ref={tailRef} position={[-0.9, 0.15, 0]}>
                <mesh rotation={[0, 0, 0.5]}>
                    <cylinderGeometry args={[0.05, 0.03, 0.7, 8]} />
                    <meshStandardMaterial color={furColor} emissive={furColor} emissiveIntensity={0.3} />
                </mesh>
            </group>
        </group>
    );
};

// Dragão de Gelo - Azul Cristalino Brilhante
const IceDragonModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const wingLeftRef = useRef();
    const wingRightRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.18;
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
        }
        if (wingLeftRef.current && wingRightRef.current) {
            const wingFlap = Math.sin(state.clock.elapsedTime * 2.5) * 0.35;
            wingLeftRef.current.rotation.z = 0.25 + wingFlap;
            wingRightRef.current.rotation.z = -0.25 - wingFlap;
        }
    });

    const bodyColor = isDefeated ? '#555555' : '#00BFFF'; // Azul céu
    const crystalColor = isDefeated ? '#444444' : '#00FFFF';
    const scaleColor = isDefeated ? '#666666' : '#87CEEB';

    return (
        <group ref={groupRef} scale={0.6} rotation={[0.1, Math.PI / 6, 0]}>
            {!isDefeated && <Sparkles count={40} scale={4.5} size={5} speed={0.3} color="#00FFFF" />}

            {/* Corpo principal brilhante */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.85, 32, 32]} />
                <MeshWobbleMaterial
                    color={bodyColor}
                    emissive={bodyColor}
                    emissiveIntensity={0.5}
                    factor={0.1}
                    speed={2}
                />
            </mesh>

            {/* Escamas cristalinas */}
            <mesh position={[0, 0.15, 0]}>
                <icosahedronGeometry args={[0.9, 1]} />
                <meshStandardMaterial
                    color={crystalColor}
                    emissive={crystalColor}
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Pescoço */}
            <mesh position={[0.7, 0.45, 0]} rotation={[0, 0, -0.55]}>
                <cylinderGeometry args={[0.18, 0.3, 1, 16]} />
                <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.4} />
            </mesh>

            {/* Cabeça */}
            <group position={[1.15, 0.9, 0]}>
                <mesh>
                    <boxGeometry args={[0.6, 0.35, 0.35]} />
                    <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.4} />
                </mesh>

                {/* Focinho */}
                <mesh position={[0.35, -0.03, 0]} rotation={[0, 0, -0.1]}>
                    <coneGeometry args={[0.12, 0.45, 8]} />
                    <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.4} />
                </mesh>

                {/* Chifres de gelo BRILHANTES */}
                <mesh position={[-0.08, 0.32, 0.1]} rotation={[0.25, 0, -0.35]}>
                    <coneGeometry args={[0.05, 0.45, 6]} />
                    <meshStandardMaterial color={crystalColor} emissive={crystalColor} emissiveIntensity={1.5} transparent opacity={0.9} />
                </mesh>
                <mesh position={[-0.08, 0.32, -0.1]} rotation={[-0.25, 0, -0.35]}>
                    <coneGeometry args={[0.05, 0.45, 6]} />
                    <meshStandardMaterial color={crystalColor} emissive={crystalColor} emissiveIntensity={1.5} transparent opacity={0.9} />
                </mesh>

                {/* Olhos azuis gelados */}
                <mesh position={[0.12, 0.08, 0.12]}>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={3} />
                </mesh>
                <mesh position={[0.12, 0.08, -0.12]}>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={3} />
                </mesh>
            </group>

            {/* Asas cristalinas */}
            <group ref={wingLeftRef} position={[-0.15, 0.35, 0.75]}>
                <mesh rotation={[0.7, 0, 0]}>
                    <planeGeometry args={[1.6, 1.2]} />
                    <meshStandardMaterial
                        color={scaleColor}
                        emissive={crystalColor}
                        emissiveIntensity={0.6}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.7}
                    />
                </mesh>
            </group>
            <group ref={wingRightRef} position={[-0.15, 0.35, -0.75]}>
                <mesh rotation={[-0.7, 0, 0]}>
                    <planeGeometry args={[1.6, 1.2]} />
                    <meshStandardMaterial
                        color={scaleColor}
                        emissive={crystalColor}
                        emissiveIntensity={0.6}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.7}
                    />
                </mesh>
            </group>

            {/* Patas */}
            <mesh position={[0.25, -0.75, 0.35]}>
                <cylinderGeometry args={[0.1, 0.07, 0.6, 16]} />
                <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0.25, -0.75, -0.35]}>
                <cylinderGeometry args={[0.1, 0.07, 0.6, 16]} />
                <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.3} />
            </mesh>

            {/* Cauda com cristal */}
            <mesh position={[-0.95, -0.08, 0]} rotation={[0, 0, 0.18]}>
                <coneGeometry args={[0.22, 1.3, 8]} />
                <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[-1.55, -0.22, 0]}>
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial color={crystalColor} emissive={crystalColor} emissiveIntensity={2} transparent opacity={0.85} />
            </mesh>
        </group>
    );
};

// Cérbero - Preto com Fogo Vermelho
const CerberusModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const headRefs = [useRef(), useRef(), useRef()];

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.1;
        }
        headRefs.forEach((ref, i) => {
            if (ref.current) {
                ref.current.rotation.y = Math.sin(state.clock.elapsedTime * (1.1 + i * 0.25) + i * 0.8) * 0.18;
                ref.current.rotation.x = Math.sin(state.clock.elapsedTime * (0.7 + i * 0.15)) * 0.08;
            }
        });
    });

    const bodyColor = isDefeated ? '#333333' : '#2F2F2F';
    const fireColor = isDefeated ? '#555555' : '#FF4500';
    const glowColor = isDefeated ? '#444444' : '#FF6600';

    const DogHead = ({ headRef, position, baseRotation }) => (
        <group ref={headRef} position={position} rotation={baseRotation}>
            <mesh>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.2} />
            </mesh>

            {/* Focinho */}
            <mesh position={[0.25, -0.04, 0]}>
                <boxGeometry args={[0.25, 0.16, 0.2]} />
                <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.2} />
            </mesh>

            {/* Orelhas */}
            <mesh position={[-0.03, 0.28, 0.14]} rotation={[0.25, 0, 0.35]}>
                <coneGeometry args={[0.06, 0.2, 4]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh position={[-0.03, 0.28, -0.14]} rotation={[-0.25, 0, 0.35]}>
                <coneGeometry args={[0.06, 0.2, 4]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>

            {/* Olhos DE FOGO */}
            <mesh position={[0.16, 0.08, 0.1]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color={fireColor} emissive={fireColor} emissiveIntensity={4} />
            </mesh>
            <mesh position={[0.16, 0.08, -0.1]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color={fireColor} emissive={fireColor} emissiveIntensity={4} />
            </mesh>

            {/* Dentes */}
            {[-0.06, 0, 0.06].map((z, i) => (
                <mesh key={i} position={[0.35, -0.06, z]}>
                    <coneGeometry args={[0.018, 0.07, 6]} />
                    <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
                </mesh>
            ))}
        </group>
    );

    return (
        <group ref={groupRef} scale={0.7} rotation={[0, Math.PI / 5, 0]}>
            {!isDefeated && <Sparkles count={35} scale={3.5} size={4} speed={1} color="#FF4500" />}

            {/* Corpo */}
            <mesh position={[0, 0, 0]}>
                <capsuleGeometry args={[0.45, 1.1, 16, 32]} />
                <meshStandardMaterial color={bodyColor} emissive={glowColor} emissiveIntensity={0.15} />
            </mesh>

            {/* Peito */}
            <mesh position={[0.35, 0.15, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={bodyColor} emissive={glowColor} emissiveIntensity={0.15} />
            </mesh>

            {/* Pescoços */}
            <mesh position={[0.6, 0.45, 0]} rotation={[0, 0, -0.45]}>
                <cylinderGeometry args={[0.12, 0.2, 0.45, 16]} />
                <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.5, 0.42, 0.35]} rotation={[0.25, 0, -0.35]}>
                <cylinderGeometry args={[0.1, 0.16, 0.35, 16]} />
                <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.5, 0.42, -0.35]} rotation={[-0.25, 0, -0.35]}>
                <cylinderGeometry args={[0.1, 0.16, 0.35, 16]} />
                <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.2} />
            </mesh>

            {/* 3 Cabeças */}
            <DogHead headRef={headRefs[0]} position={[0.78, 0.78, 0]} baseRotation={[0, 0, 0]} />
            <DogHead headRef={headRefs[1]} position={[0.68, 0.68, 0.45]} baseRotation={[0, -0.35, 0]} />
            <DogHead headRef={headRefs[2]} position={[0.68, 0.68, -0.45]} baseRotation={[0, 0.35, 0]} />

            {/* Patas */}
            {[[0.25, 0.3], [0.25, -0.3], [-0.35, 0.3], [-0.35, -0.3]].map(([x, z], i) => (
                <mesh key={i} position={[x, -0.7, z]}>
                    <cylinderGeometry args={[0.08, 0.06, 0.55, 16]} />
                    <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.1} />
                </mesh>
            ))}

            {/* Cauda com ponta de fogo */}
            <mesh position={[-0.75, 0.08, 0]} rotation={[0, 0, 0.35]}>
                <cylinderGeometry args={[0.06, 0.025, 0.8, 8]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh position={[-1.1, 0.28, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={fireColor} emissive={fireColor} emissiveIntensity={3} />
            </mesh>

            {/* Coleira infernal */}
            <mesh position={[0.42, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.35, 0.035, 8, 32]} />
                <meshStandardMaterial color="#8B0000" emissive="#FF0000" emissiveIntensity={0.5} metalness={0.9} />
            </mesh>
        </group>
    );
};

// Kraken - Roxo Místico
const KrakenModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const tentacleRefs = useRef([]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.12;
        }
        tentacleRefs.current.forEach((ref, i) => {
            if (ref) {
                ref.rotation.x = Math.sin(state.clock.elapsedTime * 1.4 + i * 0.6) * 0.28;
                ref.rotation.z = Math.sin(state.clock.elapsedTime * 1.1 + i * 0.45) * 0.18;
            }
        });
    });

    const bodyColor = isDefeated ? '#444444' : '#9B30FF'; // Roxo vibrante
    const tentacleColor = isDefeated ? '#555555' : '#BA55D3';
    const eyeColor = isDefeated ? '#333333' : '#FF6600';

    return (
        <group ref={groupRef} scale={0.65} rotation={[0.18, 0, 0]}>
            {!isDefeated && <Sparkles count={35} scale={4} size={4} speed={0.4} color="#DA70D6" />}

            {/* Manto/Cabeça */}
            <mesh position={[0, 0.55, 0]}>
                <sphereGeometry args={[0.85, 32, 32]} />
                <MeshWobbleMaterial
                    color={bodyColor}
                    emissive={bodyColor}
                    emissiveIntensity={0.5}
                    factor={0.15}
                    speed={1.5}
                />
            </mesh>

            {/* Topo pontudo */}
            <mesh position={[0, 1.35, 0]}>
                <coneGeometry args={[0.45, 0.65, 32]} />
                <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.4} />
            </mesh>

            {/* Olhos ENORMES */}
            <mesh position={[0.35, 0.65, 0.55]}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0.4, 0.7, 0.7]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={3.5} />
            </mesh>
            <mesh position={[-0.35, 0.65, 0.55]}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[-0.3, 0.7, 0.7]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={3.5} />
            </mesh>

            {/* Bico */}
            <mesh position={[0, 0.28, 0.65]} rotation={[0.25, 0, 0]}>
                <coneGeometry args={[0.1, 0.25, 4]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* 8 Tentáculos */}
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 0.45;
                const z = Math.sin(angle) * 0.45;
                return (
                    <group
                        key={i}
                        ref={el => tentacleRefs.current[i] = el}
                        position={[x, -0.2, z]}
                        rotation={[0.55, angle, 0]}
                    >
                        <mesh>
                            <cylinderGeometry args={[0.1, 0.025, 1.6, 12]} />
                            <meshStandardMaterial color={tentacleColor} emissive={tentacleColor} emissiveIntensity={0.4} />
                        </mesh>
                        {/* Ventosas brilhantes */}
                        {[0.25, 0.45, 0.65, 0.85].map((y, j) => (
                            <mesh key={j} position={[0.07, -y + 0.35, 0]}>
                                <sphereGeometry args={[0.035, 8, 8]} />
                                <meshStandardMaterial color="#E6E6FA" emissive="#E6E6FA" emissiveIntensity={0.5} />
                            </mesh>
                        ))}
                    </group>
                );
            })}
        </group>
    );
};

// Fênix Sombria - Vermelho e Dourado FLAMEJANTE
const PhoenixModel = ({ isAttacking, isDefeated }) => {
    const groupRef = useRef();
    const wingLeftRef = useRef();
    const wingRightRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.22;
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
        }
        if (wingLeftRef.current && wingRightRef.current) {
            const wingFlap = Math.sin(state.clock.elapsedTime * 4.5) * 0.45;
            wingLeftRef.current.rotation.z = Math.PI * 0.12 + wingFlap;
            wingRightRef.current.rotation.z = -Math.PI * 0.12 - wingFlap;
        }
    });

    const bodyColor = isDefeated ? '#444444' : '#DC143C';
    const flameColor = isDefeated ? '#555555' : '#FF4500';
    const goldColor = isDefeated ? '#666666' : '#FFD700';

    return (
        <group ref={groupRef} scale={0.7} rotation={[0.08, Math.PI / 5, 0]}>
            {!isDefeated && <Sparkles count={50} scale={4} size={5} speed={1.5} color="#FFD700" />}

            {/* Corpo brilhante */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.55, 32, 32]} />
                <meshStandardMaterial
                    color={bodyColor}
                    emissive={flameColor}
                    emissiveIntensity={0.6}
                />
            </mesh>

            {/* Peito dourado */}
            <mesh position={[0.25, 0, 0]}>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial color={goldColor} emissive={goldColor} emissiveIntensity={0.8} />
            </mesh>

            {/* Pescoço */}
            <mesh position={[0.55, 0.35, 0]} rotation={[0, 0, -0.55]}>
                <cylinderGeometry args={[0.1, 0.15, 0.55, 16]} />
                <meshStandardMaterial color={bodyColor} emissive={flameColor} emissiveIntensity={0.5} />
            </mesh>

            {/* Cabeça */}
            <group position={[0.78, 0.68, 0]}>
                <mesh>
                    <sphereGeometry args={[0.22, 32, 32]} />
                    <meshStandardMaterial color={bodyColor} emissive={flameColor} emissiveIntensity={0.5} />
                </mesh>

                {/* Bico dourado brilhante */}
                <mesh position={[0.22, -0.02, 0]} rotation={[0, 0, -0.12]}>
                    <coneGeometry args={[0.05, 0.28, 4]} />
                    <meshStandardMaterial color={goldColor} emissive={goldColor} emissiveIntensity={1.2} />
                </mesh>

                {/* Crista de FOGO */}
                <Float speed={5} floatIntensity={0.35}>
                    <mesh position={[-0.03, 0.32, 0]}>
                        <coneGeometry args={[0.1, 0.4, 6]} />
                        <meshStandardMaterial color={flameColor} emissive={flameColor} emissiveIntensity={2.5} transparent opacity={0.9} />
                    </mesh>
                </Float>
                <Float speed={6} floatIntensity={0.25}>
                    <mesh position={[-0.12, 0.28, 0.06]}>
                        <coneGeometry args={[0.065, 0.28, 6]} />
                        <meshStandardMaterial color={goldColor} emissive={goldColor} emissiveIntensity={2} transparent opacity={0.85} />
                    </mesh>
                </Float>

                {/* Olhos */}
                <mesh position={[0.1, 0.06, 0.1]}>
                    <sphereGeometry args={[0.045, 16, 16]} />
                    <meshStandardMaterial color={goldColor} emissive={goldColor} emissiveIntensity={4} />
                </mesh>
                <mesh position={[0.1, 0.06, -0.1]}>
                    <sphereGeometry args={[0.045, 16, 16]} />
                    <meshStandardMaterial color={goldColor} emissive={goldColor} emissiveIntensity={4} />
                </mesh>
            </group>

            {/* Asas de FOGO */}
            <group ref={wingLeftRef} position={[-0.08, 0.12, 0.45]}>
                <mesh rotation={[0.55, 0.18, 0]}>
                    <planeGeometry args={[1.5, 1]} />
                    <meshStandardMaterial
                        color={flameColor}
                        emissive={flameColor}
                        emissiveIntensity={1.2}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.85}
                    />
                </mesh>
            </group>
            <group ref={wingRightRef} position={[-0.08, 0.12, -0.45]}>
                <mesh rotation={[-0.55, -0.18, 0]}>
                    <planeGeometry args={[1.5, 1]} />
                    <meshStandardMaterial
                        color={flameColor}
                        emissive={flameColor}
                        emissiveIntensity={1.2}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.85}
                    />
                </mesh>
            </group>

            {/* Cauda de fogo majestica */}
            <group position={[-0.65, -0.08, 0]}>
                {[-0.12, 0, 0.12].map((z, i) => (
                    <mesh key={i} position={[-0.25 - i * 0.12, -0.08 + i * 0.04, z]} rotation={[0, 0, 0.28 + i * 0.08]}>
                        <coneGeometry args={[0.08 - i * 0.015, 0.8 - i * 0.08, 6]} />
                        <meshStandardMaterial
                            color={i === 1 ? goldColor : flameColor}
                            emissive={i === 1 ? goldColor : flameColor}
                            emissiveIntensity={1.8}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>
                ))}
            </group>

            {/* Patas douradas */}
            <mesh position={[0.18, -0.55, 0.12]}>
                <cylinderGeometry args={[0.04, 0.025, 0.45, 8]} />
                <meshStandardMaterial color={goldColor} emissive={goldColor} emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0.18, -0.55, -0.12]}>
                <cylinderGeometry args={[0.04, 0.025, 0.45, 8]} />
                <meshStandardMaterial color={goldColor} emissive={goldColor} emissiveIntensity={0.8} />
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
            filter: locked ? 'grayscale(70%) blur(1px)' : 'none',
            transition: 'all 0.3s ease',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            <Canvas
                camera={{ position: [0, 0.4, 4], fov: 45 }}
                style={{ background: 'transparent' }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* ILUMINAÇÃO FORTE E BRILHANTE */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
                <directionalLight position={[-5, 3, 5]} intensity={1} color="#00ff88" />
                <pointLight position={[0, 3, 3]} intensity={1.2} color="#ffffff" />
                <pointLight position={[0, -3, 2]} intensity={0.6} color="#ff3366" />
                <spotLight
                    position={[0, 6, 0]}
                    angle={0.5}
                    penumbra={0.6}
                    intensity={1.5}
                    color="#ffffff"
                />

                <Float speed={1.2} floatIntensity={0.2} rotationIntensity={0.1}>
                    <ModelComponent isAttacking={isAttacking} isDefeated={isDefeated} />
                </Float>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={!locked && !isDefeated}
                    autoRotateSpeed={0.7}
                    maxPolarAngle={Math.PI / 1.7}
                    minPolarAngle={Math.PI / 3.5}
                />
            </Canvas>
        </div>
    );
};

export default Boss3DScene;
