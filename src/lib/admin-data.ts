import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content";

type RoomType = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  capacity_adults: number;
  capacity_children: number;
  base_price: number;
  hero_image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function getAdminRoomTypes(): Promise<RoomType[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("room_types")
    .select("id,code,name,description,capacity_adults,capacity_children,base_price,hero_image_url,sort_order,is_active")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as RoomType[];
}

export async function getAdminSiteContent(): Promise<SiteContent> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key,value")
    .in("key", ["site_content"])
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data?.value) return defaultSiteContent;

  return {
    ...defaultSiteContent,
    ...(data.value as SiteContent),
  };
}
