import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2, Dumbbell, Medal, Trophy, X, Check, Camera, Crown } from 'lucide-react';

// === SISTEMA DE NÍVEIS FITNESS ===
const FITNESS_TIERS = [
    {
        id: 'beginner', name: 'Iniciante', emoji: '🌱', minLevel: 0, minBosses: 0,
        color: '#4CAF50', accent: '#2E7D32', metalness: 0.3, roughness: 0.7,
        glowColor: 'rgba(76, 175, 80, 0.5)', emissive: null, emissiveIntensity: 0
    },
    {
        id: 'regular', name: 'Regular', emoji: '💪', minLevel: 5, minBosses: 1,
        color: '#2196F3', accent: '#1565C0', metalness: 0.5, roughness: 0.5,
        glowColor: 'rgba(33, 150, 243, 0.5)', emissive: null, emissiveIntensity: 0
    },
    {
        id: 'athlete', name: 'Atleta', emoji: '🏃', minLevel: 10, minBosses: 2,
        color: '#9C27B0', accent: '#6A1B9A', metalness: 0.6, roughness: 0.4,
        glowColor: 'rgba(156, 39, 176, 0.5)', emissive: '#9C27B0', emissiveIntensity: 0.1
    },
    {
        id: 'pro', name: 'Pro', emoji: '🏆', minLevel: 20, minBosses: 3,
        color: '#FF9800', accent: '#E65100', metalness: 0.7, roughness: 0.3,
        glowColor: 'rgba(255, 152, 0, 0.6)', emissive: '#FF9800', emissiveIntensity: 0.2
    },
    {
        id: 'elite', name: 'Elite', emoji: '⭐', minLevel: 30, minBosses: 4,
        color: '#FFD700', accent: '#FFA000', metalness: 0.9, roughness: 0.1,
        glowColor: 'rgba(255, 215, 0, 0.6)', emissive: '#FFD700', emissiveIntensity: 0.4
    },
    {
        id: 'champion', name: 'Campeão', emoji: '👑', minLevel: 40, minBosses: 5,
        color: '#E91E63', accent: '#AD1457', metalness: 0.85, roughness: 0.15,
        glowColor: 'rgba(233, 30, 99, 0.6)', emissive: '#E91E63', emissiveIntensity: 0.5
    },
    {
        id: 'legend', name: 'Lenda', emoji: '🔥', minLevel: 50, minBosses: 6,
        color: '#FF3366', accent: '#FF6B6B', metalness: 0.95, roughness: 0.05,
        glowColor: 'rgba(255, 51, 102, 0.7)', emissive: '#FF3366', emissiveIntensity: 0.8
    }
];

const getFitnessTier = (level, bossesDefeated) => {
    for (let i = FITNESS_TIERS.length - 1; i >= 0; i--) {
        if (level >= FITNESS_TIERS[i].minLevel || bossesDefeated >= FITNESS_TIERS[i].minBosses) {
            return FITNESS_TIERS[i];
        }
    }
    return FITNESS_TIERS[0];
};

// === HALTER 3D REALISTA ===
const Dumbbell3D = ({ tier, position = [0.7, 0.2, 0], rotation = [0, 0, 0.3], scale = 0.15 }) => {
    const groupRef = useRef();

    const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.color,
        metalness: tier.metalness,
        roughness: tier.roughness,
        emissive: tier.emissive || '#000000',
        emissiveIntensity: tier.emissiveIntensity || 0
    }), [tier]);

    const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        metalness: 0.8,
        roughness: 0.2
    }), []);

    // Sem animação - equipamentos estáticos no chão

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            {/* Barra central */}
            <mesh material={handleMaterial}>
                <cylinderGeometry args={[0.15, 0.15, 4, 32]} />
            </mesh>

            {/* Pesos lado esquerdo */}
            <mesh position={[-1.5, 0, 0]} material={metalMaterial}>
                <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
            </mesh>
            <mesh position={[-1.9, 0, 0]} material={metalMaterial}>
                <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
            </mesh>

            {/* Pesos lado direito */}
            <mesh position={[1.5, 0, 0]} material={metalMaterial}>
                <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
            </mesh>
            <mesh position={[1.9, 0, 0]} material={metalMaterial}>
                <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
            </mesh>

            {/* Luz para tiers épicos */}
            {tier.emissive && (
                <pointLight position={[0, 0, 0.5]} intensity={tier.emissiveIntensity * 0.5}
                    color={tier.emissive} distance={1} />
            )}
        </group>
    );
};

// === KETTLEBELL 3D REALISTA ===
const Kettlebell3D = ({ tier, position = [-0.6, -0.3, 0.2], rotation = [0, 0.5, 0], scale = 0.12 }) => {
    const groupRef = useRef();

    const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.color,
        metalness: tier.metalness,
        roughness: tier.roughness,
        emissive: tier.emissive || '#000000',
        emissiveIntensity: tier.emissiveIntensity || 0
    }), [tier]);

    // Sem animação - equipamentos estáticos no chão

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            {/* Corpo do kettlebell */}
            <mesh material={metalMaterial}>
                <sphereGeometry args={[1.2, 32, 32]} />
            </mesh>

            {/* Base plana */}
            <mesh position={[0, -1, 0]} material={metalMaterial}>
                <cylinderGeometry args={[0.8, 0.9, 0.3, 32]} />
            </mesh>

            {/* Alça */}
            <mesh position={[0, 1.2, 0]} material={metalMaterial}>
                <torusGeometry args={[0.6, 0.15, 16, 32, Math.PI]} />
            </mesh>

            {tier.emissive && (
                <pointLight position={[0, 0, 0.8]} intensity={tier.emissiveIntensity * 0.4}
                    color={tier.emissive} distance={0.8} />
            )}
        </group>
    );
};

// === MEDALHA 3D REALISTA ===
const Medal3D = ({ tier, position = [0.5, 0.6, 0.3], rotation = [0.2, 0, 0], scale = 0.08 }) => {
    const groupRef = useRef();

    const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#FFD700',
        metalness: 0.95,
        roughness: 0.05,
        emissive: '#FFD700',
        emissiveIntensity: 0.3
    }), []);

    const ribbonMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: tier.color,
        metalness: 0.1,
        roughness: 0.8
    }), [tier]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.3}>
            <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
                {/* Fita */}
                <mesh position={[0, 2.5, 0]} material={ribbonMaterial}>
                    <boxGeometry args={[1.5, 3, 0.1]} />
                </mesh>

                {/* Medalha */}
                <mesh material={goldMaterial}>
                    <cylinderGeometry args={[1.5, 1.5, 0.2, 64]} />
                </mesh>

                {/* Borda da medalha */}
                <mesh material={goldMaterial}>
                    <torusGeometry args={[1.5, 0.1, 16, 64]} />
                </mesh>

                {/* Estrela central */}
                <mesh position={[0, 0, 0.15]} material={goldMaterial}>
                    <coneGeometry args={[0.8, 0.8, 5]} />
                </mesh>

                <pointLight position={[0, 0, 1]} intensity={0.5} color="#FFD700" distance={1.5} />
            </group>
        </Float>
    );
};

// === AVATAR 3D DO READY PLAYER ME ===
const AvatarModel = ({ avatarUrl }) => {
    const groupRef = useRef();

    // Forçar a pose em cada quadro para evitar que animações padrão a sobrescrevam
    useFrame((state) => {
        if (groupRef.current) {
            // Rotação suave do corpo inteiro
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;

            // Encontrar e manipular os ossos a cada frame
            groupRef.current.traverse((child) => {
                if (child.isBone) {
                    const name = child.name.toLowerCase();

                    // Braço Esquerdo (Cruzando)
                    if (name.includes('leftarm') || name.includes('left_arm')) {
                        child.rotation.x = -1.0; // Levanta um pouco menos
                        child.rotation.y = 0.8;  // Traz mais para frente/dentro
                        child.rotation.z = -0.5; // Ajuste lateral
                    }
                    if (name.includes('leftforearm') || name.includes('left_forearm')) {
                        child.rotation.x = -2.0; // Dobra o cotovelo para cruzar
                        child.rotation.y = 0.5;
                        child.rotation.z = 0.2;
                    }
                    if (name.includes('lefthand') || name.includes('left_hand')) {
                        child.rotation.x = -0.2;
                    }

                    // Braço Direito (Cruzando)
                    if (name.includes('rightarm') || name.includes('right_arm')) {
                        child.rotation.x = -1.0;
                        child.rotation.y = -0.8;
                        child.rotation.z = 0.5;
                    }
                    if (name.includes('rightforearm') || name.includes('right_forearm')) {
                        child.rotation.x = -2.0;
                        child.rotation.y = -0.5;
                        child.rotation.z = -0.2;
                    }
                    if (name.includes('righthand') || name.includes('right_hand')) {
                        child.rotation.x = -0.2;
                    }
                }
            });
        }
    });

    const AvatarGLB = () => {
        const { scene } = useGLTF(avatarUrl);
        // Clonar e aplicar escala
        const clonedScene = useMemo(() => {
            const clone = scene.clone();
            return clone;
        }, [scene]);

        return <primitive object={clonedScene} scale={1.2} position={[0, 0, 0]} />;
    };

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

// === CENA 3D COMPLETA ===
const FitnessScene = ({ avatarUrl, tier }) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
            <directionalLight position={[-5, 4, -3]} intensity={0.6} color="#4488ff" />
            <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} penumbra={1} />

            {tier.emissive && (
                <pointLight position={[0, 0.5, 1.5]} intensity={tier.emissiveIntensity * 2}
                    color={tier.emissive} distance={4} />
            )}

            {/* Grupo principal - todo ancorado ao chão */}
            <group position={[0, -2.5, 0]}>
                <AvatarModel avatarUrl={avatarUrl} />

                {/* Equipamentos no chão - ao nível dos pés do avatar (0) */}
                <Dumbbell3D tier={tier} position={[0.6, 0.1, 0.3]} rotation={[0, 0, 1.57]} scale={0.06} />
                <Kettlebell3D tier={tier} position={[-0.55, 0.1, 0.3]} scale={0.05} />

                {/* Medalha flutuando ao lado do avatar (altura do peito) */}
                <Medal3D tier={tier} position={[0.6, 1.3, 0.3]} rotation={[0, -0.5, 0]} scale={0.04} />

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={3}
                    maxDistance={8}
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 1.8}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    target={[0, 1.0, 0]}
                    makeDefault
                />
            </group>

            <ContactShadows position={[0, -2.5, 0]} opacity={0.65} scale={10} blur={2.5} far={4} color="#000000" />
            <Environment preset="city" background={false} />
        </>
    );
};

// === PLACEHOLDER QUANDO NÃO TEM AVATAR ===
const AvatarPlaceholder = ({ tier, onClick }) => (
    <div onClick={onClick} style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '20px', cursor: 'pointer'
    }}>
        <div style={{
            width: '160px', height: '200px', borderRadius: '24px',
            background: `linear-gradient(180deg, ${tier.color}33, ${tier.color}11)`,
            border: `3px dashed ${tier.color}66`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '20px'
        }}>
            <Camera size={56} color={tier.color} style={{ opacity: 0.6 }} />
            <div style={{ display: 'flex', gap: '16px' }}>
                <Dumbbell size={28} color={tier.color} style={{ opacity: 0.4 }} />
                <Medal size={28} color={tier.color} style={{ opacity: 0.4 }} />
            </div>
        </div>
        <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', color: tier.color, marginBottom: '6px' }}>
                Criar Avatar 3D Real
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Personalize seu atleta<br />com equipamentos {tier.name}
            </p>
        </div>
    </div>
);

// === COMPONENTE PRINCIPAL DO DISPLAY ===
const RealFitness3DDisplay = ({ avatarUrl, userLevel, bossesDefeated, size = 380, onClickCreate }) => {
    const tier = getFitnessTier(userLevel, bossesDefeated);

    return (
        <div style={{
            width: size, height: size * 1.3, borderRadius: '28px', overflow: 'hidden',
            background: `
                radial-gradient(ellipse at 50% 20%, ${tier.glowColor} 0%, transparent 50%),
                radial-gradient(ellipse at 50% 100%, ${tier.color}22 0%, transparent 40%),
                linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0a0a12 100%)
            `,
            boxShadow: `0 30px 100px rgba(0,0,0,0.8), 0 0 100px ${tier.glowColor}, inset 0 0 80px rgba(0,0,0,0.4)`,
            border: `3px solid ${tier.color}55`, position: 'relative'
        }}>
            {/* Partículas animadas */}
            {['elite', 'champion', 'legend'].includes(tier.id) && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {[...Array(15)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute', width: `${3 + i % 3}px`, height: `${3 + i % 3}px`,
                            borderRadius: '50%', background: i % 2 === 0 ? tier.color : '#00FF88',
                            left: `${5 + (i % 5) * 20}%`, top: `${10 + Math.floor(i / 5) * 25}%`,
                            opacity: 0.6, animation: `float ${2 + i * 0.2}s ease-in-out infinite`,
                            animationDelay: `${i * 0.15}s`
                        }} />
                    ))}
                </div>
            )}

            {/* Badge do tier */}
            <div style={{
                position: 'absolute', top: '16px', right: '16px',
                padding: '10px 20px', background: `linear-gradient(135deg, ${tier.color}aa, ${tier.color}55)`,
                borderRadius: '100px', border: `2px solid ${tier.color}`,
                display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10,
                backdropFilter: 'blur(10px)', boxShadow: `0 4px 25px ${tier.glowColor}`
            }}>
                <span style={{ fontSize: '18px' }}>{tier.emoji}</span>
                <span style={{
                    fontSize: '12px', fontWeight: '800', color: '#fff',
                    textTransform: 'uppercase', letterSpacing: '1px', textShadow: `0 0 10px ${tier.color}`
                }}>
                    {tier.name}
                </span>
            </div>

            {avatarUrl ? (
                <Canvas camera={{ position: [0, 0.5, 5.5], fov: 35 }} style={{ background: 'transparent' }} shadows>
                    <Suspense fallback={null}>
                        <FitnessScene avatarUrl={avatarUrl} tier={tier} />
                    </Suspense>
                </Canvas>
            ) : (
                <AvatarPlaceholder tier={tier} onClick={onClickCreate} />
            )}

            {/* Indicadores de equipamento */}
            <div style={{
                position: 'absolute', bottom: '16px', left: '16px', right: '16px',
                padding: '14px 24px', background: 'linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.9))',
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px',
                backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Dumbbell size={18} color={tier.color} />
                    <span style={{ fontSize: '11px', color: tier.color, fontWeight: '700' }}>Halter 3D</span>
                </div>
                <div style={{ width: '1px', height: '20px', background: `${tier.color}44` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={18} color={tier.color} />
                    <span style={{ fontSize: '11px', color: tier.color, fontWeight: '700' }}>Kettlebell</span>
                </div>
                <div style={{ width: '1px', height: '20px', background: `${tier.color}44` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Medal size={18} color="#FFD700" />
                    <span style={{ fontSize: '11px', color: '#FFD700', fontWeight: '700' }}>Medalha</span>
                </div>
            </div>
        </div>
    );
};

// === MODAL BUILDER ===
const RealFitness3DBuilder = ({ isOpen, onClose, onSave, currentAvatarUrl, userLevel, bossesDefeated }) => {
    const iframeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const tier = getFitnessTier(userLevel, bossesDefeated);

    const iframeUrl = 'https://demo.readyplayer.me/avatar?frameApi&clearCache';

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== 'https://demo.readyplayer.me') return;
            try {
                const data = JSON.parse(event.data);
                if (data.source === 'readyplayerme') {
                    if (data.eventName === 'v1.avatar.exported') {
                        const newAvatarUrl = data.data.url;
                        localStorage.setItem('realFitness3DAvatarUrl', newAvatarUrl);
                        onSave(newAvatarUrl);
                        onClose();
                    }
                    if (data.eventName === 'v1.frame.ready') {
                        setIsLoading(false);
                        if (iframeRef.current) {
                            iframeRef.current.contentWindow.postMessage(
                                JSON.stringify({ target: 'readyplayerme', type: 'subscribe', eventName: 'v1.avatar.exported' }),
                                '*'
                            );
                        }
                    }
                }
            } catch (e) { }
        };

        if (isOpen) {
            window.addEventListener('message', handleMessage);
            setIsLoading(true);
        }
        return () => window.removeEventListener('message', handleMessage);
    }, [isOpen, onSave, onClose]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)',
            zIndex: 2000, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(20px)'
        }}>
            <div style={{
                padding: '18px 28px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Crown size={26} color={tier.color} />
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>
                        Criar <span style={{ color: tier.color }}>Avatar 3D Real</span>
                    </h2>
                </div>
                <button onClick={onClose} style={{
                    width: '46px', height: '46px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                }}>✕</button>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', background: '#0a0a12', zIndex: 10
                    }}>
                        <div style={{
                            width: '70px', height: '70px', borderRadius: '50%',
                            border: `4px solid ${tier.color}33`, borderTopColor: tier.color,
                            animation: 'spin 1s linear infinite'
                        }} />
                        <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '15px' }}>
                            Carregando criador de avatar 3D...
                        </p>
                    </div>
                )}
                <iframe ref={iframeRef} src={iframeUrl} style={{
                    width: '100%', height: '100%', border: 'none',
                    opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease'
                }} allow="camera *; microphone *" title="Ready Player Me" />
            </div>

            <div style={{
                padding: '14px 28px', borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px'
            }}>
                <Dumbbell size={16} color={tier.color} />
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Seu avatar terá equipamentos <strong style={{ color: tier.color }}>{tier.name}</strong> baseado no seu progresso
                </span>
                <Medal size={16} color="#FFD700" />
            </div>
        </div>
    );
};

export { RealFitness3DDisplay, RealFitness3DBuilder, getFitnessTier, FITNESS_TIERS };
export default RealFitness3DBuilder;
