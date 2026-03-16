
export const BOSS_MESSAGES = [
    "Você não vai treinar hoje… eu te conheço.",
    "Deixa pra amanhã. Hoje você merece descansar.",
    "O sofá tá confortável demais pra você sair agora.",
    "Treinar? Duvido que você tenha disciplina pra isso.",
    "Só hoje sem treinar… ninguém vai perceber.",
    "Você sempre fala que vai treinar… mas nunca vai.",
    "Vai colocar o tênis mesmo ou vai desistir de novo?",
    "Fica aí rolando o celular… treinar pode esperar.",
    "Mais um dia parado. Obrigado por me deixar mais forte.",
    "Treinar hoje? Acho que não.",
    "Você já está cansado só de pensar em treinar.",
    "O sofá venceu de novo, não foi?",
    "Disciplina não é pra você.",
    "Treinar dá trabalho… fica aí mesmo.",
    "Só mais um episódio… depois você pensa em treinar.",
    "Você sabe que não vai sair pra treinar.",
    "Olha o relógio… já ficou tarde demais.",
    "Treinar hoje não vai mudar nada.",
    "Você tentou antes e desistiu… lembra?",
    "Relaxa… faltar hoje não tem problema.",
    "Seu corpo pede descanso, não treino.",
    "Você não vai me vencer hoje.",
    "Treinar agora? Melhor amanhã.",
    "Eu adoro quando você desiste.",
    "Mais um dia sem treinar… perfeito.",
    "Vai mesmo sair do sofá? Quero ver.",
    "Você sempre começa… mas nunca termina.",
    "Fica aí confortável. A academia pode esperar.",
    "Só hoje sem treino… depois você volta.",
    "Eu já sabia que você não ia treinar hoje."
];

export const MOTIVATIONAL_MESSAGES = [
    "Bora treinar. Quem tá vivo tá treinando. 💪🏆",
    "Já tomou café? Já bebeu sua água? Agora é só ir treinar.",
    "Levanta desse sofá. Seu corpo merece movimento.",
    "Disciplina hoje, resultado amanhã. Bora treinar.",
    "Só existe um treino ruim: o treino que você não fez.",
    "Bora levantar desse sofá e agachar. Bunda triste nunca mais. 🍑",
    "1% melhor hoje. Bora treinar.",
    "Seu futuro agradece o treino que você faz hoje.",
    "Energia não aparece do nada. Ela vem depois do treino.",
    "Vai lá e faz. Depois você agradece a si mesmo.",
    "O treino de hoje constrói o corpo de amanhã.",
    "Sem desculpas. Só movimento. Bora treinar.",
    "Hoje é dia de ficar mais forte que ontem.",
    "O sofá não muda sua vida. O treino muda.",
    "Coloca o tênis e vai. O resto se resolve na academia.",
    "Quem quer resultado não negocia com a preguiça.",
    "Seu único concorrente é quem você foi ontem.",
    "Mais um treino, mais um passo na direção certa.",
    "Treinar hoje é investir em você.",
    "Seu corpo pode mais do que sua mente acha.",
    "Cansaço passa. Orgulho de treinar fica.",
    "Bora treinar. Seu corpo foi feito pra se mover.",
    "Um treino de cada vez. É assim que se vence.",
    "Não espere motivação. Crie disciplina.",
    "A academia tá te esperando. Bora.",
    "Hoje é dia de suar e evoluir.",
    "Levanta, respira fundo e vai treinar.",
    "Resultado não vem de desculpa, vem de treino.",
    "Seu melhor shape começa com o treino de hoje.",
    "Bora treinar. O primeiro passo é levantar."
];

export const WATER_MESSAGES = [
    "Hora do Drop de Hidratação! 💧 Beba um copo d'água agora.",
    "Guerreiro hidratado é guerreiro mais forte. Bebe água! 🥤",
    "Sua performance cai se você estiver desidratado. Água neles! 💦",
    "Não espere ter sede. Beba água agora! 💧",
    "Água é o combustível do seu metabolismo. Abasteça! ⚡💧",
    "Beba água para manter o foco e a energia. 🧘‍♂️💦",
    "Já bebeu seus 2L hoje? Comece agora! 💧",
    "Seu corpo é 70% água. Não deixe o tanque baixar! 🌊",
    "Hidratação é disciplina. Beba água! 💧🦾",
    "Um copo d'água agora para continuar vencendo. 🏆💦"
];

export const getScheduledMessage = (hour) => {
    // Hour is expected to be 0-23
    if (hour < 6 || hour > 23) return null;
    
    const index = (hour - 6) % BOSS_MESSAGES.length;
    const isBoss = hour % 2 === 0; // Alternate even/odd hours
    
    return {
        type: isBoss ? 'CHEFÃO' : 'MOTIVACIONAL',
        message: isBoss ? BOSS_MESSAGES[index] : MOTIVATIONAL_MESSAGES[index],
        icon: isBoss ? '💀' : '⚡'
    };
};
