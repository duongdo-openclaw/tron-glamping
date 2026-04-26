create extension if not exists pgcrypto;

create type booking_status as enum ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled');
create type inventory_status as enum ('available', 'held', 'booked', 'maintenance');
create type pricing_kind as enum ('nightly', 'daily', 'hourly_extra');

create table if not exists room_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  capacity_adults int not null default 2,
  capacity_children int not null default 0,
  base_price numeric(12,0) not null default 0,
  hero_image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inventory_units (
  id uuid primary key default gen_random_uuid(),
  room_type_id uuid not null references room_types(id) on delete cascade,
  code text unique not null,
  name text not null,
  status inventory_status not null default 'available',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  guest_id uuid not null references guests(id) on delete restrict,
  room_type_id uuid not null references room_types(id) on delete restrict,
  inventory_unit_id uuid references inventory_units(id) on delete set null,
  status booking_status not null default 'pending',
  check_in_date date not null,
  check_out_date date not null,
  check_in_time time not null default '14:00',
  check_out_time time not null default '12:00',
  guest_count_adults int not null default 1,
  guest_count_children int not null default 0,
  nightly_rate numeric(12,0) not null default 0,
  subtotal_amount numeric(12,0) not null default 0,
  extra_hour_count int not null default 0,
  extra_hour_rate numeric(12,0) not null default 0,
  extra_amount numeric(12,0) not null default 0,
  discount_amount numeric(12,0) not null default 0,
  total_amount numeric(12,0) not null default 0,
  deposit_amount numeric(12,0) not null default 0,
  source text default 'website',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_date_range check (check_out_date >= check_in_date)
);

create table if not exists pricing_rules (
  id uuid primary key default gen_random_uuid(),
  room_type_id uuid not null references room_types(id) on delete cascade,
  pricing_kind pricing_kind not null,
  start_date date not null,
  end_date date not null,
  day_of_week int,
  amount numeric(12,0) not null,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pricing_rules_date_range check (end_date >= start_date),
  constraint pricing_rules_day_of_week check (day_of_week is null or day_of_week between 0 and 6)
);

create table if not exists lead_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  requested_room_type text,
  check_in_date date,
  check_out_date date,
  message text,
  source text default 'website',
  created_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger room_types_set_updated_at before update on room_types for each row execute function set_updated_at();
create trigger inventory_units_set_updated_at before update on inventory_units for each row execute function set_updated_at();
create trigger bookings_set_updated_at before update on bookings for each row execute function set_updated_at();
create trigger pricing_rules_set_updated_at before update on pricing_rules for each row execute function set_updated_at();

insert into room_types (code, name, description, capacity_adults, base_price, hero_image_url, sort_order)
values
  ('GLAMPING_DOME', 'Glamping Dome', 'View hồ, phù hợp nhóm 2-4 khách.', 4, 2000000, 'https://w.ladicdn.com/s800x1000/59364fe77015e1b316b75df7/img_7457-20251113063529-mphok.jpeg', 1),
  ('GLAMPING_MCN', 'Glamping Mông Cổ (MCN)', 'Không gian riêng tư, tối đa 4 khách.', 4, 1000000, 'https://w.ladicdn.com/s700x850/59364fe77015e1b316b75df7/img_7456-20251113063516-n0nux.jpeg', 2),
  ('GLAMPING_MCL', 'Glamping Mông Cổ (MCL)', 'Bản rộng hơn, tối đa 4 khách.', 4, 1200000, 'https://w.ladicdn.com/s700x850/59364fe77015e1b316b75df7/img_7458-20251113063635-the8r.jpeg', 3),
  ('GLAMPING_HOME', 'Glamping Home', 'Phù hợp cặp đôi/gia đình nhỏ, tối đa 3 khách.', 3, 1200000, 'https://w.ladicdn.com/s800x950/59364fe77015e1b316b75df7/img_7461-20251113063459-ddeld.jpeg', 4),
  ('VENUE_RENTAL', 'Thuê địa điểm', 'Không gian tổ chức picnic/team building.', 2, 0, 'https://w.ladicdn.com/s800x700/59364fe77015e1b316b75df7/img_7083-20241208050848-u58yd.jpg', 5)
on conflict (code) do nothing;

insert into pricing_rules (room_type_id, pricing_kind, start_date, end_date, day_of_week, amount, label)
select id, 'hourly_extra', '2026-01-01', '2027-12-31', null, 100000, 'Phụ thu thêm giờ mẫu'
from room_types
where code in ('GLAMPING_DOME', 'GLAMPING_MCN', 'GLAMPING_MCL', 'GLAMPING_HOME')
on conflict do nothing;
