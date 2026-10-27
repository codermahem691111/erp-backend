-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
-- After this file, also run `database/services.sql` for people, products, and finance.
--
-- Logins (email, password, verification status) live in Supabase Auth (auth.users).
-- This table only holds the company details and is linked 1-to-1 to the auth user.

-- The first version of this project used a different `companies` table (it stored
-- passwords itself). This line removes it. Delete this line once you have real data.
drop table if exists public.companies cascade;

create table public.companies (
  id                    uuid primary key references auth.users (id) on delete cascade,
  company_name          text        not null,
  license_number        text        not null,
  owner_name            text        not null,
  business_description  text        not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint companies_license_number_key unique (license_number)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger companies_set_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

-- Lock the table down: with RLS enabled and no policies, the public (publishable)
-- key cannot read or write it. Only the backend, using the secret key, can.
alter table public.companies enable row level security;
