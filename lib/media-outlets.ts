import { createClient } from "./supabase/server";
import { mediaLogos } from "../app/about/media-logos";

export type MediaOutlet = { id: string; name: string; logoUrl: string; websiteUrl: string; published: boolean; sortOrder: number };
const fox: MediaOutlet = { id: "fox", name: "FOX", logoUrl: "/media-logos/fox.svg", websiteUrl: "", published: true, sortOrder: 0 };
const builtIn: MediaOutlet[] = [...mediaLogos.map((outlet, index) => ({ id: `built-in-${index}`, name: outlet.name, logoUrl: outlet.src, websiteUrl: "", published: true, sortOrder: index + 1 })), fox];

export async function getMediaOutlets() {
  try {
    const client = await createClient();
    const { data, error } = await (client as any).from("media_outlets").select("*").eq("published", true).order("sort_order", { ascending: true });
    if (error || !data?.length) return builtIn;
    const additions = data.map((item: any): MediaOutlet => ({ id: item.id, name: item.name, logoUrl: item.logo_url, websiteUrl: item.website_url || "", published: item.published, sortOrder: item.sort_order || 0 }));
    return [...builtIn, ...additions];
  } catch { return builtIn; }
}
