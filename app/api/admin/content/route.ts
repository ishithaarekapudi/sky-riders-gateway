import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { adminClient } from "../../../../lib/admin-access";
import { catalogTables, validateItem } from "../../../../lib/catalog-model";
import { fromRow } from "../../../../lib/catalog";
export async function POST(request: NextRequest) {
  const client = await adminClient();
  if (!client) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  try {
    const item = validateItem(await request.json());
    const table = catalogTables[item.kind];
    const { id, ...content } = item;
    // Keep the database slug and page address stable when editing existing records.
    const common = { published: item.published, directory_content: content };
    const fields = item.kind === "organizations" ? { ...common, name: item.title, description: item.summary, website_url: item.info.officialUrl || null, logo_url: item.logoUrl || null, homepage_partner: item.partner, partner_order: item.order }
      : item.kind === "careers" ? { ...common, title: item.title, summary: item.summary, education: item.education, skills: item.tags, icon: item.icon, sort_order: item.order }
      : { ...common, title: item.title, summary: item.summary, type: "scholarship" as const, eligibility: item.tags, deadline: item.deadline || null, location: item.location, application_url: item.info.officialUrl || null };
    if (id) {
      const { data: existing } = await client.from(table).select("*").eq("id", id).single();
      if (!existing || (item.kind === "scholarships" && "type" in existing && existing.type !== "scholarship")) throw new Error("This listing could not be found.");
      if (fromRow(item.kind, existing).slug !== item.slug) throw new Error("Keep the existing page address so saved links continue to work.");
    }
    const result = id ? await client.from(table).update(fields).eq("id", id).select("*").single()
      : await client.from(table).insert({ ...fields, slug: item.slug }).select("*").single();
    if (result.error) return NextResponse.json({ error: result.error.code === "23505" ? "That page address already exists. Choose another." : "Could not save. Check the database setup and try again." }, { status: 400 });
    revalidateTag("gateway-catalog", { expire: 0 });
    for (const path of ["/", "/sitemap.xml", `/${item.kind}`, `/${item.kind}/${item.slug}`]) revalidatePath(path);
    return NextResponse.json({ item: fromRow(item.kind, result.data) });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save the listing." }, { status: 400 }); }
}
