export const BOSSES = [
    {
        id: 1,
        name: 'O Procrastinador',
        spriteType: 'megalodon',
        maxHealth: 100,
        color: '#1E4258',
        glowColor: 'rgba(30, 66, 88, 0.6)',
        story: 'Ele usa distrações, desculpas e dopamina barata para te impedir de começar. A única forma de vencê-lo é com CONSTÂNCIA.',
        challenge: 'FASE 1 — O DESPERTAR: 30 dias de disciplina básica.',
        reward: { xp: 1000, badge: '🏅 Fundador do Despertar' },
        difficulty: 'INICIANTE',
        locked: false,
        price: 0,
        challengeDuration: 30,
        element: 'ÁGUA',
        attack: 'Onda de Preguiça',
        guide: {
            title: 'FASE 1 — O DESPERTAR (Versão Iniciante)',
            duration: '30 dias',
            objective: 'Criar disciplina básica, constância e identidade vencedora',
            bossName: 'O Procrastinador',
            bossDescription: '(Inimigos: distração, desculpas, dopamina barata)',
            importantNote: 'Você não precisa ser perfeito. Pode falhar alguns dias. O que importa é atingir o XP mínimo da fase.',
            winCondition: [
                'Completar os 30 dias',
                'Concluir 4 desafios obrigatórios',
                'Alcançar 70% do XP total da fase'
            ],
            mandatoryChallenges: [
                {
                    title: '1 — CORPO EM MOVIMENTO',
                    name: 'Corpo em Movimento',
                    icon: '🦾',
                    mission: 'Treinar mínimo 3x por semana (20+ min). Vale caminhada, corrida, academia, funcional ou treino em casa.',
                    proof: 'Foto pós-treino ou check-in simples no app.',
                    extra: '+XP se treinar 4x na semana ou chamar alguém.'
                },
                {
                    title: '2 — CORPO LIMPO',
                    name: 'Corpo Limpo',
                    icon: '🥗',
                    mission: 'Reduzir açúcar refinado e refrigerante. Se escorregar um dia, segue o jogo.',
                    proof: 'Foto de 1 refeição limpa por dia ou check-in.',
                    extra: '+XP se completar a semana sem recaídas.'
                },
                {
                    title: '3 — MENTE FORTE',
                    name: 'Mente Forte',
                    icon: '🧠',
                    mission: 'Ler 5 páginas por dia de livro de desenvolvimento ou disciplina.',
                    proof: 'Foto do livro + 1 insight curto.',
                    extra: '+XP se não pular nenhum dia.'
                },
                {
                    title: '4 — EVOLUÇÃO REAL',
                    name: 'Evolução Real',
                    icon: '⚙️',
                    mission: 'Estudar 20 minutos por dia algo que gere crescimento pessoal/profissional.',
                    proof: 'Print do estudo + o que aprendeu.',
                    extra: '+XP se aplicar algo na prática.'
                }
            ],
            optionalChallenges: [
                {
                    title: '📖 CONEXÃO',
                    name: 'Conexão',
                    icon: '✨',
                    mission: 'Escolha UM: Leitura espiritual, Oração/Meditação 10 min ou Encontro religioso.',
                    proof: 'Foto ou check-in.'
                },
                {
                    title: '📵 DOMÍNIO DIGITAL',
                    name: 'Domínio Digital',
                    icon: '📵',
                    mission: 'Reduzir redes sociais para até 2h por dia.',
                    proof: 'Print do tempo de uso.',
                    extra: '+XP se ficar abaixo de 1h ou substituir por estudo.'
                }
            ],
            rewards: [
                'Acesso à Fase 2',
                'Badge "Fundador do Despertar"',
                'Nome no Hall dos Vencedores',
                'Prioridade em desafios futuros',
                'Acesso a grupo fechado'
            ]
        }
    },
    {
        id: 2,
        name: 'Tigre Dentes de Sabre',
        spriteType: 'sabertooth',
        maxHealth: 200,
        color: '#C49432',
        glowColor: 'rgba(196, 148, 50, 0.6)',
        story: 'Sobrevivente da Era do Gelo, o Smilodon Fatalis retornou! Seus caninos de 28cm perfuram qualquer defesa. Ele é a GULA que te caça quando você baixa a guarda.',
        challenge: 'Siga sua dieta por 14 dias sem trapacear',
        reward: { xp: 1000, badge: '🐯 Domador Primitivo' },
        difficulty: 'MÉDIO',
        locked: true,
        price: 29.90,
        element: 'TERRA',
        attack: 'Salto Fatal'
    },
    {
        id: 3,
        name: 'Dragão de Gelo Ancestral',
        spriteType: 'icedragon',
        maxHealth: 350,
        color: '#0288D1',
        glowColor: 'rgba(2, 136, 209, 0.6)',
        story: 'Vindo das montanhas congeladas além do tempo, este dragão milenar congela almas com seu sopro. Ele é a INSEGURANÇA que paralisa seu progresso.',
        challenge: 'Perca 5kg mantendo massa muscular',
        reward: { xp: 2000, badge: '🐲 Senhor do Gelo' },
        difficulty: 'DIFÍCIL',
        locked: true,
        price: 49.90,
        element: 'GELO',
        attack: 'Sopro Glacial'
    },
    {
        id: 4,
        name: 'Cérbero Infernal',
        spriteType: 'cerberus',
        maxHealth: 500,
        color: '#FF4500',
        glowColor: 'rgba(255, 69, 0, 0.6)',
        story: 'O guardião dos portões do Inferno tem 3 cabeças, cada uma sussurrando: "Desista!", "Você não consegue!", "É impossível!". Derrotar o Cérbero é conquistar a IMORTALIDADE!',
        challenge: 'Complete 30 dias de transformação total',
        reward: { xp: 5000, badge: '👑 Conquistador do Inferno' },
        difficulty: 'ELITE',
        locked: true,
        price: 99.90,
        element: 'FOGO',
        attack: 'Tríplice Mordida Infernal'
    },
    {
        id: 5,
        name: 'Kraken das Sombras',
        spriteType: 'kraken',
        maxHealth: 300,
        color: '#6B3FA0',
        glowColor: 'rgba(107, 63, 160, 0.6)',
        story: 'Das profundezas onde a luz nunca alcança, o Kraken estende seus tentáculos. Cada um representa uma desculpa: "Estou cansado", "Hoje não dá", "Amanhã eu vou".',
        challenge: 'Acorde às 5h e treine por 21 dias',
        reward: { xp: 2500, badge: '🦑 Destruidor de Tentáculos' },
        difficulty: 'DIFÍCIL',
        locked: true,
        price: 59.90,
        element: 'TREVAS',
        attack: 'Abraço Abissal'
    },
    {
        id: 6,
        name: 'Fênix Sombria',
        spriteType: 'phoenix',
        maxHealth: 250,
        color: '#DC143C',
        glowColor: 'rgba(220, 20, 60, 0.6)',
        story: 'A Fênix Sombria renasce das cinzas da comparação. Ela te mostra o sucesso dos outros para queimar sua autoestima. Mas das suas próprias cinzas, você também pode renascer!',
        challenge: 'Melhore seus próprios records em todos exercícios',
        reward: { xp: 1500, badge: '🔥 Renascido das Chamas' },
        difficulty: 'MÉDIO',
        locked: true,
        price: 39.90,
        element: 'FOGO',
        attack: 'Chama da Inveja'
    }
];
