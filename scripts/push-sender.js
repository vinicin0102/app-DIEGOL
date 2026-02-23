/**
 * SCRIPT DE ENVIO DE PUSH COLETIVO (O Pulo do Gato)
 * Baseado no snippet fornecido pelo usuário.
 * 
 * Uso: node scripts/push-sender.js "Título" "Mensagem"
 */

const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');

// 1. Configuração do Firebase
// Certifique-se de que o arquivo serviceAccountKey.json está na raiz ou ajuste o caminho
let serviceAccount;
try {
    serviceAccount = require("../serviceAccountKey.json");
} catch (e) {
    console.error("ERRO: Arquivo serviceAccountKey.json não encontrado!");
    console.log("Baixe o JSON no Console Firebase > Configurações do Projeto > Contas de Serviço.");
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// 2. Configuração do Supabase (Ajuste com suas credenciais de ambiente se necessário)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'SUA_URL_SUPABASE';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'SUA_SERVICE_ROLE_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

/**
 * Função para enviar notificação para todos os alunos (FCM)
 */
async function sendPushToAllStudents(title, body) {
    try {
        console.log(`Buscando tokens no Supabase...`);

        // Buscar todos os tokens do banco de dados
        const { data: tokens, error } = await supabase
            .from('user_push_tokens')
            .select('fcm_token');

        if (error) throw error;

        const registrationTokens = [...new Set(tokens.map(t => t.fcm_token))];

        if (registrationTokens.length === 0) {
            console.log("Nenhum token encontrado no banco de dados.");
            return;
        }

        console.log(`Enviando para ${registrationTokens.length} dispositivos...`);

        // 3. Payload otimizado para modo PASSIVO (Background)
        const message = {
            notification: {
                title: title,
                body: body
            },
            android: {
                priority: 'high',
                notification: {
                    channelId: 'default_channel_id',
                    sound: 'default',
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK' // Opcional, ajuda no clique
                }
            },
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true, // Wake up device
                        sound: 'default'
                    }
                }
            },
            tokens: registrationTokens,
        };

        // Enviar as mensagens
        const response = await admin.messaging().sendMulticast(message);

        console.log(`--- RELATÓRIO DE ENVIO ---`);
        console.log(`Sucesso: ${response.successCount}`);
        console.log(`Falha: ${response.failureCount}`);

        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(registrationTokens[idx]);
                }
            });
            console.log(`Aviso: ${failedTokens.length} tokens falharam (podem estar expirados).`);
        }

    } catch (err) {
        console.error("Erro fatal ao enviar push:", err);
    }
}

// Execução via linha de comando
const args = process.argv.slice(2);
const title = args[0] || "Desafio dos Vencedores";
const body = args[1] || "Bora treinar hoje? Seu corpo agradece!";

sendPushToAllStudents(title, body).then(() => {
    console.log("Processo finalizado.");
    process.exit(0);
});
