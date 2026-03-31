-- 1. WHITE_LIST DE ALUNOS AUTORIZADOS
create table if not exists public.authorized_emails (
  email text primary key,
  created_at timestamp with time zone default now()
);

-- Inserir os 10 e-mails solicitados
insert into public.authorized_emails (email) values
('anacarolinasilveiraribeiro@gmail.com'),
('leticiakcastilho06@gmail.com'),
('jaquevcastilho86@hotmail.com'),
('rubiarocha89@gmail.com'),
('vaneramendes@gmail.com'),
('beltedbj@gmail.com'),
('studio.juniamarizanails@gmail.com'),
('brunaquenupe@outlook.com'),
('Regianelorrayne@icloud.com'),
('Tamara19Mendes@gmail.com')
on conflict do nothing;

-- 2. CORREÇÃO DO STORAGE (Fotos do Chat)
-- Garantir que o bucket 'community' existe e é público
insert into storage.buckets (id, name, public) 
values ('community', 'community', true)
on conflict (id) do update set public = true;

-- Remover políticas antigas para evitar conflitos (opcional, mas seguro)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Allow authenticated uploads" on storage.objects;
drop policy if exists "Allow public read" on storage.objects;

-- Criar políticas robustas
create policy "Public Access" 
on storage.objects for select 
using (bucket_id = 'community');

create policy "Authenticated Upload" 
on storage.objects for insert 
with check (bucket_id = 'community' and auth.role() = 'authenticated');

create policy "Authenticated Delete" 
on storage.objects for delete 
using (bucket_id = 'community' and auth.role() = 'authenticated');

-- 3. CORREÇÃO DE NOTIFICAÇÕES
-- Resetar notificações que falharam mas ainda estão no futuro
update public.scheduled_notifications 
set status = 'pending' 
where status = 'failed' 
and schedule_at > now();

-- Garantir que a tabela mass_notifications permite inserção pelo admin
grant insert on table public.mass_notifications to authenticated;
grant select on table public.mass_notifications to authenticated;
