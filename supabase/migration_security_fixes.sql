-- ==========================================
-- SEGURANÇA E LGPD - CORREÇÕES DE RLS
-- ==========================================

-- 1. Tabelas de Base e Colunas
alter table public.profiles add column if not exists is_admin boolean default false;

-- Definir Admin Verificado (Importante: Executar após o usuário se cadastrar)
update public.profiles 
set is_admin = true 
from auth.users 
where public.profiles.id = auth.users.id 
and auth.users.email = 'vinicius6655000@gmail.com';


-- Tabela para armazenar as inscrições de Push nativo (Browser Push API)
create table if not exists public.notification_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subscription jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Tabela para histórico de mensagens enviadas em massa
create table if not exists public.mass_notifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references public.profiles(id)
);

-- Tabela para preferências de incentivos diários
create table if not exists public.user_notification_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  preferred_time text default '08:00',
  incentive_type text default 'both',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- 2. Habilitação de RLS
alter table public.challenges enable row level security;
alter table public.posts enable row level security;
alter table public.profiles enable row level security;
alter table public.notification_subscriptions enable row level security;
alter table public.mass_notifications enable row level security;
alter table public.user_notification_settings enable row level security;


-- 3. Políticas de Segurança (Desafios)
drop policy if exists "Everyone can insert challenges." on public.challenges;
drop policy if exists "Everyone can update challenges." on public.challenges;
drop policy if exists "Everyone can delete challenges." on public.challenges;
drop policy if exists "Admins can insert challenges" on public.challenges;
drop policy if exists "Admins can update challenges" on public.challenges;
drop policy if exists "Admins can delete challenges" on public.challenges;

create policy "Admins can insert challenges" on public.challenges 
  for insert with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can update challenges" on public.challenges 
  for update using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can delete challenges" on public.challenges 
  for delete using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 4. Políticas de Segurança (Posts)
drop policy if exists "Everyone can delete posts." on public.posts;
drop policy if exists "Users can delete own posts." on public.posts;
create policy "Users can delete own posts." on public.posts for delete using (auth.uid() = user_id);

-- 5. Políticas de Segurança (Perfis e Notificações)
drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can manage own subscriptions" on public.notification_subscriptions;
create policy "Users can manage own subscriptions" on public.notification_subscriptions for all using (auth.uid() = user_id);

drop policy if exists "Users can manage own settings" on public.user_notification_settings;
create policy "Users can manage own settings" on public.user_notification_settings for all using (auth.uid() = user_id);

drop policy if exists "Admins can view mass notification history" on public.mass_notifications;
create policy "Admins can view mass notification history" on public.mass_notifications for select using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

drop policy if exists "Admins can insert mass notifications" on public.mass_notifications;
create policy "Admins can insert mass notifications" on public.mass_notifications for insert with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 6. Funções e Triggers de Proteção
create or replace function public.protect_admin_field()
returns trigger as $$
begin
  if (old.is_admin is distinct from new.is_admin) then
    if not exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) then
      new.is_admin := old.is_admin;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_profile_update_protect_admin on public.profiles;
create trigger on_profile_update_protect_admin
  before update on public.profiles
  for each row execute procedure public.protect_admin_field();
