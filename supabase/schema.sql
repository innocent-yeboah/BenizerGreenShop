create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  tagline text not null,
  price numeric(12,2) not null,
  category text not null,
  ingredients text[] not null default '{}',
  benefits text[] not null default '{}',
  usage text not null,
  stock integer not null default 0,
  featured boolean not null default false,
  images text[] not null default '{}',
  active boolean not null default true
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  payment_reference text unique,
  payment_gateway text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  total_amount numeric(12,2) not null,
  status text not null default 'pending',
  items jsonb not null default '[]'::jsonb,
  distributor_referral_code text
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  type text not null check (type in ('buyer', 'distributor')),
  product_interest text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'converted_customer', 'converted_distributor', 'lost')),
  contacted_at timestamptz
);

create table if not exists public.distributors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null,
  referral_code text not null unique,
  total_sales numeric(12,2) not null default 0,
  commission_earned numeric(12,2) not null default 0,
  approved boolean not null default false
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'distributor', 'admin'))
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.leads enable row level security;
alter table public.distributors enable row level security;
alter table public.profiles enable row level security;

-- Safe to re-run: drop policies before recreate
drop policy if exists "Public read products" on public.products;
drop policy if exists "Service role full products" on public.products;
drop policy if exists "Service role full orders" on public.orders;
drop policy if exists "Service role full leads" on public.leads;
drop policy if exists "Distributor reads own profile" on public.distributors;
drop policy if exists "Service role full distributors" on public.distributors;
drop policy if exists "Profile owner reads own profile" on public.profiles;
drop policy if exists "Service role full profiles" on public.profiles;
drop policy if exists "Profile owner updates own profile" on public.profiles;

create policy "Public read products" on public.products
for select using (active = true);

create policy "Service role full products" on public.products
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Service role full orders" on public.orders
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Service role full leads" on public.leads
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Distributor reads own profile" on public.distributors
for select using (auth.uid() = user_id);

create policy "Service role full distributors" on public.distributors
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Profile owner reads own profile" on public.profiles
for select using (auth.uid() = id);

create policy "Service role full profiles" on public.profiles
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Profile owner updates own profile" on public.profiles
for update using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and new.role is distinct from old.role then
    raise exception 'Role cannot be changed from the profile screen';
  end if;
  return new;
end;
$$;

drop trigger if exists profile_no_role_change on public.profiles;
create trigger profile_no_role_change
before update on public.profiles
for each row execute function public.prevent_profile_role_change();
