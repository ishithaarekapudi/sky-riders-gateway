import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminClient } from "../../../../lib/admin-access";

export async function POST(request: NextRequest) {
  const client = await adminClient();
  if (!client) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  try {
    const input = await request.json() as Record<string, unknown>;
    const text = (value: unknown, max = 300) => typeof value === "string" ? value.trim().slice(0, max) : "";
    const id = text(input.id, 80), name = text(input.name, 120), logoUrl = text(input.logoUrl, 2000), websiteUrl = text(input.websiteUrl, 2000);
    if (!name || !logoUrl) throw new Error("An outlet name and logo URL are required.");
    const validUrl = (value: string) => value.startsWith("/") || /^https:\/\//.test(value);
    if (!validUrl(logoUrl) || (websiteUrl && !/^https:\/\//.test(websiteUrl))) throw new Error("Use an HTTPS website or logo URL, or a logo uploaded to this website.");
    const row = { name, logo_url: logoUrl, website_url: websiteUrl || null, published: input.published === true, sort_order: Math.max(0, Math.min(9999, Number(input.sortOrder) || 0)) };
    const result = id ? await (client as any).from("media_outlets").update(row).eq("id", id).select("*").single() : await (client as any).from("media_outlets").insert(row).select("*").single();
    if (result.error) throw new Error("Could not save the media outlet. Check the database update and try again.");
    revalidatePath("/about"); revalidatePath("/about/media");
    return NextResponse.json({ item: { id: result.data.id, name: result.data.name, logoUrl: result.data.logo_url, websiteUrl: result.data.website_url || "", published: result.data.published, sortOrder: result.data.sort_order || 0 } });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save the media outlet." }, { status: 400 }); }
}
