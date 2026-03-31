/**
 * 🔥 10 CHEFÕES DO DESAFIO DOS VENCEDORES
 * Cada mês um boss diferente é rotacionado como o Desafio Coletivo.
 * Os bosses escalam em dificuldade (HP crescente).
 */

const BOSSES_DESAFIO = [
  {
    id: 1,
    key: 'sedentarion',
    name: 'Sedentarion',
    title: 'O senhor das cadeiras e do sofá',
    description: 'Quanto mais você fica parado, mais forte ele fica.',
    lore: 'Nascido nos abismos do conforto extremo, Sedentarion se alimenta de cada hora que você passa sentado sem propósito.',
    hp: 25000,
    weeklyCaps: [5000, 6250, 6250, 7500],
    emoji: '🪑',
    color: '#8B0000',
    aura: 'rgba(139, 0, 0, 0.3)',
    difficulty: 'Normal',
    month: 1,
  },
  {
    id: 2,
    key: 'procrastinossauro',
    name: 'Procrastinossauro',
    title: 'O monstro do adiamento',
    description: 'O monstro que sempre fala: “deixa pra amanhã…”',
    lore: 'O mestre da procrastinação que te convence a deixar tudo para depois.',
    hp: 27500,
    weeklyCaps: [5500, 6875, 6875, 8250],
    emoji: '🦖',
    color: '#FF8C00',
    aura: 'rgba(255, 140, 0, 0.3)',
    difficulty: 'Normal',
    month: 2,
  },
  {
    id: 3,
    key: 'preguicordrenante',
    name: 'Preguiçor',
    title: 'O Devorador de Vontade',
    description: 'Uma criatura gigante que drena sua energia antes mesmo de você começar.',
    lore: 'Preguiçor suga toda a sua motivação antes mesmo do primeiro movimento.',
    hp: 30000,
    weeklyCaps: [6000, 7500, 7500, 9000],
    emoji: '🦥',
    color: '#228B22',
    aura: 'rgba(34, 139, 34, 0.3)',
    difficulty: 'Difícil',
    month: 3,
  },
  {
    id: 4,
    key: 'sofatron',
    name: 'Sofatron',
    title: 'O robô do conforto absoluto',
    description: 'Ele te prende no sofá e rouba sua disciplina.',
    lore: 'A máquina perfeita projetada para te manter fundido ao assento.',
    hp: 30000,
    weeklyCaps: [6000, 7500, 7500, 9000],
    emoji: '🤖',
    color: '#4169E1',
    aura: 'rgba(65, 105, 225, 0.3)',
    difficulty: 'Difícil',
    month: 4,
  },
  {
    id: 5,
    key: 'desculpator',
    name: 'Desculpator',
    title: 'Mestre das desculpas',
    description: 'Mestre das desculpas: “tô cansado”, “amanhã eu vou”, “segunda eu começo”.',
    lore: 'Ele sempre tem uma justificativa perfeita para você não treinar hoje.',
    hp: 32500,
    weeklyCaps: [6500, 8125, 8125, 9750],
    emoji: '🗣️',
    color: '#FF6347',
    aura: 'rgba(255, 99, 71, 0.3)',
    difficulty: 'Difícil',
    month: 5,
  },
  {
    id: 6,
    key: 'sedentarkus',
    name: 'Sedentárkus',
    title: 'O general da estagnação',
    description: 'Seu objetivo é te manter parado para sempre.',
    lore: 'O comandante das forças da inércia e do desânimo.',
    hp: 35000,
    weeklyCaps: [7000, 8750, 8750, 10500],
    emoji: '⚔️',
    color: '#DC143C',
    aura: 'rgba(220, 20, 60, 0.3)',
    difficulty: 'Épico',
    month: 6,
  },
  {
    id: 7,
    key: 'procrastikhan',
    name: 'ProcrastiKhan',
    title: 'O imperador do adiamento',
    description: 'Governa o reino do “depois eu faço”.',
    lore: 'A autoridade suprema na arte de empurrar as tarefas com a barriga.',
    hp: 37500,
    weeklyCaps: [7500, 9375, 9375, 11250],
    emoji: '👑',
    color: '#FFD700',
    aura: 'rgba(255, 215, 0, 0.3)',
    difficulty: 'Épico',
    month: 7,
  },
  {
    id: 8,
    key: 'preguicovski',
    name: 'Preguiçovski',
    title: 'O vilão frio e calculista',
    description: 'Um vilão frio e calculista que destrói sua motivação lentamente.',
    lore: 'Um estrategista do desânimo que mina sua força de vontade aos poucos.',
    hp: 40000,
    weeklyCaps: [8000, 10000, 10000, 12000],
    emoji: '🧊',
    color: '#00CED1',
    aura: 'rgba(0, 206, 209, 0.3)',
    difficulty: 'Épico',
    month: 8,
  },
  {
    id: 9,
    key: 'lorde_inercius',
    name: 'Lorde Inércius',
    title: 'Senhor da inércia',
    description: 'Ele controla a força que te impede de sair do lugar.',
    lore: 'O mestre da gravidade que te puxa para baixo quando você tenta se levantar.',
    hp: 42500,
    weeklyCaps: [8500, 10625, 10625, 12750],
    emoji: '🕳️',
    color: '#7B2FFF',
    aura: 'rgba(123, 47, 255, 0.3)',
    difficulty: 'Lendário',
    month: 9,
  },
  {
    id: 10,
    key: 'sombracansaco',
    name: 'Sombracansaço',
    title: 'A entidade do cansaço eterno',
    description: 'A entidade que faz você se sentir cansado mesmo quando não fez nada.',
    lore: 'O pesadelo final que te esgota sem que você tenha movido um músculo.',
    hp: 50000,
    weeklyCaps: [10000, 12500, 12500, 15000],
    emoji: '👻',
    color: '#4B0082',
    aura: 'rgba(75, 0, 130, 0.3)',
    difficulty: 'Lendário',
    month: 10,
  },
];

/**
 * Retorna o boss atual baseado no mês corrente (1-10, depois cicla)
 */
export const getCurrentBoss = () => {
  const month = new Date().getMonth(); // 0-11
  const bossIndex = month % BOSSES_DESAFIO.length;
  return BOSSES_DESAFIO[bossIndex];
};

/**
 * Retorna boss por key
 */
export const getBossByKey = (key) => {
  return BOSSES_DESAFIO.find(b => b.key === key) || BOSSES_DESAFIO[0];
};

/**
 * Retorna todos os bosses
 */
export const getAllBosses = () => BOSSES_DESAFIO;

export default BOSSES_DESAFIO;
