import React from 'react';

// Componente de Gráfico Radar (Pentágono)
const RadarChart = ({ stats, color = '#3B82F6' }) => {
    const centerX = 150;
    const centerY = 160; // Deslocado um pouco para baixo para caber o título
    const maxRadius = 100;

    // Ordem dos eixos conforme a imagem (Horário começando do Topo)
    // 1. Físico (Top) -90
    // 2. Financeiro (Top Right) -18
    // 3. Mental (Bottom Right) 54
    // 4. Profissional (Bottom Left) 126
    // 5. Espiritual (Top Left) 198

    const areas = [
        { name: 'Físico', angle: -90, value: stats.fisico },
        { name: 'Financeiro', angle: -18, value: stats.financeiro },
        { name: 'Mental', angle: 54, value: stats.mental },
        { name: 'Profissional', angle: 126, value: stats.profissional },
        { name: 'Espiritual', angle: 198, value: stats.espiritual }
    ];

    // Calcular pontos do polígono baseado nos valores
    const getPoint = (angle, value) => {
        const radians = (angle * Math.PI) / 180;
        const radius = (value / 100) * maxRadius;
        return {
            x: centerX + radius * Math.cos(radians),
            y: centerY + radius * Math.sin(radians)
        };
    };

    // Gerar pontos para os níveis de referência
    const generateLevelPolygon = (level) => {
        return areas.map(area => {
            const point = getPoint(area.angle, level);
            return `${point.x},${point.y}`;
        }).join(' ');
    };

    // Gerar polígono dos valores atuais
    const dataPolygon = areas.map(area => {
        const point = getPoint(area.angle, area.value);
        return `${point.x},${point.y}`;
    }).join(' ');

    return (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '10px',
                textAlign: 'center'
            }}>
                Gráfico de Habilidades
            </h3>
            <svg width="350" height="350" viewBox="0 0 300 320">
                <defs>
                    <linearGradient id="radarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Linhas de grade (Pentágonos) */}
                {[20, 40, 60, 80, 100].map(level => (
                    <polygon
                        key={level}
                        points={generateLevelPolygon(level)}
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                    />
                ))}

                {/* Eixos */}
                {areas.map((area, i) => {
                    const point = getPoint(area.angle, 100);
                    return (
                        <line
                            key={i}
                            x1={centerX}
                            y1={centerY}
                            x2={point.x}
                            y2={point.y}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Dados (Preenchimento) */}
                <polygon
                    points={dataPolygon}
                    fill="url(#radarGradient)"
                    stroke={color}
                    strokeWidth="2"
                    filter="url(#glow)"
                />

                {/* Labels dos Eixos (Nomes) */}
                {areas.map((area, i) => {
                    const labelPoint = getPoint(area.angle, 125); // Um pouco mais distante
                    return (
                        <text
                            key={i}
                            x={labelPoint.x}
                            y={labelPoint.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(255,255,255,0.7)"
                            fontSize="12"
                            fontWeight="500"
                        >
                            {area.name}
                        </text>
                    );
                })}

                {/* Valores Numéricos no Eixo Vertical (Topo) */}
                {[20, 40, 60, 80, 100].map(val => {
                    // Posição no eixo superior (-90 graus)
                    const point = getPoint(-90, val);
                    return (
                        <text
                            key={`grid-val-${val}`}
                            x={point.x}
                            y={point.y - 6} // Um pouco acima da linha
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.4)"
                            fontSize="9"
                            fontWeight="400"
                        >
                            {val}
                        </text>
                    );
                })}

                {/* Valores Pontuais (Opcional - mostrando valor exato em cada ponta) */}
                {areas.map((area, i) => {
                    const point = getPoint(area.angle, area.value);
                    return (
                        <g key={`point-${i}`}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="4"
                                fill={color}
                                stroke="#fff"
                                strokeWidth="1.5"
                            />
                            {/* Mostra o valor próximo ao ponto */}
                            <text
                                x={point.x}
                                y={point.y - 10}
                                textAnchor="middle"
                                fill="#fff"
                                fontSize="10"
                                fontWeight="700"
                            >
                                {Math.round(area.value)}
                            </text>
                        </g>
                    );
                })}

            </svg>
        </div>
    );
};

export default RadarChart;
