-- Run this once in the Supabase SQL Editor after `schema.sql`.
-- Three tenant-scoped tables: people, products, finance_entries.
-- Every row belongs to one company (companies.id = auth.users.id).
-- RLS plus the API (which always uses the signed-in company id) keep
-- one company's data invisible to every other company.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. People management: customers, staff, suppliers
-- ---------------------------------------------------------------------------
create table if not exists public.people (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  person_type   text not null,
  name          text not null,
  details       text not null default '',
  email         text,
  phone         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint people_type_check check (person_type in ('customer', 'staff', 'supplier')),
  constraint people_name_length check (char_length(name) between 1 and 150)
);

create index if not exists people_company_id_idx on public.people (company_id);
create index if not exists people_company_type_idx on public.people (company_id, person_type);

drop trigger if exists people_set_updated_at on public.people;
create trigger people_set_updated_at
  before update on public.people
  for each row execute function public.set_updated_at();

alter table public.people enable row level security;
alter table public.people force row level security;

drop policy if exists people_select_own on public.people;
drop policy if exists people_insert_own on public.people;
drop policy if exists people_update_own on public.people;
drop policy if exists people_delete_own on public.people;

create policy people_select_own on public.people
  for select to authenticated
  using (company_id = auth.uid());

create policy people_insert_own on public.people
  for insert to authenticated
  with check (company_id = auth.uid());

create policy people_update_own on public.people
  for update to authenticated
  using (company_id = auth.uid())
  with check (company_id = auth.uid());

create policy people_delete_own on public.people
  for delete to authenticated
  using (company_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 2. Product management
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  name           text not null,
  details        text not null default '',
  selling_price  numeric(12, 2) not null,
  buying_price   numeric(12, 2) not null,
  image_url      text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint products_name_length check (char_length(name) between 1 and 150),
  constraint products_selling_price_nonneg check (selling_price >= 0),
  constraint products_buying_price_nonneg check (buying_price >= 0)
);

create index if not exists products_company_id_idx on public.products (company_id);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.products force row level security;

drop policy if exists products_select_own on public.products;
drop policy if exists products_insert_own on public.products;
drop policy if exists products_update_own on public.products;
drop policy if exists products_delete_own on public.products;

create policy products_select_own on public.products
  for select to authenticated
  using (company_id = auth.uid());

create policy products_insert_own on public.products
  for insert to authenticated
  with check (company_id = auth.uid());

create policy products_update_own on public.products
  for update to authenticated
  using (company_id = auth.uid())
  with check (company_id = auth.uid());

create policy products_delete_own on public.products
  for delete to authenticated
  using (company_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3. Finance management: income (sales) and three expense categories
-- ---------------------------------------------------------------------------
create table if not exists public.finance_entries (
  id                 uuid primary key default gen_random_uuid(),
  company_id         uuid not null references public.companies (id) on delete cascade,
  entry_type         text not null,
  expense_category   text,
  amount             numeric(14, 2) not null,
  note               text not null default '',
  product_id         uuid references public.products (id) on delete set null,
  occurred_at        timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint finance_entry_type_check check (entry_type in ('income', 'expense')),
  constraint finance_amount_positive check (amount > 0),
  constraint finance_category_matches_type check (
    (entry_type = 'income' and expense_category is null)
    or (
      entry_type = 'expense'
      and expense_category in ('staff_salary', 'product_buying', 'store_maintenance')
    )
  )
);

create index if not exists finance_entries_company_id_idx on public.finance_entries (company_id);
create index if not exists finance_entries_company_occurred_idx on public.finance_entries (company_id, occurred_at);

drop trigger if exists finance_entries_set_updated_at on public.finance_entries;
create trigger finance_entries_set_updated_at
  before update on public.finance_entries
  for each row execute function public.set_updated_at();

alter table public.finance_entries enable row level security;
alter table public.finance_entries force row level security;

drop policy if exists finance_select_own on public.finance_entries;
drop policy if exists finance_insert_own on public.finance_entries;
drop policy if exists finance_update_own on public.finance_entries;
drop policy if exists finance_delete_own on public.finance_entries;

create policy finance_select_own on public.finance_entries
  for select to authenticated
  using (company_id = auth.uid());

create policy finance_insert_own on public.finance_entries
  for insert to authenticated
  with check (company_id = auth.uid());

create policy finance_update_own on public.finance_entries
  for update to authenticated
  using (company_id = auth.uid())
  with check (company_id = auth.uid());

create policy finance_delete_own on public.finance_entries
  for delete to authenticated
  using (company_id = auth.uid());

-- Product images: files live under {company_id}/{product_id}
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists product_images_select on storage.objects;
drop policy if exists product_images_insert on storage.objects;
drop policy if exists product_images_update on storage.objects;
drop policy if exists product_images_delete on storage.objects;

create policy product_images_select on storage.objects
  for select to public
  using (bucket_id = 'product-images');

create policy product_images_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy product_images_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'product-images'
    and split_part(name, '/', 1) = auth.uid()::text
  )
  with check (
    bucket_id = 'product-images'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy product_images_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'product-images'
    and split_part(name, '/', 1) = auth.uid()::text
  );
