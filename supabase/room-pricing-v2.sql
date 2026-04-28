alter table public.room_types
  add column if not exists price_day numeric(12,0) not null default 0,
  add column if not exists price_overnight numeric(12,0) not null default 0,
  add column if not exists price_extra_hour numeric(12,0) not null default 150000,
  add column if not exists checkin_day_time text not null default '14:00',
  add column if not exists checkout_day_time text not null default '22:00',
  add column if not exists checkin_overnight_time text not null default '14:00',
  add column if not exists checkout_overnight_time text not null default '12:00';

update public.room_types
set
  price_overnight = case when price_overnight = 0 then coalesce(base_price, 0) else price_overnight end,
  price_extra_hour = case when price_extra_hour = 0 then 150000 else price_extra_hour end;
