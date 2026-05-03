-- =============================================================================
-- Benizer Green Shop — public schema for Supabase (PostgreSQL + Auth)
-- Intended use: SQL Editor → New query → paste → Run.
--
-- Covers: products, orders, leads, distributors, profiles (+ RLS, triggers).
-- Application expects these tables; server actions use SUPABASE_SERVICE_ROLE_KEY,
-- while /distributor uses the logged-in user's JWT — orders needs an extra policy.
--
-- Re-run safe: policies/triggers use DROP IF EXISTS before CREATE.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  tagline text not null,
  price numeric(12, 2) not null,
  category text not null,
  ingredients text[] not null default '{}',
  benefits text[] not null default '{}',
  usage text not null,
  stock integer not null default 0,
  featured boolean not null default false,
  images text[] not null default '{}',
  active boolean not null default true
);

comment on table public.products is 'Admin-managed catalog (storefront may still use static site-data).';

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  payment_reference text unique,
  payment_gateway text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  total_amount numeric(12, 2) not null,
  -- Typical values: pending, processing, paid (webhooks), shipped, delivered, failed
  status text not null default 'pending',
  items jsonb not null default '[]'::jsonb,
  distributor_referral_code text,
  user_id uuid references auth.users (id) on delete set null
);

comment on table public.orders is 'Checkout rows; distributor_referral_code matches distributors.referral_code when set; user_id links logged-in shoppers for account order history.';

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  type text not null check (type in ('buyer', 'distributor')),
  product_interest text,
  message text,
  status text not null default 'new'
    check (
      status in (
        'new',
        'contacted',
        'converted_customer',
        'converted_distributor',
        'lost'
      )
    ),
  contacted_at timestamptz
);

comment on table public.leads is 'Buyer / distributor inquiries from forms and admin lifecycle updates.';

create table if not exists public.distributors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  referral_code text not null unique,
  total_sales numeric(12, 2) not null default 0,
  commission_earned numeric(12, 2) not null default 0,
  approved boolean not null default false
);

comment on table public.distributors is 'Partner accounts linked to auth.users; referral_code ties to orders.distributor_referral_code; one row per user (see distributors_one_user index).';

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text,
  role text not null default 'customer'
    check (role in ('customer', 'distributor', 'admin'))
);

comment on table public.profiles is 'App roles beside Supabase Auth; seeded/admin-created alongside auth.users.';

-- -----------------------------------------------------------------------------
-- Indexes (queries & FK lookups)
-- -----------------------------------------------------------------------------

create index if not exists idx_orders_created_at on public.orders (created_at desc);

create index if not exists idx_orders_distributor_referral
  on public.orders (distributor_referral_code)
  where distributor_referral_code is not null;

create index if not exists idx_leads_created_at on public.leads (created_at desc);

create index if not exists idx_leads_type_status on public.leads (type, status);

-- One distributor profile per auth user (also upgrades legacy DBs missing this constraint).
create unique index if not exists distributors_one_user on public.distributors (user_id);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.leads enable row level security;
alter table public.distributors enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "Public read products" on public.products;
drop policy if exists "Service role full products" on public.products;

drop policy if exists "Service role full orders" on public.orders;
drop policy if exists "Distributor reads referred orders" on public.orders;
drop policy if exists "Customer reads own orders" on public.orders;

drop policy if exists "Service role full leads" on public.leads;

drop policy if exists "Distributor reads own profile" on public.distributors;
drop policy if exists "Distributor reads own distributor row" on public.distributors;
drop policy if exists "Service role full distributors" on public.distributors;

drop policy if exists "Profile owner reads own profile" on public.profiles;
drop policy if exists "Service role full profiles" on public.profiles;
drop policy if exists "Profile owner updates own profile" on public.profiles;

-- Products: anonymous + authenticated catalog read (active only).
create policy "Public read products" on public.products
for select using (active = true);

create policy "Service role full products" on public.products
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Orders: service role for inserts/updates from server actions & webhooks;
-- approved distributors may count/read orders that used their referral code (JWT).
create policy "Service role full orders" on public.orders
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Distributor reads referred orders" on public.orders
for select to authenticated
using (
  distributor_referral_code is not null
  and exists (
    select 1
    from public.distributors d
    where d.user_id = auth.uid()
      and d.approved = true
      and d.referral_code = orders.distributor_referral_code
  )
);

create policy "Customer reads own orders" on public.orders
for select to authenticated
using (user_id is not null and user_id = auth.uid());

create policy "Service role full leads" on public.leads
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Distributors: partner reads own metrics row (dashboard).
create policy "Distributor reads own distributor row" on public.distributors
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

-- -----------------------------------------------------------------------------
-- Prevent privilege escalation via profile.role (admin updates role via service role only)
-- -----------------------------------------------------------------------------

create or replace function public.prevent_profile_role_change ()
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
for each row execute function public.prevent_profile_role_change ();

-- -----------------------------------------------------------------------------
-- Order history: shopper account link (backward compatible for older DBs),
-- and profiles for self-serve sign-ups.
-- -----------------------------------------------------------------------------

alter table public.orders
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists idx_orders_user_id on public.orders (user_id) where user_id is not null;

-- Customers who sign up via /auth/sign-up get a profile automatically. Admin-created
-- auth users include user_metadata.created_by_admin so this insert is skipped
-- (their profile is created with the correct role via service role).
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(new.raw_user_meta_data->>'created_by_admin', '') = 'true' then
    return new;
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), ''),
    'customer'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user ();

-- =============================================================================
-- Existing databases created before this revision:
-- If `distributors` lacked FK/unique on user_id, run manually after fixing rows:
--
--   alter table public.distributors
--     add constraint distributors_user_id_fkey foreign key (user_id)
--     references auth.users(id) on delete cascade;
--   alter table public.distributors
--     add constraint distributors_one_user unique (user_id);
-- =============================================================================
