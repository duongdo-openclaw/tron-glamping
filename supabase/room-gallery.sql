alter table public.room_types
  add column if not exists gallery_images jsonb not null default '[]'::jsonb;

update public.room_types
set gallery_images = case
  when hero_image_url is not null and hero_image_url <> '' then jsonb_build_array(hero_image_url)
  else '[]'::jsonb
end
where gallery_images is null or gallery_images = '[]'::jsonb;
