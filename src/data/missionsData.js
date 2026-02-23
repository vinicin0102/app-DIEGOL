export const INITIAL_MISSIONS = [
    { id: 1, title: 'Beber 2L a 3L De Água', category: 'Saúde', xp: 10, type: 'diaria', icon: '💧' },
    { id: 2, title: 'Ler Um Livro', category: 'Mente', xp: 8, type: 'diaria', icon: '📚' },
    { id: 3, title: 'Leitura Espiritual Diária', category: 'Espiritual', xp: 12, type: 'diaria', icon: '🙏' },
    { id: 4, title: 'Treino de Força', category: 'Corpo', xp: 20, type: 'diaria', icon: '💪' },
    { id: 5, title: 'Mente Blindada - Estudo', category: 'Mente', xp: 15, type: 'diaria', icon: '🧠' },
];

export const getRank = (level) => {
    if (level < 5) return 'E';
    if (level < 10) return 'D';
    if (level < 20) return 'C';
    if (level < 35) return 'B';
    if (level < 50) return 'A';
    return 'S';
};

export const getRankColor = (rank) => {
    switch (rank) {
        case 'E': return '#888';
        case 'D': return '#4ade80';
        case 'C': return '#3b82f6';
        case 'B': return '#a855f7';
        case 'A': return '#f59e0b';
        case 'S': return '#ef4444';
        default: return '#fff';
    }
};
