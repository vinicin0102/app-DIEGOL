# Configuração do Banco de Dados Supabase

Para que o projeto funcione corretamente com o Supabase, você precisa criar as tabelas no seu banco de dados.

Como eu não tenho acesso direto ao seu painel do Supabase com permissões de administrador de banco de dados (precisaria da senha do banco), preparei o script SQL para você rodar.

## Passos:

1. Acesse o **Dashboard do Supabase**: [https://supabase.com/dashboard/project/efxhripfmtwsmbqkomza](https://supabase.com/dashboard/project/efxhripfmtwsmbqkomza)
2. Vá para a seção **SQL Editor** (ícone de terminal na barra lateral esquerda).
3. Clique em **"New Query"**.
4. Copie e cole o conteúdo do arquivo `supabase/schema.sql` que eu criei no seu projeto.
5. Clique em **RUN** para executar o script.

Isso criará as tabelas `profiles`, `challenges`, e `posts` e configurará as permissões de segurança.

## Login

Adicionei uma página de Login em `/login`. Você pode acessá-la clicando no perfil do usuário na barra lateral (se estiver deslogado).

O aplicativo está configurado para funcionar de forma **híbrida**:
- Se não estiver logado, usa `localStorage` (como estava antes).
- Se fizer login, sincroniza os dados com o Supabase.
