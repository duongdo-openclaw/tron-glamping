-- Voucher system (phase 1)

create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null default '',
  description text,
  is_active boolean not null default true,

  discount_type text not null default 'fixed_amount', -- 'fixed_amount' | 'percent'
  discount_value numeric(12,2) not null default 0,

  starts_at timestamptz,
  ends_at timestamptz,

  max_total_uses int,
  max_uses_per_phone int,

  min_order_amount numeric(12,0) not null default 0,
  stackable boolean not null default false,

  applies_to_room_day boolean not null default true,
  applies_to_room_overnight boolean not null default true,
  applies_to_extra_hour boolean not null default true,
  applies_to_menu boolean not null default false,

  allowed_room_type_codes jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.voucher_redemptions (
  id uuid primary key default gen_random_uuid(),
  voucher_id uuid not null references public.vouchers(id) on delete cascade,
  voucher_code_snapshot text not null,
  phone text,
  lead_request_id uuid references public.lead_requests(id) on delete set null,
  discount_amount numeric(12,0) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists voucher_redemptions_voucher_id_idx on public.voucher_redemptions(voucher_id);
create index if not exists voucher_redemptions_phone_idx on public.voucher_redemptions(phone);

create trigger vouchers_set_updated_at before update on public.vouchers for each row execute function set_updated_at();

-- Add optional fields to lead_requests
alter table public.lead_requests
  add column if not exists voucher_code text,
  add column if not exists voucher_valid boolean,
  add column if not exists voucher_discount_amount numeric(12,0) not null default 0;
