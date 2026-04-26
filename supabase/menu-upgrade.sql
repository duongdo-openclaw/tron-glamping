alter table public.menu_items
  add column if not exists serving_period text not null default 'main';

update public.menu_items
set serving_period = case
  when category = 'drink' and name in ('Cà phê đen','Cà phê sữa','Nước cam','Trà quất mật ong') then 'breakfast'
  when category = 'food' and name in ('Trái cây theo mùa','Snack / bim bim') then 'breakfast'
  when category = 'combo' then 'main'
  else 'main'
end;

update public.menu_items set image_url = case name
  when 'Trà đào cam sả' then 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80'
  when 'Trà chanh sả' then 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=1200&q=80'
  when 'Trà quất mật ong' then 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=1200&q=80'
  when 'Nước suối' then 'https://images.unsplash.com/photo-1564419439262-c2f6c63cd3a0?auto=format&fit=crop&w=1200&q=80'
  when 'Coca / Pepsi' then 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=1200&q=80'
  when 'Bia Heineken' then 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80'
  when 'Bia Tiger' then 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=1200&q=80'
  when 'Nước cam' then 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1200&q=80'
  when 'Cà phê đen' then 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80'
  when 'Cà phê sữa' then 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'
  when 'BBQ set (cơ bản)' then 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80'
  when 'Gà nướng' then 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1200&q=80'
  when 'Xúc xích nướng' then 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80'
  when 'Khoai lang nướng' then 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80'
  when 'Ngô nướng' then 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80'
  when 'Mỳ xào' then 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=1200&q=80'
  when 'Cơm rang' then 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80'
  when 'Lẩu (tuỳ chọn)' then 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80'
  when 'Snack / bim bim' then 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=1200&q=80'
  when 'Trái cây theo mùa' then 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80'
  when 'Combo Chill 1' then 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80'
  when 'Combo Chill 2' then 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
  when 'Combo Family' then 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80'
  else image_url
end
where image_url is null or image_url = '';
