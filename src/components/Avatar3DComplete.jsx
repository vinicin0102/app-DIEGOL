import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2, Sword, Shield, X, Check, Camera } from 'lucide-react';

// === SISTEMA DE TIERS DE EQUIPAMENTOS ===
const EQUIPMENT_TIERS = [
    {
        id: 'wood', name: 'Madeira', emoji: '🪵',
        minLevel: 0, minBosses: 0,
        color: '#8B4513', accent: '#5D3A1A', metalness: 0.1, roughness: 0.8,
        glowColor: 'rgba(139, 69, 19, 0.4)',
        description: 'Equipamento de iniciante',
        emissive: null, emissiveIntensity: 0
    },
    {
        id: 'bronze', name: 'Bronze', emoji: '🥉',
        minLevel: 5, minBosses: 1,
        color: '#CD7F32', accent: '#B87333', metalness: 0.7, roughness: 0.3,
        glowColor: 'rgba(205, 127, 50, 0.5)',
        description: 'Forjado pelo esforço',
        emissive: null, emissiveIntensity: 0
    },
    {
        id: 'iron', name: 'Ferro', emoji: '🔩',
        minLevel: 10, minBosses: 2,
        color: '#71797E', accent: '#4A4A4A', metalness: 0.8, roughness: 0.25,
        glowColor: 'rgba(113, 121, 126, 0.5)',
        description: 'Resistente e confiável',
        emissive: null, emissiveIntensity: 0
    },
    {
        id: 'steel', name: 'Aço', emoji: '⚔️',
        minLevel: 20, minBosses: 3,
        color: '#C0C0C0', accent: '#E8E8E8', metalness: 0.9, roughness: 0.15,
        glowColor: 'rgba(192, 192, 192, 0.6)',
        description: 'Lâmina afiada',
        emissive: '#FFFFFF', emissiveIntensity: 0.1
    },
    {
        id: 'gold', name: 'Ouro', emoji: '🥇',
        minLevel: 30, minBosses: 4,
        color: '#FFD700', accent: '#FFA500', metalness: 0.95, roughness: 0.05,
        glowColor: 'rgba(255, 215, 0, 0.6)',
        emissive: '#FFD700', emissiveIntensity: 0.4,
        description: 'Brilho da vitória'
    },
    {
        id: 'diamond', name: 'Diamante', emoji: '💎',
        minLevel: 40, minBosses: 5,
        color: '#00FFFF', accent: '#E0FFFF', metalness: 0.2, roughness: 0.0,
        glowColor: 'rgba(0, 255, 255, 0.6)',
        emissive: '#00FFFF', emissiveIntensity: 0.5,
        description: 'Indestrutível',
        isTransparent: true
    },
    {
        id: 'legendary', name: 'Lendário', emoji: '🔥',
        minLevel: 50, minBosses: 6,
        color: '#FF3366', accent: '#FF6B6B', metalness: 0.9, roughness: 0.1,
        glowColor: 'rgba(255, 51, 102, 0.7)',
        emissive: '#FF3366', emissiveIntensity: 0.8,
        description: 'Poder supremo',
        hasFlames: true
    }
];

const getEquipmentTier = (level, bossesDefeated) => {
    for (let i = EQUIPMENT_TIERS.length - 1; i >= 0; i--) {
        if (level >= EQUIPMENT_TIERS[i].minLevel || bossesDefeated >= EQUIPMENT_TIERS[i].minBosses) {
            return EQUIPMENT_TIERS[i];
        }
    }
    return EQUIPMENT_TIERS[0];
};

// Espada 3D detalhada e profissional
const DetailedSword = ({ tier, position = [0.6, 0, 0.1], rotation = [0.2, -0.3, -0.5], scale = 1 }) => {
    const groupRef = useRef();
    const bladeRef = useRef();

    const bladeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.color,
        metalness: tier.metalness,
        roughness: tier.roughness,
        emissive: tier.emissive || '#000000',
        emissiveIntensity: tier.emissiveIntensity || 0
    }), [tier]);

    const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.accent,
        metalness: Math.min(tier.metalness + 0.1, 1),
        roughness: Math.max(tier.roughness - 0.1, 0),
        emissive: tier.emissive || '#000000',
        emissiveIntensity: (tier.emissiveIntensity || 0) * 1.5
    }), [tier]);

    const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.id === 'wood' ? '#3d2817' : '#1a1a1a',
        metalness: 0.2,
        roughness: 0.6
    }), [tier]);

    const wrapMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.id === 'legendary' ? '#8B0000' : tier.id === 'gold' ? '#8B4513' : '#2d2d2d',
        metalness: 0.1,
        roughness: 0.8
    }), [tier]);

    // Animação de brilho pulsante para tiers épicos
    useFrame((state) => {
        if (groupRef.current) {
            // Flutuação suave
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;

            // Brilho pulsante
            if (tier.emissive && bladeRef.current) {
                const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7;
                bladeRef.current.material.emissiveIntensity = tier.emissiveIntensity * pulse;
            }
        }
    });

    // Geometria do fio da lâmina (mais afiada)
    const bladeShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0.025, 0.03);
        shape.lineTo(0.025, 0.7);
        shape.lineTo(0, 0.8);
        shape.lineTo(-0.025, 0.7);
        shape.lineTo(-0.025, 0.03);
        shape.closePath();
        return shape;
    }, []);

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            {/* Lâmina principal - usando extrusão para formato de espada */}
            <mesh ref={bladeRef} position={[0, 0.4, 0]} material={bladeMaterial}>
                <extrudeGeometry args={[bladeShape, { depth: 0.015, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.002 }]} />
            </mesh>

            {/* Fio central da lâmina (fuller/blood groove) */}
            <mesh position={[0, 0.4, 0.008]}>
                <boxGeometry args={[0.008, 0.55, 0.003]} />
                <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Ponta da espada */}
            <mesh position={[0, 0.83, 0.0075]} rotation={[0, 0, Math.PI / 4]} material={bladeMaterial}>
                <coneGeometry args={[0.035, 0.08, 4]} />
            </mesh>

            {/* Guarda (crossguard) - design elaborado */}
            <mesh position={[0, 0.02, 0]} material={accentMaterial}>
                <boxGeometry args={[0.22, 0.025, 0.035]} />
            </mesh>
            {/* Detalhes da guarda */}
            <mesh position={[-0.11, 0.02, 0]} material={accentMaterial}>
                <sphereGeometry args={[0.02, 16, 16]} />
            </mesh>
            <mesh position={[0.11, 0.02, 0]} material={accentMaterial}>
                <sphereGeometry args={[0.02, 16, 16]} />
            </mesh>
            {/* Curva da guarda */}
            <mesh position={[-0.08, 0.035, 0]} rotation={[0, 0, 0.3]} material={accentMaterial}>
                <boxGeometry args={[0.06, 0.015, 0.025]} />
            </mesh>
            <mesh position={[0.08, 0.035, 0]} rotation={[0, 0, -0.3]} material={accentMaterial}>
                <boxGeometry args={[0.06, 0.015, 0.025]} />
            </mesh>

            {/* Punho/Grip */}
            <mesh position={[0, -0.12, 0]} material={handleMaterial}>
                <cylinderGeometry args={[0.018, 0.022, 0.22, 12]} />
            </mesh>

            {/* Bandagem/Couro no punho */}
            {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} position={[0, -0.05 - i * 0.035, 0]} material={wrapMaterial}>
                    <torusGeometry args={[0.022, 0.005, 8, 16]} />
                </mesh>
            ))}

            {/* Pomo (pommel) */}
            <mesh position={[0, -0.26, 0]} material={accentMaterial}>
                <sphereGeometry args={[0.03, 16, 16]} />
            </mesh>

            {/* Gema no pomo para tiers especiais */}
            {['gold', 'diamond', 'legendary'].includes(tier.id) && (
                <mesh position={[0, -0.26, 0.025]}>
                    <sphereGeometry args={[0.012, 16, 16]} />
                    <meshStandardMaterial
                        color={tier.id === 'legendary' ? '#FF0040' : tier.id === 'diamond' ? '#00FFFF' : '#FF4500'}
                        emissive={tier.id === 'legendary' ? '#FF0040' : tier.id === 'diamond' ? '#00FFFF' : '#FF4500'}
                        emissiveIntensity={1}
                    />
                </mesh>
            )}

            {/* Efeito de luz para tiers épicos */}
            {tier.emissive && (
                <pointLight
                    position={[0, 0.4, 0.1]}
                    intensity={tier.emissiveIntensity * 0.5}
                    color={tier.emissive}
                    distance={0.8}
                />
            )}
        </group>
    );
};

// Escudo 3D detalhado e profissional
const DetailedShield = ({ tier, position = [-0.55, 0.1, 0.15], rotation = [0.1, 0.5, 0.1], scale = 1 }) => {
    const groupRef = useRef();
    const shieldRef = useRef();

    const mainMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.color,
        metalness: tier.metalness,
        roughness: tier.roughness,
        emissive: tier.emissive || '#000000',
        emissiveIntensity: tier.emissiveIntensity || 0,
        side: THREE.DoubleSide
    }), [tier]);

    const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.accent,
        metalness: Math.min(tier.metalness + 0.1, 1),
        roughness: Math.max(tier.roughness - 0.1, 0),
        emissive: tier.emissive || '#000000',
        emissiveIntensity: (tier.emissiveIntensity || 0) * 1.2
    }), [tier]);

    const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.id === 'wood' ? '#5D3A1A' : tier.accent,
        metalness: tier.metalness,
        roughness: tier.roughness
    }), [tier]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + 1) * 0.02;

            if (tier.emissive && shieldRef.current) {
                const pulse = Math.sin(state.clock.elapsedTime * 3 + 0.5) * 0.3 + 0.7;
                shieldRef.current.material.emissiveIntensity = tier.emissiveIntensity * pulse;
            }
        }
    });

    // Forma do escudo (kite shield)
    const shieldShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.35);
        shape.quadraticCurveTo(0.25, 0.32, 0.28, 0.1);
        shape.quadraticCurveTo(0.28, -0.15, 0, -0.4);
        shape.quadraticCurveTo(-0.28, -0.15, -0.28, 0.1);
        shape.quadraticCurveTo(-0.25, 0.32, 0, 0.35);
        return shape;
    }, []);

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            {/* Corpo principal do escudo */}
            <mesh ref={shieldRef} material={mainMaterial}>
                <extrudeGeometry args={[shieldShape, {
                    depth: 0.04,
                    bevelEnabled: true,
                    bevelThickness: 0.015,
                    bevelSize: 0.01,
                    bevelSegments: 3
                }]} />
            </mesh>

            {/* Borda metálica do escudo */}
            <mesh position={[0, 0, 0.045]} material={rimMaterial}>
                <ringGeometry args={[0.26, 0.29, 32, 1, 0, Math.PI * 2]} />
            </mesh>

            {/* Boss central (umbo) */}
            <mesh position={[0, 0, 0.06]} material={accentMaterial}>
                <sphereGeometry args={[0.08, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>

            {/* Ponto central do boss */}
            <mesh position={[0, 0, 0.13]} material={accentMaterial}>
                <coneGeometry args={[0.025, 0.04, 6]} />
            </mesh>

            {/* Decorações baseadas no tier */}
            {tier.id !== 'wood' && (
                <>
                    {/* Linhas diagonais decorativas */}
                    <mesh position={[-0.1, 0.15, 0.045]} rotation={[0, 0, 0.5]} material={rimMaterial}>
                        <boxGeometry args={[0.12, 0.012, 0.008]} />
                    </mesh>
                    <mesh position={[0.1, 0.15, 0.045]} rotation={[0, 0, -0.5]} material={rimMaterial}>
                        <boxGeometry args={[0.12, 0.012, 0.008]} />
                    </mesh>
                    <mesh position={[0, -0.2, 0.045]} material={rimMaterial}>
                        <boxGeometry args={[0.008, 0.15, 0.008]} />
                    </mesh>
                </>
            )}

            {/* Gemas para tiers especiais */}
            {['gold', 'diamond', 'legendary'].includes(tier.id) && (
                <>
                    <mesh position={[0, 0.22, 0.055]}>
                        <octahedronGeometry args={[0.025, 0]} />
                        <meshStandardMaterial
                            color={tier.id === 'legendary' ? '#FF0040' : tier.id === 'diamond' ? '#00FFFF' : '#FF4500'}
                            emissive={tier.id === 'legendary' ? '#FF0040' : tier.id === 'diamond' ? '#00FFFF' : '#FF4500'}
                            emissiveIntensity={1.2}
                        />
                    </mesh>

                    {/* Gemas laterais para lendário */}
                    {tier.id === 'legendary' && (
                        <>
                            <mesh position={[-0.15, 0.05, 0.055]}>
                                <octahedronGeometry args={[0.015, 0]} />
                                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.8} />
                            </mesh>
                            <mesh position={[0.15, 0.05, 0.055]}>
                                <octahedronGeometry args={[0.015, 0]} />
                                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.8} />
                            </mesh>
                        </>
                    )}
                </>
            )}

            {/* Rebites na borda */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x = Math.sin(rad) * 0.24;
                const y = Math.cos(rad) * 0.24 - 0.05;
                return (
                    <mesh key={i} position={[x, y, 0.055]} material={rimMaterial}>
                        <sphereGeometry args={[0.012, 8, 8]} />
                    </mesh>
                );
            })}

            {/* Luz para tiers épicos */}
            {tier.emissive && (
                <pointLight
                    position={[0, 0, 0.2]}
                    intensity={tier.emissiveIntensity * 0.4}
                    color={tier.emissive}
                    distance={0.6}
                />
            )}
        </group>
    );
};

// Avatar 3D do Ready Player Me com equipamentos anexados e POSE DINÂMICA
const AvatarModel = ({ avatarUrl, tier }) => {
    const groupRef = useRef();
    const bonesRef = useRef({});
    const initialPoseApplied = useRef(false);

    const AvatarGLB = () => {
        const { scene } = useGLTF(avatarUrl);

        // Clonar para não afetar o original
        const clonedScene = useMemo(() => scene.clone(), [scene]);

        // Aplicar pose dinâmica quando o modelo carregar
        useEffect(() => {
            if (initialPoseApplied.current) return;

            clonedScene.traverse((child) => {
                if (child.isBone) {
                    const boneName = child.name.toLowerCase();

                    // Armazenar referências dos bones
                    bonesRef.current[boneName] = child;

                    // === POSE DE GUERREIRO CONFIANTE ===

                    // Spine (coluna) - leve inclinação para frente, postura confiante
                    if (boneName.includes('spine') || boneName === 'spine') {
                        child.rotation.x = -0.05; // Peito levemente para frente
                    }
                    if (boneName.includes('spine1') || boneName.includes('spine2')) {
                        child.rotation.x = -0.03;
                    }

                    // Braço esquerdo - segurando escudo
                    if (boneName.includes('leftarm') || boneName === 'leftshoulder') {
                        child.rotation.z = 0.4; // Braço mais para baixo
                        child.rotation.x = 0.3; // Levemente para frente
                        child.rotation.y = 0.2;
                    }
                    if (boneName.includes('leftforearm')) {
                        child.rotation.z = 0.6; // Antebraço dobrado
                        child.rotation.y = -0.3;
                    }
                    if (boneName.includes('lefthand') && !boneName.includes('thumb') && !boneName.includes('index') && !boneName.includes('middle') && !boneName.includes('ring') && !boneName.includes('pinky')) {
                        child.rotation.x = 0.2;
                        child.rotation.z = 0.1;
                    }

                    // Braço direito - segurando espada
                    if (boneName.includes('rightarm') || boneName === 'rightshoulder') {
                        child.rotation.z = -0.5; // Braço mais para baixo
                        child.rotation.x = 0.2; // Levemente para frente
                        child.rotation.y = -0.15;
                    }
                    if (boneName.includes('rightforearm')) {
                        child.rotation.z = -0.7; // Antebraço dobrado segurando espada
                        child.rotation.y = 0.2;
                    }
                    if (boneName.includes('righthand') && !boneName.includes('thumb') && !boneName.includes('index') && !boneName.includes('middle') && !boneName.includes('ring') && !boneName.includes('pinky')) {
                        child.rotation.x = -0.3; // Mão em posição de empunhar
                        child.rotation.z = -0.2;
                    }

                    // Dedos - fechados para empunhar
                    if (boneName.includes('thumb') || boneName.includes('index') || boneName.includes('middle') || boneName.includes('ring') || boneName.includes('pinky')) {
                        if (boneName.includes('proximal') || boneName.includes('1')) {
                            child.rotation.z = 0.5;
                        }
                        if (boneName.includes('intermediate') || boneName.includes('2')) {
                            child.rotation.z = 0.6;
                        }
                        if (boneName.includes('distal') || boneName.includes('3')) {
                            child.rotation.z = 0.4;
                        }
                    }

                    // Pernas - postura de luta
                    if (boneName.includes('leftupleg') || boneName === 'leftupleg') {
                        child.rotation.z = 0.05; // Perna esquerda levemente aberta
                        child.rotation.y = 0.1;
                    }
                    if (boneName.includes('rightupleg') || boneName === 'rightupleg') {
                        child.rotation.z = -0.05; // Perna direita levemente aberta
                        child.rotation.y = -0.1;
                    }

                    // Cabeça - olhando levemente para frente/cima
                    if (boneName === 'head' || boneName.includes('head')) {
                        child.rotation.x = -0.08; // Queixo levemente levantado
                    }

                    // Neck (pescoço)
                    if (boneName === 'neck' || boneName.includes('neck')) {
                        child.rotation.x = -0.05;
                    }
                }
            });

            initialPoseApplied.current = true;
        }, [clonedScene]);

        return <primitive object={clonedScene} scale={1} position={[0, -0.95, 0]} />;
    };

    // Animação de respiração sutil e movimento do personagem
    useFrame((state) => {
        if (groupRef.current) {
            // Rotação suave mostrando o personagem
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
        }

        // Animação sutil de respiração nos bones
        const time = state.clock.elapsedTime;
        const breathIntensity = Math.sin(time * 1.5) * 0.01;

        // Respiração na coluna
        if (bonesRef.current['spine'] || bonesRef.current['spine1']) {
            const spine = bonesRef.current['spine'] || bonesRef.current['spine1'];
            if (spine) {
                spine.rotation.x = -0.05 + breathIntensity;
            }
        }

        // Leve movimento nos braços (como se respirasse)
        const armBreath = Math.sin(time * 1.5) * 0.008;
        if (bonesRef.current['leftarm']) {
            bonesRef.current['leftarm'].rotation.z = 0.4 + armBreath;
        }
        if (bonesRef.current['rightarm']) {
            bonesRef.current['rightarm'].rotation.z = -0.5 - armBreath;
        }
    });

    if (!avatarUrl) return null;

    return (
        <group ref={groupRef}>
            <Suspense fallback={
                <Html center>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: '12px', marginTop: '8px' }}>Carregando...</span>
                    </div>
                </Html>
            }>
                <AvatarGLB />
            </Suspense>
        </group>
    );
};

// Espada equipada na mão direita
const EquippedSword = ({ tier }) => {
    const groupRef = useRef();
    const bladeRef = useRef();

    const bladeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.color,
        metalness: tier.metalness,
        roughness: tier.roughness,
        emissive: tier.emissive || '#000000',
        emissiveIntensity: tier.emissiveIntensity || 0
    }), [tier]);

    const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.accent,
        metalness: Math.min(tier.metalness + 0.1, 1),
        roughness: Math.max(tier.roughness - 0.1, 0),
        emissive: tier.emissive || '#000000',
        emissiveIntensity: (tier.emissiveIntensity || 0) * 1.5
    }), [tier]);

    const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.id === 'wood' ? '#3d2817' : '#1a1a1a',
        metalness: 0.2,
        roughness: 0.6
    }), [tier]);

    const wrapMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.id === 'legendary' ? '#8B0000' : tier.id === 'gold' ? '#8B4513' : '#2d2d2d',
        metalness: 0.1,
        roughness: 0.8
    }), [tier]);

    // Animação de brilho pulsante
    useFrame((state) => {
        if (tier.emissive && bladeRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7;
            bladeRef.current.material.emissiveIntensity = tier.emissiveIntensity * pulse;
        }
    });

    const bladeShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0.02, 0.025);
        shape.lineTo(0.02, 0.5);
        shape.lineTo(0, 0.58);
        shape.lineTo(-0.02, 0.5);
        shape.lineTo(-0.02, 0.025);
        shape.closePath();
        return shape;
    }, []);

    return (
        // Posição: mão direita do avatar - espada empunhada (ajustada para pose dinâmica)
        <group
            ref={groupRef}
            position={[0.28, 0.55, 0.15]}
            rotation={[0.4, -0.2, -1.2]}
            scale={0.60}
        >
            {/* Lâmina principal */}
            <mesh ref={bladeRef} position={[0, 0.32, 0]} material={bladeMaterial}>
                <extrudeGeometry args={[bladeShape, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002 }]} />
            </mesh>

            {/* Fio central */}
            <mesh position={[0, 0.32, 0.006]}>
                <boxGeometry args={[0.006, 0.40, 0.002]} />
                <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Ponta */}
            <mesh position={[0, 0.62, 0.006]} rotation={[0, 0, Math.PI / 4]} material={bladeMaterial}>
                <coneGeometry args={[0.028, 0.06, 4]} />
            </mesh>

            {/* Guarda */}
            <mesh position={[0, 0.02, 0]} material={accentMaterial}>
                <boxGeometry args={[0.16, 0.02, 0.028]} />
            </mesh>
            <mesh position={[-0.08, 0.02, 0]} material={accentMaterial}>
                <sphereGeometry args={[0.015, 12, 12]} />
            </mesh>
            <mesh position={[0.08, 0.02, 0]} material={accentMaterial}>
                <sphereGeometry args={[0.015, 12, 12]} />
            </mesh>

            {/* Punho */}
            <mesh position={[0, -0.09, 0]} material={handleMaterial}>
                <cylinderGeometry args={[0.014, 0.018, 0.16, 10]} />
            </mesh>

            {/* Bandagem */}
            {[0, 1, 2, 3].map((i) => (
                <mesh key={i} position={[0, -0.04 - i * 0.028, 0]} material={wrapMaterial}>
                    <torusGeometry args={[0.018, 0.004, 6, 12]} />
                </mesh>
            ))}

            {/* Pomo */}
            <mesh position={[0, -0.19, 0]} material={accentMaterial}>
                <sphereGeometry args={[0.022, 12, 12]} />
            </mesh>

            {/* Gema para tiers especiais */}
            {['gold', 'diamond', 'legendary'].includes(tier.id) && (
                <mesh position={[0, -0.19, 0.018]}>
                    <sphereGeometry args={[0.009, 12, 12]} />
                    <meshStandardMaterial
                        color={tier.id === 'legendary' ? '#FF0040' : tier.id === 'diamond' ? '#00FFFF' : '#FF4500'}
                        emissive={tier.id === 'legendary' ? '#FF0040' : tier.id === 'diamond' ? '#00FFFF' : '#FF4500'}
                        emissiveIntensity={1}
                    />
                </mesh>
            )}

            {/* Luz para tiers épicos */}
            {tier.emissive && (
                <pointLight position={[0, 0.3, 0.1]} intensity={tier.emissiveIntensity * 0.4} color={tier.emissive} distance={0.6} />
            )}
        </group>
    );
};

// Escudo equipado no braço esquerdo
const EquippedShield = ({ tier }) => {
    const groupRef = useRef();
    const shieldRef = useRef();

    const mainMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.color,
        metalness: tier.metalness,
        roughness: tier.roughness,
        emissive: tier.emissive || '#000000',
        emissiveIntensity: tier.emissiveIntensity || 0,
        side: THREE.DoubleSide
    }), [tier]);

    const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.accent,
        metalness: Math.min(tier.metalness + 0.1, 1),
        roughness: Math.max(tier.roughness - 0.1, 0),
        emissive: tier.emissive || '#000000',
        emissiveIntensity: (tier.emissiveIntensity || 0) * 1.2
    }), [tier]);

    const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.id === 'wood' ? '#5D3A1A' : tier.accent,
        metalness: tier.metalness,
        roughness: tier.roughness
    }), [tier]);

    useFrame((state) => {
        if (tier.emissive && shieldRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 3 + 0.5) * 0.3 + 0.7;
            shieldRef.current.material.emissiveIntensity = tier.emissiveIntensity * pulse;
        }
    });

    const shieldShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.25);
        shape.quadraticCurveTo(0.18, 0.23, 0.2, 0.07);
        shape.quadraticCurveTo(0.2, -0.1, 0, -0.28);
        shape.quadraticCurveTo(-0.2, -0.1, -0.2, 0.07);
        shape.quadraticCurveTo(-0.18, 0.23, 0, 0.25);
        return shape;
    }, []);

    return (
        // Posição: braço esquerdo do avatar - escudo no antebraço (ajustada para pose dinâmica)
        <group
            ref={groupRef}
            position={[-0.32, 0.45, 0.25]}
            rotation={[0.3, 0.8, 0.4]}
            scale={0.50}
        >
            {/* Corpo principal do escudo */}
            <mesh ref={shieldRef} material={mainMaterial}>
                <extrudeGeometry args={[shieldShape, {
                    depth: 0.03,
                    bevelEnabled: true,
                    bevelThickness: 0.012,
                    bevelSize: 0.008,
                    bevelSegments: 2
                }]} />
            </mesh>

            {/* Boss central (umbo) */}
            <mesh position={[0, 0, 0.045]} material={accentMaterial}>
                <sphereGeometry args={[0.06, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>

            {/* Ponto central */}
            <mesh position={[0, 0, 0.10]} material={accentMaterial}>
                <coneGeometry args={[0.018, 0.03, 5]} />
            </mesh>

            {/* Decorações */}
            {tier.id !== 'wood' && (
                <>
                    <mesh position={[-0.07, 0.11, 0.035]} rotation={[0, 0, 0.4]} material={rimMaterial}>
                        <boxGeometry args={[0.08, 0.01, 0.006]} />
                    </mesh>
                    <mesh position={[0.07, 0.11, 0.035]} rotation={[0, 0, -0.4]} material={rimMaterial}>
                        <boxGeometry args={[0.08, 0.01, 0.006]} />
                    </mesh>
                    <mesh position={[0, -0.14, 0.035]} material={rimMaterial}>
                        <boxGeometry args={[0.006, 0.1, 0.006]} />
                    </mesh>
                </>
            )}

            {/* Gemas para tiers especiais */}
            {['gold', 'diamond', 'legendary'].includes(tier.id) && (
                <mesh position={[0, 0.16, 0.04]}>
                    <octahedronGeometry args={[0.018, 0]} />
                    <meshStandardMaterial
                        color={tier.id === 'legendary' ? '#FF0040' : tier.id === 'diamond' ? '#00FFFF' : '#FF4500'}
                        emissive={tier.id === 'legendary' ? '#FF0040' : tier.id === 'diamond' ? '#00FFFF' : '#FF4500'}
                        emissiveIntensity={1.2}
                    />
                </mesh>
            )}

            {/* Rebites */}
            {[0, 72, 144, 216, 288].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x = Math.sin(rad) * 0.17;
                const y = Math.cos(rad) * 0.17 - 0.03;
                return (
                    <mesh key={i} position={[x, y, 0.04]} material={rimMaterial}>
                        <sphereGeometry args={[0.009, 6, 6]} />
                    </mesh>
                );
            })}

            {/* Luz para tiers épicos */}
            {tier.emissive && (
                <pointLight position={[0, 0, 0.15]} intensity={tier.emissiveIntensity * 0.3} color={tier.emissive} distance={0.5} />
            )}
        </group>
    );
};

// Placeholder Avatar estilizado
const PlaceholderAvatar = ({ tier, onClick }) => (
    <div onClick={onClick} style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '20px', cursor: 'pointer'
    }}>
        <div style={{
            width: '140px', height: '180px', borderRadius: '24px',
            background: `linear-gradient(180deg, ${tier.color}33, ${tier.color}11)`,
            border: `3px dashed ${tier.color}66`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '16px'
        }}>
            <Camera size={48} color={tier.color} style={{ opacity: 0.6 }} />
            <div style={{ display: 'flex', gap: '12px' }}>
                <Shield size={24} color={tier.color} style={{ opacity: 0.4 }} />
                <Sword size={24} color={tier.color} style={{ opacity: 0.4 }} />
            </div>
        </div>
        <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: tier.color, marginBottom: '4px' }}>
                Criar Avatar 3D
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Personalize seu guerreiro<br />com equipamentos {tier.name}
            </p>
        </div>
    </div>
);

// Cena 3D Completa com equipamentos EQUIPADOS
const WarriorScene = ({ avatarUrl, tier }) => {
    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
            <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#8080ff" />
            <directionalLight position={[0, 3, -5]} intensity={0.3} />

            {tier.emissive && (
                <pointLight position={[0, 0.5, 1.5]} intensity={tier.emissiveIntensity * 2} color={tier.emissive} distance={4} />
            )}

            <group position={[0, 0, 0]}>
                <AvatarModel avatarUrl={avatarUrl} tier={tier} />

                {/* Equipamentos fixos no corpo do avatar - NÃO flutuando */}
                <EquippedSword tier={tier} />
                <EquippedShield tier={tier} />
            </group>

            <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={3} blur={2.5} far={4} />
            <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} autoRotate autoRotateSpeed={0.8} />
            <Environment preset="city" background={false} />
        </>
    );
};

// Componente principal
const FullAvatar3DViewer = ({ avatarUrl, userLevel, bossesDefeated, size = 350, onClickCreate }) => {
    const tier = getEquipmentTier(userLevel, bossesDefeated);

    return (
        <div style={{
            width: size, height: size * 1.3, borderRadius: '24px', overflow: 'hidden',
            background: `linear-gradient(180deg, #0a0a12 0%, #12121f 40%, ${tier.glowColor} 90%, #0a0a12 100%)`,
            boxShadow: `0 25px 80px rgba(0,0,0,0.7), 0 0 80px ${tier.glowColor}, inset 0 0 60px rgba(0,0,0,0.3)`,
            border: `2px solid ${tier.color}44`, position: 'relative'
        }}>
            {['gold', 'diamond', 'legendary'].includes(tier.id) && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {[...Array(12)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute', width: '4px', height: '4px', borderRadius: '50%',
                            background: tier.color, left: `${10 + (i % 4) * 25}%`, top: `${10 + Math.floor(i / 4) * 30}%`,
                            opacity: 0.5, animation: `float ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s`
                        }} />
                    ))}
                </div>
            )}

            <div style={{
                position: 'absolute', top: '14px', right: '14px',
                padding: '8px 16px', background: `linear-gradient(135deg, ${tier.color}88, ${tier.color}44)`,
                borderRadius: '100px', border: `1px solid ${tier.color}`,
                display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10,
                backdropFilter: 'blur(10px)', boxShadow: `0 4px 20px ${tier.glowColor}`
            }}>
                <span style={{ fontSize: '16px' }}>{tier.emoji}</span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', textShadow: `0 0 10px ${tier.color}` }}>
                    {tier.name}
                </span>
            </div>

            {avatarUrl ? (
                <Canvas camera={{ position: [0, 0.3, 2.5], fov: 40 }} style={{ background: 'transparent' }} shadows>
                    <Suspense fallback={null}>
                        <WarriorScene avatarUrl={avatarUrl} tier={tier} />
                    </Suspense>
                </Canvas>
            ) : (
                <PlaceholderAvatar tier={tier} onClick={onClickCreate} />
            )}

            <div style={{
                position: 'absolute', bottom: '14px', left: '14px', right: '14px',
                padding: '12px 20px', background: 'linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.9))',
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
                backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} color={tier.color} />
                    <span style={{ fontSize: '11px', color: tier.color, fontWeight: '700' }}>Escudo {tier.name}</span>
                </div>
                <div style={{ width: '1px', height: '20px', background: `${tier.color}44` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sword size={16} color={tier.color} />
                    <span style={{ fontSize: '11px', color: tier.color, fontWeight: '700' }}>Espada {tier.name}</span>
                </div>
            </div>
        </div>
    );
};

// Modal Builder (mantendo a mesma estrutura)
const Avatar3DBuilder = ({ isOpen, onClose, onSave, currentAvatarUrl, userLevel, bossesDefeated }) => {
    const iframeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('create');

    const tier = getEquipmentTier(userLevel, bossesDefeated);
    const nextTier = EQUIPMENT_TIERS.find(t => t.minLevel > userLevel) || null;

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== 'https://demo.readyplayer.me') return;
            try {
                const data = JSON.parse(event.data);
                if (data.source === 'readyplayerme') {
                    if (data.eventName === 'v1.avatar.exported') {
                        localStorage.setItem('avatar3DUrl', data.data.url);
                        onSave(data.data.url);
                        onClose();
                    }
                    if (data.eventName === 'v1.frame.ready') {
                        setIsLoading(false);
                        iframeRef.current?.contentWindow.postMessage(
                            JSON.stringify({ target: 'readyplayerme', type: 'subscribe', eventName: 'v1.avatar.exported' }), '*'
                        );
                    }
                }
            } catch (e) { }
        };
        if (isOpen) { window.addEventListener('message', handleMessage); setIsLoading(true); }
        return () => window.removeEventListener('message', handleMessage);
    }, [isOpen, onSave, onClose]);

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 2000, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(20px)' }}>
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.5))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `linear-gradient(135deg, ${tier.color}44, ${tier.color}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tier.color}66` }}>
                            <Sword size={20} color={tier.color} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>Criar <span style={{ color: tier.color }}>Guerreiro 3D</span></h2>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Equipamentos {tier.name} • Nível {userLevel}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '24px' }}>
                        {[{ id: 'create', label: '🎨 Criar Avatar' }, { id: 'preview', label: '👁️ Visualizar' }, { id: 'equipment', label: '⚔️ Equipamentos' }].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                padding: '10px 20px', borderRadius: '10px',
                                background: activeTab === tab.id ? `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` : 'rgba(255,255,255,0.05)',
                                border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                color: activeTab === tab.id ? '#000' : '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '12px'
                            }}>{tab.label}</button>
                        ))}
                    </div>
                </div>
                <button onClick={onClose} style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={20} />
                </button>
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
                {activeTab === 'create' && (
                    <div style={{ height: '100%', position: 'relative' }}>
                        {isLoading && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a12', zIndex: 10 }}>
                                <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: `4px solid ${tier.color}22`, borderTopColor: tier.color, animation: 'spin 1s linear infinite' }} />
                                <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>Carregando...</p>
                            </div>
                        )}
                        <iframe ref={iframeRef} src="https://demo.readyplayer.me/avatar?frameApi&clearCache" style={{ width: '100%', height: '100%', border: 'none', opacity: isLoading ? 0 : 1 }} allow="camera *; microphone *" title="Avatar Creator" />
                    </div>
                )}

                {activeTab === 'preview' && (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #0a0a12 0%, #12121f 100%)', padding: '40px' }}>
                        <FullAvatar3DViewer avatarUrl={currentAvatarUrl} userLevel={userLevel} bossesDefeated={bossesDefeated} size={420} />
                    </div>
                )}

                {activeTab === 'equipment' && (
                    <div style={{ padding: '32px', overflowY: 'auto', height: '100%', background: '#0a0a12' }}>
                        <div style={{ padding: '28px', background: `linear-gradient(135deg, ${tier.color}22, ${tier.color}08)`, borderRadius: '24px', border: `2px solid ${tier.color}44`, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '28px', boxShadow: `0 20px 60px ${tier.glowColor}` }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '20px', background: `linear-gradient(135deg, ${tier.color}33, ${tier.color}11)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', border: `2px solid ${tier.color}55` }}>{tier.emoji}</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Equipamento Atual</p>
                                <h3 style={{ fontSize: '28px', fontWeight: '900', color: tier.color, marginBottom: '8px' }}>{tier.name}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{tier.description}</p>
                            </div>
                        </div>

                        {nextTier && (
                            <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontSize: '32px' }}>{nextTier.emoji}</span>
                                    <div>
                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Próxima Evolução</p>
                                        <p style={{ fontSize: '16px', fontWeight: '700', color: nextTier.color }}>{nextTier.name}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Faltam <strong style={{ color: nextTier.color }}>{nextTier.minLevel - userLevel}</strong> níveis</p>
                                    <div style={{ width: '160px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px' }}>
                                        <div style={{ width: `${(userLevel / nextTier.minLevel) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})`, borderRadius: '100px', boxShadow: `0 0 10px ${nextTier.color}66` }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Evolução dos Equipamentos</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {EQUIPMENT_TIERS.map((t) => {
                                const isUnlocked = userLevel >= t.minLevel || bossesDefeated >= t.minBosses;
                                const isCurrent = t.id === tier.id;
                                return (
                                    <div key={t.id} style={{ padding: '20px', borderRadius: '20px', background: isCurrent ? `linear-gradient(135deg, ${t.color}22, ${t.color}08)` : 'rgba(255,255,255,0.02)', border: isCurrent ? `2px solid ${t.color}` : '1px solid rgba(255,255,255,0.06)', opacity: isUnlocked ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `linear-gradient(135deg, ${t.color}44, ${t.color}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: isUnlocked ? `0 8px 24px ${t.glowColor}` : 'none' }}>{t.emoji}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: '700', fontSize: '15px', color: t.color }}>{t.name}</span>
                                                {isCurrent && <span style={{ padding: '4px 10px', background: t.color, borderRadius: '100px', fontSize: '9px', fontWeight: '800', color: '#000', letterSpacing: '0.5px' }}>ATUAL</span>}
                                            </div>
                                            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.description}</p>
                                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Nível {t.minLevel}+ ou {t.minBosses} boss{t.minBosses !== 1 ? 'es' : ''}</p>
                                        </div>
                                        {isUnlocked ? <Check size={24} color={t.color} /> : <span style={{ fontSize: '24px' }}>🔒</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.8))', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <Shield size={16} color={tier.color} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Equipamento <strong style={{ color: tier.color }}>{tier.name}</strong> equipado automaticamente</span>
                <Sword size={16} color={tier.color} />
            </div>
        </div>
    );
};

export { FullAvatar3DViewer, Avatar3DBuilder, DetailedSword, DetailedShield, getEquipmentTier, EQUIPMENT_TIERS };
export default Avatar3DBuilder;
