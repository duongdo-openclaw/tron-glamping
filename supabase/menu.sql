-- Food/Drink menu for Tron Glamping

do $$
begin
  if not exists (select 1 from pg_type where typname = 'menu_category') then
    create type menu_category as enum ('food','drink','combo');
  end if;
end $$;

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category menu_category not null,
  name text not null,
  description text,
  price numeric(12,0) not null default 0,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists menu_items_set_updated_at on public.menu_items;
create trigger menu_items_set_updated_at before update on public.menu_items
for each row execute function public.set_updated_at();

alter table public.menu_items enable row level security;

drop policy if exists menu_items_public_select on public.menu_items;
create policy menu_items_public_select on public.menu_items
for select to anon, authenticated
using (true);

drop policy if exists menu_items_public_write on public.menu_items;
create policy menu_items_public_write on public.menu_items
for all to anon, authenticated
using (true)
with check (true);

-- seed 10 drinks, 10 foods, combos
insert into public.menu_items (category, name, description, price, sort_order)
values
  ('drink','Trà đào cam sả','Mát nhẹ, hợp chiều muộn',45000,10),
  ('drink','Trà chanh sả','Chua nhẹ, thơm sả',35000,11),
  ('drink','Trà quất mật ong','Ấm – tốt cổ họng',40000,12),
  ('drink','Nước suối','Chai 500ml',20000,13),
  ('drink','Coca / Pepsi','Lon',25000,14),
  ('drink','Bia Heineken','Lon',35000,15),
  ('drink','Bia Tiger','Lon',30000,16),
  ('drink','Nước cam','Ép tươi',50000,17),
  ('drink','Cà phê đen','Nóng/đá',35000,18),
  ('drink','Cà phê sữa','Nóng/đá',40000,19),

  ('food','BBQ set (cơ bản)','Thịt + rau + sốt (cho 2 người)',299000,20),
  ('food','Gà nướng','Nửa con',249000,21),
  ('food','Xúc xích nướng','Phần 6 cây',99000,22),
  ('food','Khoai lang nướng','Phần',59000,23),
  ('food','Ngô nướng','2 bắp',59000,24),
  ('food','Mỳ xào','Phần',89000,25),
  ('food','Cơm rang','Phần',89000,26),
  ('food','Lẩu (tuỳ chọn)','Set 2-3 người',399000,27),
  ('food','Snack / bim bim','Gói',25000,28),
  ('food','Trái cây theo mùa','Đĩa',129000,29),

  ('combo','Combo Chill 1','BBQ set + 2 bia + snack',399000,40),
  ('combo','Combo Chill 2','Gà nướng + 2 trà + trái cây',429000,41),
  ('combo','Combo Family','Lẩu + 4 nước + trái cây',599000,42)
on conflict do nothing;
