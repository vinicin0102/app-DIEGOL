-- ==========================================
-- SEGURANÇA E LGPD - CORREÇÕES DE RLS
-- ==========================================

-- 1. Adicionar coluna de admin aos perfis
alter table public.profiles add column if not exists is_admin boolean default false;

-- 2. Limpar políticas abertas em Desafios (restringir para apenas Admins)
drop policy if exists "Everyone can insert challenges." on public.challenges;
drop policy if exists "Everyone can update challenges." on public.challenges;
drop policy if exists "Everyone can delete challenges." on public.challenges;
drop policy if exists "Admins can insert challenges" on public.challenges;
drop policy if exists "Admins can update challenges" on public.challenges;
drop policy if exists "Admins can delete challenges" on public.challenges;

create policy "Admins can insert challenges" on public.challenges 
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update challenges" on public.challenges 
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can delete challenges" on public.challenges 
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 3. Limpar políticas em Posts (apenas o dono pode deletar)
drop policy if exists "Everyone can delete posts." on public.posts;
drop policy if exists "Users can delete own posts." on public.posts;

create policy "Users can delete own posts." on public.posts 
  for delete using (auth.uid() = user_id);

-- 4. Proteção do Perfil e Prevenção de Escalada de Privilégio
-- Nota: 'CREATE OR REPLACE POLICY' NÃO EXISTE NO POSTGRES. Por isso usamos DROP + CREATE.
drop policy if exists "Users can update own profile." on public.profiles;

create policy "Users can update own profile." on public.profiles 
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Função para proteger a coluna 'is_admin' de alterações por usuários comuns
create or replace function public.protect_admin_field()
returns trigger as $$
begin
  if (old.is_admin is distinct from new.is_admin) then
    if not exists (
      select 1 from public.profiles 
      where id = auth.uid() and is_admin = true
    ) then
      new.is_admin := old.is_admin;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para aplicar a proteção
drop trigger if exists on_profile_update_protect_admin on public.profiles;
create trigger on_profile_update_protect_admin
  before update on public.profiles
  for each row execute procedure public.protect_admin_field();
