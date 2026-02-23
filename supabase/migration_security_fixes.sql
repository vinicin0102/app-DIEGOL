-- Add is_admin column to profiles
alter table public.profiles add column if not exists is_admin boolean default false;

-- Create an initial admin (optional, user will need to do this manually for their ID)
-- update public.profiles set is_admin = true where email = 'USER_EMAIL';

-- Update RLS for challenges: Only Admins can modify
drop policy if exists "Everyone can insert challenges." on public.challenges;
drop policy if exists "Everyone can update challenges." on public.challenges;
drop policy if exists "Everyone can delete challenges." on public.challenges;

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

-- Update RLS for posts: Only owners can delete
drop policy if exists "Everyone can delete posts." on public.posts;
create policy "Users can delete own posts." on public.posts 
  for delete using (auth.uid() = user_id);

-- Update RLS for profiles: Ensure users can't make themselves admins
create or replace policy "Users can update own profile." on public.profiles 
  for update using (auth.uid() = id)
  with check (
    (case when is_admin is not null then is_admin = (select is_admin from public.profiles where id = auth.uid()) else true end)
  );
-- Note: The above policy is a bit tricky in Supabase RLS. Better approach:
-- Restrict update of is_admin column using a trigger or specific RLS.

create or replace function public.protect_admin_field()
returns trigger as $$
begin
  if (old.is_admin is distinct from new.is_admin) and (not exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)) then
    new.is_admin := old.is_admin;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_profile_update_protect_admin on public.profiles;
create trigger on_profile_update_protect_admin
  before update on public.profiles
  for each row execute procedure public.protect_admin_field();
