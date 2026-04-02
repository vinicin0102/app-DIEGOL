export const bosses = [
    {
        id: 1,
        name: "Sedentarion",
        title: "O Senhor das Cadeiras",
        description: "O senhor das cadeiras e do sofá. Quanto mais você fica parado, mais forte ele fica.",
        health: 100,
        xpReward: 500,
        unlocked: true,
        image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&h=400&fit=crop",
        difficulty: "Iniciante",
        element: "Inércia",
        attack: "Onda de Preguiça"
    },
    {
        id: 2,
        name: "Procrastinossauro",
        title: "O Monstro do Amanhã",
        description: "O monstro que sempre fala: “deixa pra amanhã…”",
        health: 250,
        xpReward: 1200,
        unlocked: false,
        image: "https://images.unsplash.com/photo-1518110168401-f286b36006e8?w=400&h=400&fit=crop",
        difficulty: "Médio",
        element: "Tempo",
        attack: "Rugido do Depois"
    },
    {
        id: 3,
        name: "Preguiçor",
        title: "Dreno de Energia",
        description: "Uma criatura gigante que drena sua energia antes mesmo de você começar.",
        health: 450,
        xpReward: 2500,
        unlocked: false,
        image: "https://images.unsplash.com/photo-1621574539437-4b7b7405e68b?w=400&h=400&fit=crop",
        difficulty: "Difícil",
        element: "Cansaço",
        attack: "Sopro Sonolento"
    },
    {
        id: 4,
        name: "Sofatron",
        title: "Robô do Conforto",
        description: "O robô do conforto absoluto. Ele te prende no sofá e rouba sua disciplina.",
        health: 700,
        xpReward: 4500,
        unlocked: false,
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop",
        difficulty: "Elite",
        element: "Molas",
        attack: "Prisão de Veludo"
    },
    {
        id: 5,
        name: "Desculpator",
        title: "Mestre das Desculpas",
        description: "Mestre das desculpas: “tô cansado”, “amanhã eu vou”, “segunda eu começo”.",
        health: 1000,
        xpReward: 7500,
        unlocked: false,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop",
        difficulty: "Lendário",
        element: "Mente",
        attack: "Sussurro de Adiantamento"
    },
    {
        id: 6,
        name: "Sedentárkus",
        title: "General da Estagnação",
        description: "O general da estagnação. Seu objetivo é te manter parado para sempre.",
        health: 1500,
        xpReward: 12000,
        unlocked: false,
        image: "https://images.unsplash.com/photo-1541411191165-f184e0d45360?w=400&h=400&fit=crop",
        difficulty: "Mítico",
        element: "Paralisia",
        attack: "Ordem do Fique"
    },
    {
        id: 7,
        name: "ProcrastiKhan",
        title: "Imperador do Adiamento",
        description: "O imperador do adiamento. Governa o reino do “depois eu faço”.",
        health: 2200,
        xpReward: 18000,
        unlocked: false,
        image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop",
        difficulty: "Divino",
        element: "Império do Nada",
        attack: "Corte do Depois"
    },
    {
        id: 8,
        name: "Preguiçovski",
        title: "O Destruidor de Motivação",
        description: "Um vilão frio e calculista que destrói sua motivação lentamente.",
        health: 3000,
        xpReward: 25000,
        unlocked: false,
        image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?w=400&h=400&fit=crop",
        difficulty: "Ancestral",
        element: "Gelo Mental",
        attack: "Cálculo do Desânimo"
    },
    {
        id: 9,
        name: "Lorde Inércius",
        title: "Senhor da Inércia",
        description: "Senhor da inércia. Ele controla a força que te impede de sair do lugar.",
        health: 4500,
        xpReward: 40000,
        unlocked: false,
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
        difficulty: "Titan",
        element: "Gravidade",
        attack: "Campo Estático"
    },
    {
        id: 10,
        name: "Sombracansaço",
        title: "Entidade do Esgotamento",
        description: "A entidade que faz você se sentir cansado mesmo quando não fez nada.",
        health: 7000,
        xpReward: 100000,
        unlocked: false,
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop",
        difficulty: "Final Boss",
        element: "Sombra",
        attack: "Pesadelo Acordado"
    }
];

export const getAllBosses = () => bosses;
export const getCurrentBoss = (level) => {
    return bosses.find(b => b.health >= level) || bosses[bosses.length - 1];
};
